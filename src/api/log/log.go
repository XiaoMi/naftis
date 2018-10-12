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

package log

import (
	"github.com/sevenNt/wzap"
	"github.com/spf13/viper"
)

// Init initializes log pkg.
func Init() {
	logger := wzap.New(
		wzap.WithOutputKV(viper.GetStringMap("logger.console")),
		wzap.WithOutputKV(viper.GetStringMap("logger.zap")),
	)
	wzap.SetDefaultLogger(logger)
}

// Debug logs debug level messages with default logger.
func Debug(msg string, args ...interface{}) {
	wzap.Debug(msg, args...)
}

// Info logs Info level messages with default logger in structured-style.
func Info(msg string, args ...interface{}) {
	wzap.Info(msg, args...)
}

// Warn logs Warn level messages with default logger in structured-style.
func Warn(msg string, args ...interface{}) {
	wzap.Warn(msg, args...)
}

// Error logs Error level messages with default logger in structured-style.
// Notice: additional stack will be added into messages.
func Error(msg string, args ...interface{}) {
	wzap.Error(msg, args...)
}

// Panic logs Panic level messages with default logger in structured-style.
// Notice: additional stack will be added into messages, meanwhile logger will panic.
func Panic(msg string, args ...interface{}) {
	wzap.Panic(msg, args...)
}

// Fatal logs Fatal level messages with default logger in structured-style.
// Notice: additional stack will be added into messages, then calls os.Exit(1).
func Fatal(msg string, args ...interface{}) {
	wzap.Fatal(msg, args...)
}
