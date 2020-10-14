#!/bin/sh

set -eu

npm --version

npm install
#npm run build -- --prod
npm run build

cd dist/
tar zcvf dist.tar.gz *
mv dist.tar.gz /usr/share/nginx/html/
