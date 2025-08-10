# Multi-stage build for Short Video Platform
FROM node:18-alpine AS base

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Backend stage
FROM base AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/src ./src
COPY backend/config ./config

# Frontend stage
FROM base AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Mobile stage (for development/testing)
FROM base AS mobile
WORKDIR /app/mobile
COPY mobile/package*.json ./
RUN npm ci
COPY mobile/ ./

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy backend
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/dist /app/frontend/dist

# Install production dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
