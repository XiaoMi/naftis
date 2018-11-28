#!/bin/bash

mkdir naftis
curl -L https://api.github.com/repos/xiaomi/naftis/tarball | tar -zx -C naftis --strip-components=1

cd naftis
curl -s https://api.github.com/repos/xiaomi/naftis/releases/latest | grep "browser_download_url" | cut -d : -f 2,3 | tr -d \" | wget -qi - && tar zxvf manifest.tar.gz

