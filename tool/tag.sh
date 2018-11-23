#!/bin/bash

# TODO modify TAG of released Naftis during CI
# export TAG=$(if [ `git branch | grep \* | cut -d ' ' -f2` != "master" ]; then git checkout master --quiet; fi && git describe --tags --abbrev=0)
if [[ -z $TAG ]]; then
    TAG=`git describe --tags --abbrev=0`
fi

echo $TAG