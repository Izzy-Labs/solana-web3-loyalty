FROM node:21

WORKDIR /minter

COPY minter/. .
COPY protos ../protos

RUN npm install

RUN chmod +x ../protos/gen_minter.sh
RUN ../protos/gen_minter.sh

CMD ["npx", "ts-node", "src/server.ts"]