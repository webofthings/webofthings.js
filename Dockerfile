FROM node:6-stretch
WORKDIR /wot
COPY . /wot
RUN npm install
EXPOSE 8484
CMD node wot.js
