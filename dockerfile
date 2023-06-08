# build stage
FROM node:18 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com

RUN npm install

# 构建缓存，package.json未发生变化的时候就不用重新下包
COPY . .

RUN npm run build

# production stage
FROM node:18 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --production

RUN npm install pm2 -g

# Nest 服务需要在3000端口
EXPOSE 3000

CMD [ "pm2-runtime", "/app/main.js" ]
