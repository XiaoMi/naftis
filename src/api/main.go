// Copyright 2018 Naftis Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/xiaomi/naftis/src/api/bootstrap"
	"github.com/xiaomi/naftis/src/api/executor"
	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/router"
	"github.com/xiaomi/naftis/src/api/service"
	"github.com/xiaomi/naftis/src/api/version"
	"github.com/xiaomi/naftis/src/api/worker"

	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	rootCmd = &cobra.Command{
		Use:               "naftis-api",
		Short:             "naftis API server",
		SilenceUsage:      true,
		DisableAutoGenTag: true,
		Long:              `Start naftis API server`,
		PersistentPreRunE: func(*cobra.Command, []string) error { return nil },
	}
	startCmd = &cobra.Command{
		Use:     "start",
		Short:   "Start naftis API server",
		Example: "naftis-api start -c config/in-local.toml.toml",
		RunE:    start,
	}
)

func init() {
	startCmd.PersistentFlags().StringVarP(&bootstrap.Args.ConfigFile, "config", "c", "config/in-local.toml",
		"Start server with provided configuration file")
	startCmd.PersistentFlags().StringVarP(&bootstrap.Args.Host, "host", "H", "0.0.0.0",
		"Start server with provided host")
	startCmd.PersistentFlags().IntVarP(&bootstrap.Args.Port, "port", "p", 50000,
		"Start server with provided port")
	startCmd.PersistentFlags().BoolVarP(&bootstrap.Args.InCluster, "inCluster", "i", true,
		"Start server in kube cluster")
	startCmd.PersistentFlags().StringVarP(&bootstrap.Args.IstioNamespace, "istioNamespace", "I", "istio-system",
		"Start server with provided deployed Istio namespace")

	rootCmd.AddCommand(startCmd)
	rootCmd.AddCommand(version.Command())
}

func start(_ *cobra.Command, _ []string) error {
	parseConfig()

	log.Init()
	mode := viper.GetString("mode")
	gin.SetMode(mode)
	bootstrap.SetDebug(mode)

	// set quit signal
	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// build HTTP server
	engine := gin.Default()
	executor.Init()
	router.Init(engine)
	service.Init()
	server := &http.Server{
		Addr:    fmt.Sprintf("%s:%d", bootstrap.Args.Host, bootstrap.Args.Port),
		Handler: engine,
	}

	// start worker
	go worker.Start()

	// graceful shutdown server
	go func() {
		<-quit
		worker.Stop()
		fmt.Println("stoping server now")
		if err := server.Close(); err != nil {
			fmt.Println("Server Close:", err)
		}
	}()

	// start HTTP server
	if err := server.ListenAndServe(); err != nil {
		if err == http.ErrServerClosed {
			fmt.Printf("Server closed under request\n")
		} else {
			fmt.Printf("Server closed unexpect, %s\n", err.Error())
		}
	}

	return nil
}

func parseConfig() {
	viper.SetConfigFile(bootstrap.Args.ConfigFile)
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("parse config file fail: %s", err))
	}

	// init Naftis namespace
	b, err := ioutil.ReadFile("/var/run/secrets/kubernetes.io/serviceaccount/namespace") // just pass the file name
	if err != nil || string(b) == "" {
		log.Info("[k8s] get Naftis namespace fail or get empty namespace, use `naftis` by default", "err", err, "namespace", string(b))
		bootstrap.Args.Namespace = "naftis"
	} else {
		bootstrap.Args.Namespace = string(b)
	}
	log.Info("[Args]", "Host", bootstrap.Args.Host)
	log.Info("[Args]", "Port", bootstrap.Args.Port)
	log.Info("[Args]", "InCluster", bootstrap.Args.InCluster)
	log.Info("[Args]", "ConfigFile", bootstrap.Args.ConfigFile)
	log.Info("[Args]", "Namespace", bootstrap.Args.Namespace)
	log.Info("[Args]", "IstioNamespace", bootstrap.Args.IstioNamespace)
	println()
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(-1)
	}
}
