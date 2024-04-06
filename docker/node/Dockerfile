FROM node:21

WORKDIR /minter 
COPY minter/. .
COPY protos ../protos
COPY package*.json ./

RUN npm install
RUN chmod +x ../protos/gen_minter.sh
RUN chmod +x ../protos/gen_minter.sh
RUN ../protos/gen_minter.sh
COPY . .

CMD ["node", "server.js"]
