package main

import (
	"flag"
	"fmt"
	"strconv"
)

var (
	tmpls = map[string]string{
		"requestRouting": `apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: {{.Host}}
spec:
  hosts:
  - {{.Host}}
  http:
  - route:
    - destination:
        name: {{.Host}}
        subset: {{.DestinationSubset}}
`,
		"trafficShifting": `apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: {{.Host}}
spec:
  hosts:
  - reviews
  http:
  - route:
    - destination:
        name: {{.Host}}
        subset: {{.DestinationSubset1}}
      weight: {{.Weight1}}
    - destination:
        name: {{.Host}}
        subset: {{.DestinationSubset2}}
      weight: {{.Weight2}}
`,
		"circuitBreaking": `apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: {{.Host}}
spec:
  name: {{.Host}}
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: {{.MaxConnections}}
      http:
        http1MaxPendingRequests: {{.Http1MaxPendingRequests}}
        maxRequestsPerConnection: {{.MaxRequestsPerConnection}}
    outlierDetection:
      http:
        consecutiveErrors: 1
        interval: 1s
        baseEjectionTime: 3m
        maxEjectionPercent: 100
`,
		"rateLimit": `apiVersion: config.istio.io/v1alpha2
kind: memquota
metadata:
  name: handler
  namespace: istio-system
spec:
  quotas:
  - name: requestcount.quota.istio-system
    # default rate limit is 5000qps
    maxAmount: 5000
    validDuration: 1s
    # The first matching override is applied.
    # A requestcount instance is checked against override dimensions.
    overrides:
    # The following override applies to traffic from 'rewiews' version v2,
    # destined for the ratings service. The destinationVersion dimension is ignored.
    - dimensions:
        destination: {{.DestinationHost}}
        source: {{.SourceHost}}
        sourceVersion: {{.SourceVersion}}
      maxAmount: {{.MaxAmount}}
      validDuration: 1s
`,
		"timeout": `apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: {{.Host}}
spec:
  hosts:
    - {{.Host}}
  http:
  - route:
    - destination:
        name: {{.Host}}
        subset: {{.DestinationSubset}}
    timeout: {{.Timeout}}s
`,
	}
)

func main() {
	tmplName := flag.String("name", "", "")
	flag.Parse()
	fmt.Println(strconv.Quote(tmpls[*tmplName]))
}
