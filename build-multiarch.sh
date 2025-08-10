#!/bin/bash

# Multi-architecture Docker build script for Short Video Platform
# Supports AMD64 and ARM64 architectures

set -e

# Configuration
IMAGE_NAME="zbaimo/shortvideo"
VERSION=${1:-latest}
PLATFORMS="linux/amd64,linux/arm64"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting multi-architecture Docker build for Short Video Platform${NC}"
echo -e "${YELLOW}Image: ${IMAGE_NAME}:${VERSION}${NC}"
echo -e "${YELLOW}Platforms: ${PLATFORMS}${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if buildx is available
if ! docker buildx version > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker buildx is not available. Please enable buildx and try again.${NC}"
    exit 1
fi

# Create and use new builder instance for multi-architecture builds
echo -e "${YELLOW}🔧 Setting up multi-architecture builder...${NC}"
docker buildx create --name multiarch-builder --use --driver docker-container || true
docker buildx inspect --bootstrap

# Build and push multi-architecture images
echo -e "${YELLOW}🏗️  Building and pushing multi-architecture images...${NC}"

# Build all targets for multiple architectures
docker buildx build \
    --platform ${PLATFORMS} \
    --target backend \
    --tag ${IMAGE_NAME}-backend:${VERSION} \
    --push \
    .

docker buildx build \
    --platform ${PLATFORMS} \
    --target frontend \
    --tag ${IMAGE_NAME}-frontend:${VERSION} \
    --push \
    .

docker buildx build \
    --platform ${PLATFORMS} \
    --target mobile-dev \
    --tag ${IMAGE_NAME}-mobile:${VERSION} \
    --push \
    .

docker buildx build \
    --platform ${PLATFORMS} \
    --target production \
    --tag ${IMAGE_NAME}:${VERSION} \
    --push \
    .

docker buildx build \
    --platform ${PLATFORMS} \
    --target development \
    --tag ${IMAGE_NAME}-dev:${VERSION} \
    --push \
    .

echo -e "${GREEN}✅ Multi-architecture build completed successfully!${NC}"
echo -e "${GREEN}📦 Images pushed to Docker Hub:${NC}"
echo -e "  - ${IMAGE_NAME}:${VERSION}"
echo -e "  - ${IMAGE_NAME}-backend:${VERSION}"
echo -e "  - ${IMAGE_NAME}-frontend:${VERSION}"
echo -e "  - ${IMAGE_NAME}-mobile:${VERSION}"
echo -e "  - ${IMAGE_NAME}-dev:${VERSION}"

# Show image information
echo -e "${YELLOW}📊 Image information:${NC}"
docker buildx imagetools inspect ${IMAGE_NAME}:${VERSION}

# Cleanup
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
docker buildx rm multiarch-builder || true

echo -e "${GREEN}🎉 Build process completed!${NC}"
