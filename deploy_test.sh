#!/bin/bash

rm dist.tar.gz

echo "remove old tar file ok."

# npm install

npm run build

echo "build ok."

tar -czvf dist.tar.gz dist

scp dist.tar.gz root@137.184.180.14:/root

echo "upload finished!"