FROM node:20 as build

WORKDIR /groshi-web

ARG GROSHI_SOCKET

COPY package*.json ./
COPY ./src/ ./src/
COPY ./public/ ./public/

RUN npm install
RUN REACT_APP_GROSHI_SOCKET=$GROSHI_SOCKET npm run build

FROM node:20 as run

COPY --from=build /groshi-web/build /groshi-web/build
RUN npm install -g serve

EXPOSE 8080
ENTRYPOINT ["serve", "-l", "8080", "-s", "/groshi-web/build"]
