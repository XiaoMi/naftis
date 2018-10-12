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

package model

import (
	"bytes"
	"testing"
	"text/template"

	"github.com/stretchr/testify/assert"
)

var (
	requestRouting = map[string]string{
		"DestinationHost":   "rating",
		"DestinationSubset": "v1",
	}
)

func TestRequestRouting(t *testing.T) {
	tmpl, err := template.New("test").Parse(`
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: {{.DestinationHost}}
  ...
spec:
  hosts:
  - details
  http:
  - route:
    - destination:
        host: {{.DestinationHost}}
        subset: {{.DestinationSubset}}`)
	assert.NoError(t, err)

	var b bytes.Buffer
	err = tmpl.Execute(&b, requestRouting)
	assert.NoError(t, err)

	actual := b.String()
	expect := `
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: rating
  ...
spec:
  hosts:
  - details
  http:
  - route:
    - destination:
        host: rating
        subset: v1`

	assert.Equal(t, expect, actual)
}
