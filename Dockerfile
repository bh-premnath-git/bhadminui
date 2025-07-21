# Stage 1: Build the Next.js app
FROM node:current-alpine AS builder

WORKDIR /app

# Define build arguments for Keycloak configuration
ARG NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_UI_REDIRECT_URL
ARG NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL

# Set environment variables from build arguments
ENV NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL
ENV NEXT_PUBLIC_KEYCLOAK_REALM=$NEXT_PUBLIC_KEYCLOAK_REALM
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ENV NEXT_PUBLIC_UI_REDIRECT_URL=$NEXT_PUBLIC_UI_REDIRECT_URL
ENV NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL=$NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source code
COPY . .

# Build Next.js app
RUN npm run build

# Remove dev dependencies if any
RUN npm prune --production

# Stage 2: Production runtime with PM2
FROM node:current-alpine AS runner

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy built app and required files from builder
COPY --from=builder /app /app

# Ensure dotenv exists (in case prune removed it)
RUN npm install --production --no-save dotenv

# Expose your port
EXPOSE 5001

# Use PM2 to run the app in production mode
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
