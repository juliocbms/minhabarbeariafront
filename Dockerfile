FROM node:22.14.0

RUN apt-get update && apt-get install -qq -y --no-install-recommends




ENV INSTALL_PATH /barbeariafront

RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY package*.json ./

RUN yarn global add @angular/cli@19.1.5
#RUN npm i -g @angular/cli@19.1.5  --save-dev

RUN yarn install
#RUN npm install

COPY . .