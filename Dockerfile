# Use full Node image with build tools
FROM node:current-alpine

# Install dependencies for native modules (if needed)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 5001

# Default command in dev mode
CMD ["npm", "run", "dev"]
