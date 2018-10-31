package handler

import (
	"errors"
	"io"
	"io/ioutil"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/xiaomi/naftis/src/api/service"
	"istio.io/istio/pilot/pkg/kube/inject"
)

var (
	// ErrEmptyConfig is returned when request contains invalid config
	ErrEmptyConfig = errors.New("invalid config")
	// ErrEmptyBody is returned when request body is empty
	ErrEmptyBody = errors.New("empty body")
)

//curl -F "config=@bookinfo.yaml" http://localhost:50000/open-api/inject/file
func InjectToFile(c *gin.Context) {
	// istio config
	file, err := c.FormFile("config")
	if err != nil {
		c.Writer.Write([]byte(err.Error() + "\n"))
		c.Writer.Flush()
	}

	if file == nil {
		c.Writer.Write([]byte(ErrEmptyConfig.Error() + "\n"))
		c.Writer.Flush()
	}

	tmp_path := viper.GetString("upload_tmp") + file.Filename
	defer func() {
		os.Remove(tmp_path)
	}()

	err = c.SaveUploadedFile(file, tmp_path)
	if err != nil {
		c.Writer.Write([]byte(err.Error() + "\n"))
		c.Writer.Flush()
	}

	var in *os.File
	var reader io.Reader

	in, err = os.Open(tmp_path)
	if err != nil {
		c.Writer.Write([]byte(err.Error() + "\n"))
		c.Writer.Flush()
	}
	reader = in

	meshConfig, err := service.IstioInfo.GetMeshConfigFromConfigMap()
	if err != nil {
		c.Writer.Write([]byte(err.Error() + "\n"))
		c.Writer.Flush()
	}

	injectConfig, err := service.IstioInfo.GetInjectConfigFromConfigMap()
	if err != nil {
		c.Writer.Write([]byte(err.Error() + "\n"))
		c.Writer.Flush()
	}

	inject.IntoResourceFile(injectConfig, meshConfig, reader, c.Writer)
}

// curl -X POST --data-binary @bookinfo.yaml -H "Content-type: text/yaml" http://localhost:50000/open-api/inject/context
func Context(c *gin.Context) {
	data, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.Writer.Write([]byte(err.Error() + "\n"))
		c.Writer.Flush()
	}

	if string(data) == "" {
		c.Writer.Write([]byte(ErrEmptyBody.Error() + "\n"))
		c.Writer.Flush()
	}

	meshConfig, err := service.IstioInfo.GetMeshConfigFromConfigMap()
	if err != nil {
		c.Writer.Write([]byte(err.Error() + "\n"))
		c.Writer.Flush()
	}

	injectConfig, err := service.IstioInfo.GetInjectConfigFromConfigMap()
	if err != nil {
		c.Writer.Write([]byte(err.Error() + "\n"))
		c.Writer.Flush()
	}

	inject.IntoResourceFile(injectConfig, meshConfig, c.Request.Body, c.Writer)
}
