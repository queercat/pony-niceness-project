# Install dependencies only when needed
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN yarn install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

ENV NODE_ENV production
ENV PORT 3000

CMD ["yarn", "start"]

# FROM node:22-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV production
# ENV PORT 3000

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/prisma .
# COPY --from=builder /app/src/generated ./src/

# CMD ["yarn", "start"]
