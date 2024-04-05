#!/bin/bash

echo "Compiling minter proto"
mkdir -p ./src/proto
npx node ./node_modules/.bin/grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./src/proto   --grpc_out=grpc_js:./src/proto   --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin   -I ../protos   minter.proto
npx node ./node_modules/.bin/grpc_tools_node_protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts   --ts_out=service=true:./src/proto   -I ../protos   minter.proto
echo "Compiled minter proto"