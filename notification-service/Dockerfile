FROM node:18-alpine

WORKDIR /app

# Copy package files first (best practice for caching)
COPY package*.json ./


# Install dependencies with clean permissions
RUN npm install -g @nestjs/cli && \
    npm install && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Copy app files
COPY --chown=node:node . .

# Build and run
RUN npm run build

CMD ["npm", "run", "start:prod"]