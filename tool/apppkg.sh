#! /bin/bash

# get import path of current go project.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo ${ROOT//$GOPATH\/src\//}
