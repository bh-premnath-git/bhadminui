# --- Build Stage ---
FROM node:current-alpine3.22 AS builder
WORKDIR /app

ARG NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_UI_REDIRECT_URL
ARG NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL
ENV NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL \
    NEXT_PUBLIC_KEYCLOAK_REALM=$NEXT_PUBLIC_KEYCLOAK_REALM \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID \
    NEXT_PUBLIC_UI_REDIRECT_URL=$NEXT_PUBLIC_UI_REDIRECT_URL \
    NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL=$NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL

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

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js

EXPOSE 5001
CMD ["node", "server.js"]
