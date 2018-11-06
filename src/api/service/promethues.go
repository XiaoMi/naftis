// Copyright 2018 Istio Authors
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

// Package service provides prometheus service for user to query metrics.
package service

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/xiaomi/naftis/src/api/bootstrap"
	"github.com/xiaomi/naftis/src/api/log"

	"github.com/prometheus/client_golang/api"
	"github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/prometheus/common/model"
)

// Prom wraps prom service for easily use.
var Prom *prom

type prom struct {
	api v1.API
}

const (
	localPromURL    = "http://localhost:9090"
	istioPromURLFmt = "http://prometheus.%s:9090"
)

var (
	istioPromURL = ""
)

// InitProm initializes prometheus service.
func InitProm() {
	istioPromURL = fmt.Sprintf(istioPromURLFmt, bootstrap.Args.IstioNamespace)
	addr := localPromURL
	if bootstrap.Args.InCluster {
		addr = istioPromURL
	}
	client, err := api.NewClient(api.Config{Address: addr})
	if err != nil {
		log.Error("[Prom] init fail")
	}
	Prom = &prom{
		api: v1.NewAPI(client),
	}
}

// Query queries prometheus Value with specific query string.
func (p *prom) Query(q string) (model.Value, error) {
	return p.api.Query(context.Background(), q, time.Now())
}

// Graph represents a service graph generated.
type Graph struct {
	Nodes map[string]struct{} `json:"nodes"`
	Edges []*Edge             `json:"edges"`
}

// Edge represents an edge in a service graph.
type Edge struct {
	Source string     `json:"source"`
	Target string     `json:"target"`
	Labels Attributes `json:"labels"`
}

// Attributes contain a set of annotations for an edge.
type Attributes map[string]string

// AddEdge adds a new edge to an existing dynamic graph.
func (g *Graph) AddEdge(src, target string, lbls map[string]string) {
	g.Edges = append(g.Edges, &Edge{src, target, lbls})
	g.Nodes[src] = struct{}{}
	g.Nodes[target] = struct{}{}
}

func (p *prom) Graph(q string, label string) (*Graph, error) {
	val, err := p.Query(q)
	if err != nil {
		log.Info("[Graph] Query fail", "error", err)
		return nil, err
	}
	switch val.Type() {
	case model.ValVector:
		matrix := val.(model.Vector)
		d := &Graph{Nodes: map[string]struct{}{}, Edges: []*Edge{}}
		for _, sample := range matrix {

			metric := sample.Metric
			// todo: add error checking here
			// TODO istio-0.8.0
			// src := strings.Replace(string(metric["source_service"]), ".svc.cluster.local", "", -1)
			// srcVer := string(metric["source_version"])
			// dst := strings.Replace(string(metric["destination_service"]), ".svc.cluster.local", "", -1)
			// dstVer := string(metric["destination_version"])
			//
			// value := sample.Value
			// d.AddEdge(
			// 	src+" ("+srcVer+")",
			// 	dst+" ("+dstVer+")",
			// 	Attributes{
			// 		label: strconv.FormatFloat(float64(value), 'f', 6, 64),
			// 	})

			// TODO istio-1.0.0
			srcWorkload := string(metric["source_workload"])
			src := string(metric["source_app"])
			dstWorkload := string(metric["destination_workload"])
			dst := string(metric["destination_app"])

			value := sample.Value
			d.AddEdge(
				src+" ("+srcWorkload+")",
				dst+" ("+dstWorkload+")",
				Attributes{
					label: strconv.FormatFloat(float64(value), 'f', 6, 64),
				})
		}
		return d, nil
	default:
		return nil, fmt.Errorf("unknown value type returned from query: %#v", val)
	}
}

const (
	// TODO istio-0.8.0
	// reqsFmt = "sum(rate(istio_request_count[%s])) by (source_service, destination_service, source_version, destination_version)"
	// tcpFmt  = "sum(rate(istio_tcp_bytes_received[%s])) by (source_service, destination_service, source_version, destination_version)"
	// TODO istio-1.0.0
	reqsFmt = "sum(rate(istio_requests_total{reporter=\"destination\"}[%s])) by (source_workload, destination_workload, source_app, destination_app)"
	tcpFmt  = "sum(rate(istio_tcp_received_bytes_total{reporter=\"destination\"}[%s])) by (source_workload, destination_workload, source_app, destination_app)"
)
const emptyFilter = " > 0"

