FROM node:21

WORKDIR /usr/src/app

COPY node/ .
COPY protos ../protos

RUN npm install

RUN chmod +x ../protos/gen_minter.sh
RUN ../protos/gen_minter.sh

CMD ["node", "server.js"]