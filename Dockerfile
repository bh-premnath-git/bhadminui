# --- Build Stage ---
FROM node:current-alpine3.22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Runtime Stage ---
FROM node:current-alpine3.22 AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/ ./

EXPOSE 5001
CMD ["node", "server.js"]