func (p *prom) Generate(timeHorizon, filterEmptyStr string) *Graph {
	if timeHorizon == "" {
		timeHorizon = "5m"
	}
	filterEmpty := false
	if filterEmptyStr == "true" {
		filterEmpty = true
	}

	query := fmt.Sprintf(reqsFmt, timeHorizon)
	if filterEmpty {
		query += emptyFilter
	}
	graph, err := p.Graph(query, "reqs/sec")
	if err != nil {
		log.Info("[Generate] reqs/sec fail", "error", err)
		return nil
	}

	query = fmt.Sprintf(tcpFmt, timeHorizon)
	if filterEmpty {
		query += emptyFilter
	}
	tcpGraph, err := p.Graph(query, "bytes/sec")
	if err != nil {
		log.Info("[Generate] bytes/sec fail", "error", err)
		return nil
	}

	g, err := merge(graph, tcpGraph)
	if err != nil {
		log.Info("[Generate] merge fail", "error", err)
		return nil
	}

	return g
}

func merge(g1, g2 *Graph) (*Graph, error) {
	d := Graph{Nodes: map[string]struct{}{}, Edges: []*Edge{}}
	d.Edges = append(d.Edges, g1.Edges...)
	d.Edges = append(d.Edges, g2.Edges...)
	for nodeName, nodeValue := range g1.Nodes {
		d.Nodes[nodeName] = nodeValue
	}
	for nodeName, nodeValue := range g2.Nodes {
		d.Nodes[nodeName] = nodeValue
	}
	return &d, nil
}

type (
	// D3Graph represents a service d3 graph generated.
	D3Graph struct {
		Nodes []d3Node `json:"nodes"`
		Links []d3Link `json:"links"`
	}
	d3Node struct {
		Name string `json:"name"`
	}
	d3Link struct {
		Source int        `json:"source"`
		Target int        `json:"target"`
		Labels Attributes `json:"labels"`
	}
)

func indexOf(nodes []d3Node, name string) (int, error) {
	for i, v := range nodes {
		if v.Name == name {
			return i, nil
		}
	}
	return 0, errors.New("invalid graph")
}

// GenerateD3JSON generates D3Graph instance.
func GenerateD3JSON(g *Graph) D3Graph {
	graph := D3Graph{
		Nodes: make([]d3Node, 0, len(g.Nodes)),
		Links: make([]d3Link, 0, len(g.Edges)),
	}
	for k := range g.Nodes {
		n := d3Node{
			Name: k,
		}
		graph.Nodes = append(graph.Nodes, n)
	}
	for _, v := range g.Edges {
		s, err := indexOf(graph.Nodes, v.Source)
		if err != nil {
			log.Info("[GenerateD3JSON] fail", "error", err)
			return graph
		}
		t, err := indexOf(graph.Nodes, v.Target)
		if err != nil {
			log.Info("[GenerateD3JSON] fail", "error", err)
			return graph
		}
		l := d3Link{
			Source: s,
			Target: t,
			Labels: v.Labels,
		}
		graph.Links = append(graph.Links, l)
	}
	return graph
}

// Filter regenerates Graph with specific root node.
func (g *Graph) Filter(nodeName string) *Graph {
	sedges := make(map[string][]*Edge)
	for _, e := range g.Edges {
		if _, ok := sedges[e.Source]; ok {
			sedges[e.Source] = append(sedges[e.Source], e)
		} else {
			sedges[e.Source] = make([]*Edge, 0)
		}
	}

	ns, es := g.getNodesAndEdges(nodeName, sedges)
	g.Nodes = make(map[string]struct{})
	g.Edges = make([]*Edge, 0, len(es))
	for _, node := range ns {
		g.Nodes[node] = struct{}{}
	}
	for _, edge := range es {
		g.Edges = append(g.Edges, edge)
	}

	return g
}

func (g *Graph) getNodesAndEdges(nodeName string, sedges map[string][]*Edge) ([]string, []*Edge) {
	retNodes := make([]string, 0)
	retEdges := make([]*Edge, 0)

	retNodes = append(retNodes, nodeName)
	if edges, ok := sedges[nodeName]; ok {
		retEdges = append(retEdges, edges...)
		for _, edge := range edges {
			ns, ls := g.getNodesAndEdges(edge.Target, sedges)
			retNodes = append(retNodes, ns...)
			retEdges = append(retEdges, ls...)
		}
	}
	return retNodes, retEdges
}
