FROM node:12.18.4

RUN apt-get update && apt install -y libprotobuf-dev protobuf-compiler && apt-get -y install cmake && apt-get -y install exiftool

RUN mkdir -p /usr/src/backend

WORKDIR /usr/src/backend

COPY . /usr/src/backend

RUN npm install -g nodemon pm2