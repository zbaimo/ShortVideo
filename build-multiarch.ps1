# Multi-architecture Docker build script for Short Video Platform (PowerShell)
# Supports AMD64 and ARM64 architectures

param(
    [string]$Version = "latest"
)

# Configuration
$ImageName = "zbaimo/shortvideo"
$Platforms = "linux/amd64,linux/arm64"

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Reset = "`e[0m"

Write-Host "🚀 Starting multi-architecture Docker build for Short Video Platform" -ForegroundColor Green
Write-Host "Image: ${ImageName}:${Version}" -ForegroundColor Yellow
Write-Host "Platforms: ${Platforms}" -ForegroundColor Yellow

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Check if buildx is available
try {
    docker buildx version | Out-Null
} catch {
    Write-Host "❌ Docker buildx is not available. Please enable buildx and try again." -ForegroundColor Red
    exit 1
}

# Create and use new builder instance for multi-architecture builds
Write-Host "🔧 Setting up multi-architecture builder..." -ForegroundColor Yellow
docker buildx create --name multiarch-builder --use --driver docker-container 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Builder already exists, using existing one..." -ForegroundColor Yellow
}
docker buildx inspect --bootstrap

# Build and push multi-architecture images
Write-Host "🏗️  Building and pushing multi-architecture images..." -ForegroundColor Yellow

# Build all targets for multiple architectures
Write-Host "Building backend image..." -ForegroundColor Yellow
docker buildx build `
    --platform ${Platforms} `
    --target backend `
    --tag ${ImageName}-backend:${Version} `
    --push `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Building frontend image..." -ForegroundColor Yellow
docker buildx build `
    --platform ${Platforms} `
    --target frontend `
    --tag ${ImageName}-frontend:${Version} `
    --push `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Building mobile image..." -ForegroundColor Yellow
docker buildx build `
    --platform ${Platforms} `
    --target mobile-dev `
    --tag ${ImageName}-mobile:${Version} `
    --push `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Mobile build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Building production image..." -ForegroundColor Yellow
docker buildx build `
    --platform ${Platforms} `
    --target production `
    --tag ${ImageName}:${Version} `
    --push `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Production build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Building development image..." -ForegroundColor Yellow
docker buildx build `
    --platform ${Platforms} `
    --target development `
    --tag ${ImageName}-dev:${Version} `
    --push `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Development build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Multi-architecture build completed successfully!" -ForegroundColor Green
Write-Host "📦 Images pushed to Docker Hub:" -ForegroundColor Green
Write-Host "  - ${ImageName}:${Version}" -ForegroundColor White
Write-Host "  - ${ImageName}-backend:${Version}" -ForegroundColor White
Write-Host "  - ${ImageName}-frontend:${Version}" -ForegroundColor White
Write-Host "  - ${ImageName}-mobile:${Version}" -ForegroundColor White
Write-Host "  - ${ImageName}-dev:${Version}" -ForegroundColor White

# Show image information
Write-Host "📊 Image information:" -ForegroundColor Yellow
docker buildx imagetools inspect ${ImageName}:${Version}

# Cleanup
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
docker buildx rm multiarch-builder 2>$null

Write-Host "🎉 Build process completed!" -ForegroundColor Green
