FROM node:16-alpine as builder

ENV NODE_ENV production
ENV CI true

WORKDIR /app
RUN chown -R node:node /app

USER node

COPY --chown=node:node ./package*.json ./

RUN npm ci --also=dev

COPY --chown=node:node . ./

RUN npm run ts:compile && npm prune --production

RUN cp .env.production dist/.env \
    && cp package*.json dist/ \
    && cp -r node_modules dist/

# Running image
FROM node:16-alpine

ENV NODE_ENV production
ENV CI true

WORKDIR /app
RUN chown -R node:node /app

COPY --from=builder /app/dist .

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
