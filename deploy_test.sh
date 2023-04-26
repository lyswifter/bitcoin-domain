#!/bin/bash

rm test.tar.gz

echo "remove old tar file ok."

npm install

npm run build

echo "build ok."

tar -czvf test.tar.gz test

scp -i ~/.ssh/bitcoin.pem test.tar.gz ubuntu@54.234.246.200:/home/ubuntu/

echo "upload test finished!"