# Stage 1: Build the Next.js app
FROM node:current-alpine AS builder

WORKDIR /app

# Keycloak config will be injected as environment variables at runtime via Helm/Kubernetes

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
