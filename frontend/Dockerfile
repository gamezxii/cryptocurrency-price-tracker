FROM node:20-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm ci

FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production \
    NEXT_SHARP_PATH= \
    PORT=3001

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3001

CMD ["npm", "run", "start"]
