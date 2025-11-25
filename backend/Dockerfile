FROM node:20-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./

# Install dependencies with Yarn (configured via corepack)
RUN corepack enable && yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
