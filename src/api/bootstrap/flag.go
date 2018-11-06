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

package bootstrap

var debug bool

// Args provides all startup parameters for naftis-api service.
var Args args

type args struct {
	Host           string
	Port           int
	InCluster      bool
	ConfigFile     string
	Namespace      string
	IstioNamespace string
}

// SetDebug sets application running mode.
func SetDebug(mode string) {
	if mode == "debug" {
		debug = true
	}
}

// Debug returns application running mode.
func Debug() bool {
	return debug
}
