# Copyright 2018 Naftis Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

SHELL := /bin/bash
BASE_PATH := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

TITLE := $(shell basename $(BASE_PATH))
SHORT_REV := $(shell git rev-parse HEAD | cut -c1-8)
BUILD_TIME := $(shell date +%Y-%m-%d--%T)
APP_PKG := $(shell $(BASE_PATH)/tool/apppkg.sh)
UI := $(BASE_PATH)/src/ui
export BIN_OUT := $(BASE_PATH)/bin

all: print fmt lint vet test build docker push

print:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making print<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@echo SHELL:$(SHELL)
	@echo BASE_PATH:$(BASE_PATH)
	@echo TITLE:$(TITLE)
	@echo SHORT_REV:$(SHORT_REV)
	@echo APP_PKG:$(APP_PKG)
	@echo BIN_OUT:$(BIN_OUT)
	@echo USER:$(USER)
	@echo HUB:$(HUB)
	@echo UI:$(UI)
	@echo -e "\n"

fmt:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making fmt<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	go fmt $(APP_PKG)/src/api/...
	@echo -e "\n"

lint:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making lint<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@LINTOUT=`$(GOPATH)/bin/golint $(BASE_PATH)/src/api/... | grep -v pb.go`;\
	if [ "$$LINTOUT" != "" ]; then\
		/bin/echo -E $$LINTOUT;\
		exit 1;\
	else\
		echo "lint success";\
	fi
	@echo -e "\n"

vet:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making vet<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@VETOUT=`go vet $(APP_PKG)/src/api/... 2>&1`;\
	if [ "$$VETOUT" != "" ]; then\
		echo $$VETOUT;\
		exit 1;\
	else\
		echo "vet success";\
	fi
	@echo -e "\n"

test:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making test<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@echo "test success" # TODO add test script
	@echo -e "\n"

build: print build.api build.ui build.manifest

build.api:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build.api<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	tool/build.sh ${BIN_OUT}/naftis-api ${APP_PKG}/src/api/version ${APP_PKG}/src/api
	@echo -e "\n"

build.manifest:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build.manifest<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	tool/genmanifest.sh config/in-cluster.toml
	@echo -e "\n"

build.ui:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build.ui<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@cd $(UI) && npm i && npm run build && cp -r dist $(BASE_PATH)/
	@echo -e "\n"

docker: docker.api docker.ui

docker.api:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making docker.api<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@docker build -t $(HUB)/naftis-api:latest -f ./Dockerfile.api .
	@echo -e "\n"

docker.apidebug:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making docker.apidebug<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@docker build -t $(HUB)/naftis-api:latest -f ./Dockerfile.api_debug .
	@echo -e "\n"

docker.ui:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making docker.ui<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@docker build -t $(HUB)/naftis-ui:latest -f ./Dockerfile.ui .
	@echo -e "\n"

push: push.api push.ui

push.api:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making push.api<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@docker push $(HUB)/naftis-api:latest
	@echo -e "\n"

push.ui:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making push.ui<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@docker push $(HUB)/naftis-ui:latest
	@echo -e "\n"

tar:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making tar<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	$(eval TAR=$(BASE_PATH)/$(TITLE)_$(SHORT_REV).tar.gz)
	@cd $(BASE_PATH) && tar zcf $(TAR) bin config Gopkg.* dist >/dev/null
	@echo $(TAR)
	@echo -e "\n"
