module github.com/xiaomi/naftis

go 1.12

require (
	github.com/cenkalti/backoff v2.1.1+incompatible // indirect
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/dvwright/xss-mw v0.0.0-20170109072128-5b2fd362dcaf
	github.com/erikstmartin/go-testdb v0.0.0-20160219214506-8d10e4a1bae5 // indirect
	github.com/ghodss/yaml v1.0.0
	github.com/gin-contrib/sse v0.0.0-20170109093832-22d885f9ecc7 // indirect
	github.com/gin-gonic/gin v1.3.0
	github.com/gorilla/websocket v1.4.1
	github.com/hashicorp/go-multierror v1.0.0
	github.com/jinzhu/gorm v1.9.1
	github.com/jinzhu/inflection v0.0.0-20180308033659-04140366298a // indirect
	github.com/jinzhu/now v1.0.0 // indirect
	github.com/microcosm-cc/bluemonday v1.0.0 // indirect
	github.com/prometheus/client_golang v1.11.1
	github.com/prometheus/common v0.26.0
	github.com/sevenNt/wzap v1.0.0
	github.com/spf13/cast v1.3.1
	github.com/spf13/cobra v1.0.0
	github.com/spf13/viper v1.4.0
	github.com/stretchr/testify v1.5.1
	gopkg.in/go-playground/assert.v1 v1.2.1 // indirect
	gopkg.in/go-playground/validator.v8 v8.18.2 // indirect
	istio.io/istio v0.0.0-20200708154433-f508fdd78eb0
	k8s.io/api v0.18.1
	k8s.io/apimachinery v0.18.1
	k8s.io/client-go v0.18.0
)

replace github.com/ugorji/go/codec => github.com/ugorji/go v1.1.2
