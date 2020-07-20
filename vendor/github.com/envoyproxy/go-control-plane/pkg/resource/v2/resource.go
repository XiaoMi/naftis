package resource

import (
	"github.com/golang/protobuf/ptypes"

	listener "github.com/envoyproxy/go-control-plane/envoy/api/v2/listener"
	hcm "github.com/envoyproxy/go-control-plane/envoy/config/filter/network/http_connection_manager/v2"
	"github.com/envoyproxy/go-control-plane/pkg/conversion"
)

// Resource types in xDS v2.
const (
	apiTypePrefix       = "type.googleapis.com/envoy.api.v2."
	discoveryTypePrefix = "type.googleapis.com/envoy.service.discovery.v2."
	EndpointType        = apiTypePrefix + "ClusterLoadAssignment"
	ClusterType         = apiTypePrefix + "Cluster"
	RouteType           = apiTypePrefix + "RouteConfiguration"
	ListenerType        = apiTypePrefix + "Listener"
	SecretType          = apiTypePrefix + "auth.Secret"
	RuntimeType         = discoveryTypePrefix + "Runtime"

	// AnyType is used only by ADS
	AnyType = ""
)

// GetHTTPConnectionManager creates a HttpConnectionManager from filter
func GetHTTPConnectionManager(filter *listener.Filter) *hcm.HttpConnectionManager {
	config := &hcm.HttpConnectionManager{}

	// use typed config if available
	if typedConfig := filter.GetTypedConfig(); typedConfig != nil {
		ptypes.UnmarshalAny(typedConfig, config)
	} else {
		conversion.StructToMessage(filter.GetConfig(), config)
	}
	return config
}
