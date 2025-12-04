# Docker Setup for Vitaxir Application

This document provides instructions for running the Vitaxir Next.js application using Docker.

## Prerequisites

- Docker installed on your system ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to project directory
cd my-next-app

# Copy environment variables (optional)
cp .env.example .env
```

### 2. Run with Docker Compose (Recommended)

#### Production Mode
```bash
# Build and start the production container
npm run docker:prod

# Or use docker-compose directly
docker-compose up app
```

#### Development Mode (with hot reload)
```bash
# Build and start the development container
npm run docker:dev

# Or use docker-compose directly
docker-compose --profile development up app-dev
```

### 3. Run with Docker CLI

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

## Available NPM Scripts

- `npm run docker:build` - Build the production Docker image
- `npm run docker:run` - Run the production container
- `npm run docker:prod` - Start production container with docker-compose
- `npm run docker:dev` - Start development container with docker-compose
- `npm run docker:down` - Stop and remove containers
- `npm run docker:logs` - View container logs

## Docker Files

### `Dockerfile`
Multi-stage production build with optimized image size:
- **Stage 1 (deps)**: Install dependencies only
- **Stage 2 (builder)**: Build the Next.js application
- **Stage 3 (runner)**: Run the application with minimal footprint

### `Dockerfile.dev`
Development build with hot reload support for local development.

### `docker-compose.yml`
Orchestrates the application services:
- `app`: Production service (default)
- `app-dev`: Development service (requires `--profile development`)

## Port Configuration

- **Production**: `http://localhost:3000`
- **Development**: `http://localhost:3001`

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NODE_ENV=production
```

## Building for Production

```bash
# Build the image
docker build -t vitaxir-app .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url \
  vitaxir-app
```

## Docker Compose Commands

```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild images
docker-compose build --no-cache

# Remove volumes
docker-compose down -v
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs app

# Restart containers
docker-compose restart
```

### Port already in use
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Change 3001 to available port
```

### Image size too large
The multi-stage build should produce a slim image (~150-200MB). If larger:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

### Hot reload not working in development
Ensure volumes are properly mounted in `docker-compose.yml`:
```yaml
volumes:
  - .:/app
  - /app/node_modules
  - /app/.next
```

## Production Deployment

### Using Docker Hub

```bash
# Tag image
docker tag vitaxir-app username/vitaxir-app:latest

# Push to Docker Hub
docker push username/vitaxir-app:latest

# Pull and run on server
docker pull username/vitaxir-app:latest
docker run -d -p 3000:3000 username/vitaxir-app:latest
```

### Using Docker Compose on Server

```bash
# On your server
docker-compose -f docker-compose.yml up -d app
```

## Security Best Practices

1. ✅ Non-root user (nextjs:nodejs)
2. ✅ Multi-stage build (minimal attack surface)
3. ✅ Alpine Linux base (smaller, more secure)
4. ✅ .dockerignore (excludes sensitive files)
5. ✅ Environment variables (no hardcoded secrets)

## Performance Optimization

- **Standalone Output**: Enabled in `next.config.mjs` for optimal bundle size
- **Layer Caching**: Dependencies installed separately for faster rebuilds
- **Alpine Linux**: Minimal base image (~5MB vs ~100MB for standard Node)
- **Production Build**: Tree-shaking and minification enabled

## Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
