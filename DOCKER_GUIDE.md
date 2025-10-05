# 🐳 ExoPlanet AI Enhanced - Docker Deployment Guide

## 🚀 **One-Time Setup (Recommended)**

### **Prerequisites**
- Docker Desktop installed ([Download here](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)
- 4GB+ RAM available
- 2GB+ disk space

### **Quick Start**

#### **Windows Users**
```bash
# Run the automated setup script
docker-setup.bat
```

#### **Linux/macOS Users**
```bash
# Make script executable and run
chmod +x docker-setup.sh
./docker-setup.sh
```

#### **Manual Setup**
```bash
# 1. Create directories
mkdir -p backend/{data,logs,models,cache}

# 2. Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# 3. Build and start
cd backend
docker-compose up --build -d
```

## 🌐 **Access Your Application**

After setup completes:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🔧 **Docker Architecture**

### **Services Overview**

#### **Backend Service**
- **Container**: `exoplanet-ai-backend`
- **Port**: 8000
- **Technology**: FastAPI + Python 3.11
- **Database**: SQLite (production-ready)
- **Features**: NASA API + Gemini AI integration

#### **Frontend Service**
- **Container**: `exoplanet-ai-frontend`
- **Port**: 3000 (mapped to 80 inside container)
- **Technology**: Nginx + Static Files
- **Features**: Space-themed UI with audio capabilities

#### **Network**
- **Custom Bridge Network**: `exoplanet-network`
- **Internal Communication**: Services communicate via container names
- **External Access**: Only ports 3000 and 8000 exposed

### **Volume Mounts**
```yaml
backend/logs     → /app/logs      # Application logs
backend/models   → /app/models    # ML models and metadata
backend/data     → /app/data      # SQLite database
backend_cache    → /app/cache     # Application cache
```

## 📋 **Docker Commands Reference**

### **Basic Operations**
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **Development Commands**
```bash
# Rebuild and start (after code changes)
docker-compose up --build -d

# Force rebuild (no cache)
docker-compose build --no-cache

# Scale services (if needed)
docker-compose up -d --scale backend=2

# Execute commands in running container
docker-compose exec backend bash
docker-compose exec frontend sh
```

### **Maintenance Commands**
```bash
# Check service status
docker-compose ps

# View resource usage
docker stats

# Clean up unused images/containers
docker system prune -f

# Remove all project containers and volumes
docker-compose down -v --remove-orphans
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using the port
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Kill process using port (Linux/macOS)
sudo kill -9 $(lsof -t -i:3000)

# Change ports in docker-compose.yml if needed
ports:
  - "3001:80"  # Frontend on port 3001
  - "8001:8000"  # Backend on port 8001
```

#### **API Keys Not Working**
```bash
# Check environment variables
docker-compose exec backend env | grep API

# Update .env file and restart
docker-compose restart backend
```

#### **Database Issues**
```bash
# Reset database
docker-compose down
rm -rf backend/data/exoplanet_ai.db
docker-compose up -d

# Check database logs
docker-compose logs backend | grep -i database
```

#### **Frontend Not Loading**
```bash
# Check Nginx configuration
docker-compose exec frontend nginx -t

# Restart frontend service
docker-compose restart frontend

# Check if files are mounted correctly
docker-compose exec frontend ls -la /usr/share/nginx/html
```

### **Health Checks**

#### **Backend Health**
```bash
# Direct health check
curl http://localhost:8000/health

# Inside container
docker-compose exec backend curl http://localhost:8000/health
```

#### **Frontend Health**
```bash
# Check if frontend is serving files
curl -I http://localhost:3000

# Check Nginx status
docker-compose exec frontend nginx -s reload
```

## 🔒 **Security Considerations**

### **Production Deployment**
```bash
# 1. Update environment variables
# - Change SECRET_KEY
# - Use strong passwords
# - Set DEBUG=False

# 2. Use HTTPS (add SSL certificates)
# 3. Configure firewall rules
# 4. Regular security updates
```

### **API Key Security**
- Store API keys in `.env` file (never commit to git)
- Use Docker secrets for production
- Rotate keys regularly
- Monitor API usage

## 📊 **Monitoring & Logs**

### **Log Locations**
```bash
# Application logs
backend/logs/exoplanet_ai.log
backend/logs/errors.log

# Docker logs
docker-compose logs backend
docker-compose logs frontend
```

### **Monitoring Commands**
```bash
# Real-time resource monitoring
docker stats

# Service health status
docker-compose ps

# Disk usage
docker system df
```

## 🚀 **Production Deployment**

### **Environment Setup**
```bash
# 1. Clone repository
git clone <repository-url>
cd exoplanet-ai

# 2. Configure production environment
cp backend/.env.example backend/.env
# Update with production values

# 3. Deploy with production settings
cd backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Production Optimizations**
- Use PostgreSQL instead of SQLite for better performance
- Enable Redis for caching
- Configure load balancing with multiple backend instances
- Set up SSL/TLS certificates
- Configure monitoring and alerting

## 🔄 **Updates & Maintenance**

### **Updating the Application**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Rebuild and restart
docker-compose up --build -d

# 3. Check health
curl http://localhost:8000/health
```

### **Backup & Restore**
```bash
# Backup database and models
tar -czf backup-$(date +%Y%m%d).tar.gz backend/data backend/models

# Restore from backup
tar -xzf backup-20241005.tar.gz
docker-compose restart backend
```

## 📈 **Performance Tuning**

### **Resource Allocation**
```yaml
# In docker-compose.yml, add resource limits
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
```

### **Optimization Tips**
- Use multi-stage Docker builds (already implemented)
- Enable gzip compression in Nginx (already configured)
- Implement Redis caching for API responses
- Use CDN for static assets in production

## 🎯 **Development Workflow**

### **Local Development with Docker**
```bash
# 1. Start development environment
docker-compose up -d

# 2. Make code changes
# Files are mounted as volumes, changes reflect immediately

# 3. View logs for debugging
docker-compose logs -f backend

# 4. Restart specific service if needed
docker-compose restart backend
```

### **Testing**
```bash
# Run tests inside container
docker-compose exec backend python -m pytest

# Run specific test file
docker-compose exec backend python -m pytest tests/test_api.py
```

---

## 🎉 **Success!**

Your ExoPlanet AI Enhanced application is now running in Docker containers with:

✅ **Professional deployment** with Docker best practices  
✅ **Scalable architecture** ready for production  
✅ **Easy maintenance** with simple commands  
✅ **Comprehensive monitoring** and logging  
✅ **Security considerations** built-in  

**🌌 Ready to explore the cosmos with containerized excellence!**