#!/bin/bash
echo "Compiling protos"

cd minter
npm install
../protos/gen_minter.sh
