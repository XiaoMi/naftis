#!/bin/bash

# usage: ./tool/cleanup.sh
kubectl delete -n naftis -f mysql.yaml
kubectl delete -n naftis -f naftis.yaml