# Multi-architecture Dockerfile for Short Video Platform
# Supports both AMD64 and ARM64 architectures

# Use multi-platform base image
FROM --platform=$BUILDPLATFORM node:18-alpine AS base

# Install system dependencies for cross-compilation
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
COPY mobile/package*.json ./mobile/

# Install root dependencies
RUN npm ci --only=production --ignore-scripts

# Backend stage
FROM base AS backend
WORKDIR /app/backend

# Install backend dependencies
RUN npm ci --only=production --ignore-scripts

# Copy backend source code
COPY backend/src ./src
COPY backend/config ./config
COPY backend/public ./public

# Create uploads directory
RUN mkdir -p uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start backend service
CMD ["npm", "start"]

# Frontend stage
FROM base AS frontend
WORKDIR /app/frontend

# Install frontend dependencies
RUN npm ci --ignore-scripts

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Production stage (combined)
FROM base AS production
WORKDIR /app

# Copy backend
COPY --from=backend /app/backend ./backend
COPY --from=backend /app/uploads ./uploads

# Copy frontend
COPY --from=frontend /app/frontend/dist ./frontend/dist

# Install production dependencies
WORKDIR /app/backend
RUN npm ci --only=production --ignore-scripts

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create necessary directories
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["npm", "start"]

# Development stage (for local development)
FROM base AS development
WORKDIR /app

# Install all dependencies
RUN npm ci --ignore-scripts
WORKDIR /app/backend && npm ci --ignore-scripts
WORKDIR /app/frontend && npm ci --ignore-scripts
WORKDIR /app/mobile && npm ci --ignore-scripts
WORKDIR /app

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Expose ports
EXPOSE 3000 19000 19001 19002

# Start development servers
CMD ["npm", "run", "dev"]

# Mobile development stage
FROM base AS mobile-dev
WORKDIR /app/mobile

# Install mobile dependencies
RUN npm ci --ignore-scripts

# Copy mobile source code
COPY mobile/ ./

# Set environment variables
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV EXPO_DEVTOOLS_LISTEN_PORT=19000

# Expose Expo ports
EXPOSE 19000 19001 19002

# Start Expo development server
CMD ["npx", "expo", "start", "--host", "0.0.0.0"]
