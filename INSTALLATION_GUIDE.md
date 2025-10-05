# 🚀 ExoPlanet AI - Installation & Running Guide

**Complete setup instructions for NASA Space Apps Challenge 2025 project**

---

## 📋 Quick Start Commands

### 🎯 One-Click Setup (Windows)
```bash
# Clone and start everything automatically
git clone https://github.com/yourusername/exoplanet-ai.git
cd exoplanet-ai
start-dev.bat
```

### 🎯 One-Click Setup (macOS/Linux)
```bash
# Clone the repository
git clone https://github.com/yourusername/exoplanet-ai.git
cd exoplanet-ai

# Make scripts executable
chmod +x backend/start.py

# Run setup
python backend/start.py
```

---

## 📦 Prerequisites Installation

### 1. Python 3.8+ Installation

#### Windows
```bash
# Download from python.org or use winget
winget install Python.Python.3.11

# Verify installation
python --version
pip --version
```

#### macOS
```bash
# Using Homebrew
brew install python@3.11

# Or download from python.org
# Verify installation
python3 --version
pip3 --version
```

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3.11-pip

# Verify installation
python3.11 --version
```

### 2. Git Installation

#### Windows
```bash
# Download from git-scm.com or use winget
winget install Git.Git
```

#### macOS
```bash
# Using Homebrew
brew install git

# Or use Xcode Command Line Tools
xcode-select --install
```

#### Ubuntu/Debian
```bash
sudo apt install git
```

---

## 🛠 Manual Installation Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/Bablushakya/nasa-2025-hackathon.git
cd exoplanet-ai
```

### Step 2: Backend Setup

#### Windows
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Initialize database
python scripts\init_db.py

# Start backend server
python run.py
```

#### macOS/Linux
```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Initialize database
python scripts/init_db.py

# Start backend server
python run.py
```

### Step 3: Frontend Setup

#### Option 1: Python HTTP Server
```bash
# In new terminal, navigate to project root
cd /path/to/exoplanet-ai

# Start frontend server
python -m http.server 3000
```

#### Option 2: Node.js (if available)
```bash
# Install serve globally
npm install -g serve

# Start frontend server
serve . -p 3000
```

#### Option 3: PHP (if available)
```bash
php -S localhost:3000
```

---

## 🔧 Dependency Installation Details

### Backend Dependencies (requirements.txt)
```txt
# Core Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0

# Database
sqlalchemy==2.0.23
alembic==1.12.1
aiosqlite==0.19.0

# Data Validation
pydantic==2.5.0
pydantic-settings==2.1.0

# Machine Learning
scikit-learn==1.3.2
tensorflow==2.15.0
numpy==1.24.3
pandas==2.1.4
joblib==1.3.2

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Development
pytest==7.4.3
black==23.11.0
```

### Installing Individual Packages
```bash
# Activate virtual environment first
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Install core packages
pip install fastapi uvicorn[standard]

# Install database packages
pip install sqlalchemy alembic aiosqlite

# Install ML packages
pip install scikit-learn tensorflow numpy pandas

# Install all at once
pip install -r requirements.txt
```

---

## 🚀 Running Commands

### Development Mode

#### Start Backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
python run.py
```

#### Start Frontend (Terminal 2)
```bash
cd exoplanet-ai
python -m http.server 3000
```

### Production Mode

#### Backend Production Server
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Production server with multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend Production Server
```bash
# Using a proper web server (nginx, apache)
# Or deploy to Netlify, Vercel, GitHub Pages
```

---

## 🌐 Access URLs

After successful installation and startup:

| Service | URL | Description |
|---------|-----|-------------|
| **Main Application** | http://localhost:3000 | Frontend web interface |
| **API Backend** | http://localhost:8000 | REST API server |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs (Swagger) |
| **Alternative API Docs** | http://localhost:8000/redoc | ReDoc documentation |
| **Health Check** | http://localhost:8000/health | System status endpoint |
| **Integration Tests** | http://localhost:3000/integration-test.html | Full system testing |

---

## 🧪 Testing Installation

### 1. Backend Health Check
```bash
# Test if backend is running
curl http://localhost:8000/health

# Expected response:
# {
#   "success": true,
#   "data": {
#     "status": "healthy",
#     "version": "2.1.0"
#   }
# }
```

### 2. API Prediction Test
```bash
# Test prediction endpoint
curl -X POST http://localhost:8000/api/v1/predictions/predict \
  -H "Content-Type: application/json" \
  -d '{
    "orbital_period": 365.25,
    "transit_duration": 4.2,
    "planetary_radius": 1.0,
    "transit_depth": 0.008,
    "stellar_magnitude": 4.83,
    "equilibrium_temperature": 288
  }'
```

### 3. Frontend Test
```bash
# Open browser and navigate to:
# http://localhost:3000

# Check if all pages load:
# - Dashboard: http://localhost:3000/dashboard.html
# - Explorer: http://localhost:3000/explorer.html
# - Learn: http://localhost:3000/learn.html
```

