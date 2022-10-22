FROM node:16.18-alpine AS build

WORKDIR /app

RUN npm i -g pnpm

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./

RUN npm pkg delete scripts.prepare

# install dependencies
RUN pnpm i 

# copy project files
COPY --chown=node:node . .

RUN pnpm generate

# build
RUN pnpm build

RUN pnpm i -P

FROM node:16.18-alpine As production

WORKDIR /home/node/app/
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules ./node_modules

USER node

ENV NODE_ENV production
EXPOSE 3000
CMD [ "node", "dist/main.js" ]