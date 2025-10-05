#!/bin/bash

# ExoPlanet AI Enhanced - Docker Setup Script
# One-time setup for the entire application

set -e

echo "🌌 ExoPlanet AI Enhanced - Docker Setup"
echo "======================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/data
mkdir -p backend/logs
mkdir -p backend/models
mkdir -p backend/cache

# Set permissions
chmod 755 backend/data
chmod 755 backend/logs
chmod 755 backend/models
chmod 755 backend/cache

echo "✅ Directories created"

# Copy environment file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating environment file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your actual API keys!"
else
    echo "✅ Environment file already exists"
fi

# Build and start the application
echo "🔨 Building Docker images..."
cd backend
docker-compose build --no-cache

echo "🚀 Starting ExoPlanet AI Enhanced..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check backend health
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy (http://localhost:8000)"
else
    echo "⚠️  Backend health check failed, but it might still be starting..."
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is accessible (http://localhost:3000)"
else
    echo "⚠️  Frontend check failed, but it might still be starting..."
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "📋 Useful Commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  Update and rebuild: docker-compose up --build -d"
echo ""
echo "⚠️  Don't forget to update your API keys in backend/.env!"
echo ""
echo "🌌 Ready to explore the cosmos!"