### 4. Integration Test
```bash
# Open comprehensive test page:
# http://localhost:3000/integration-test.html

# This will test:
# ✅ Backend connectivity
# ✅ API endpoints
# ✅ Prediction functionality
# ✅ Data loading
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Python Not Found
```bash
# Windows - Add Python to PATH
# Or use full path
C:\Users\YourName\AppData\Local\Programs\Python\Python311\python.exe

# macOS/Linux - Use python3
python3 -m venv venv
python3 run.py
```

#### 2. Virtual Environment Issues
```bash
# Delete and recreate virtual environment
rm -rf venv  # macOS/Linux
rmdir /s venv  # Windows

# Create new environment
python -m venv venv
```

#### 3. Permission Denied (macOS/Linux)
```bash
# Make scripts executable
chmod +x backend/start.py
chmod +x backend/scripts/init_db.py

# Or run with python
python backend/start.py
```

#### 4. Port Already in Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # macOS/Linux

# Kill process or use different port
uvicorn app.main:app --port 8001
python -m http.server 3001
```

#### 5. Module Not Found Errors
```bash
# Ensure virtual environment is activated
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### 6. Database Initialization Fails
```bash
# Delete existing database
rm backend/exoplanet_ai.db  # macOS/Linux
del backend\exoplanet_ai.db  # Windows

# Reinitialize
cd backend
python scripts/init_db.py
```

#### 7. CORS Errors in Browser
```bash
# Check backend CORS settings in backend/app/core/config.py
# Ensure frontend URL is in ALLOWED_ORIGINS

# Or start browser with disabled security (development only)
chrome --disable-web-security --user-data-dir=/tmp/chrome_dev
```

---

## 📱 Platform-Specific Instructions

### Windows 10/11

#### Using Command Prompt
```cmd
# Clone repository
git clone https://github.com/yourusername/exoplanet-ai.git
cd exoplanet-ai

# Run automated setup
start-dev.bat
```

#### Using PowerShell
```powershell
# Enable script execution (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Clone and setup
git clone https://github.com/yourusername/exoplanet-ai.git
cd exoplanet-ai
.\start-dev.bat
```

### macOS

#### Using Terminal
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.11

# Clone and setup
git clone https://github.com/yourusername/exoplanet-ai.git
cd exoplanet-ai
python3 backend/start.py
```

### Ubuntu/Debian Linux

#### Using Terminal
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3.11 python3.11-venv python3.11-pip git -y

# Clone and setup
git clone https://github.com/yourusername/exoplanet-ai.git
cd exoplanet-ai
python3.11 backend/start.py
```

### CentOS/RHEL/Fedora

#### Using Terminal
```bash
# Install dependencies
sudo dnf install python3.11 python3-pip git -y

# Clone and setup
git clone https://github.com/yourusername/exoplanet-ai.git
cd exoplanet-ai
python3 backend/start.py
```

---

## 🐳 Docker Installation (Optional)

### Using Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite+aiosqlite:///./exoplanet_ai.db
    volumes:
      - ./backend:/app

  frontend:
    image: nginx:alpine
    ports:
      - "3000:80"
    volumes:
      - .:/usr/share/nginx/html
```

### Docker Commands
```bash
# Build and start services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

---

## 📊 Performance Optimization

### Backend Optimization
```bash
# Install production ASGI server
pip install gunicorn

# Run with multiple workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Optimization
```bash
# Minify CSS and JS (if needed)
npm install -g clean-css-cli uglify-js

# Minify files
cleancss -o css/style.min.css css/style.css
uglifyjs js/main.js -o js/main.min.js
```

---

## 🔒 Security Considerations

### Development Environment
```bash
# Use environment variables for secrets
export SECRET_KEY="your-secret-key-here"
export DATABASE_URL="sqlite+aiosqlite:///./exoplanet_ai.db"

# Or create .env file in backend directory
echo "SECRET_KEY=your-secret-key-here" > backend/.env
echo "DATABASE_URL=sqlite+aiosqlite:///./exoplanet_ai.db" >> backend/.env
```

### Production Environment
```bash
# Use strong secret keys
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Enable HTTPS
# Configure reverse proxy (nginx/apache)
# Use environment variables for all secrets
```

---

## 📞 Support & Help

### Getting Help

1. **Check Integration Test Page**: http://localhost:3000/integration-test.html
2. **Review Console Logs**: Browser Developer Tools (F12)
3. **Check Backend Logs**: Terminal running `python run.py`
4. **Verify Prerequisites**: Python version, virtual environment
5. **Check Port Availability**: Ensure ports 3000 and 8000 are free

### Common Success Indicators

✅ **Backend Running**: `INFO: Uvicorn running on http://0.0.0.0:8000`
✅ **Frontend Running**: `Serving HTTP on :: port 3000`
✅ **Health Check**: Returns `{"success": true, "data": {"status": "healthy"}}`
✅ **Database**: No errors during `init_db.py` execution
✅ **API Docs**: Accessible at http://localhost:8000/docs

### Contact Information

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/exoplanet-ai/issues)
- **Email**: hello@exoplanet-ai.com
- **Documentation**: Full docs in `HACKATHON_DOCUMENTATION.md`

---

**🌌 Ready to explore exoplanets with AI! 🚀**

*NASA Space Apps Challenge 2025 - ExoPlanet AI Team*