@echo off
REM ExoPlanet AI Enhanced - Docker Setup Script for Windows
REM One-time setup for the entire application

echo 🌌 ExoPlanet AI Enhanced - Docker Setup
echo =======================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    echo Visit: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "backend\data" mkdir backend\data
if not exist "backend\logs" mkdir backend\logs
if not exist "backend\models" mkdir backend\models
if not exist "backend\cache" mkdir backend\cache

echo ✅ Directories created

REM Copy environment file if it doesn't exist
if not exist "backend\.env" (
    echo 📝 Creating environment file...
    copy "backend\.env.example" "backend\.env"
    echo ⚠️  Please update backend\.env with your actual API keys!
) else (
    echo ✅ Environment file already exists
)

REM Build and start the application
echo 🔨 Building Docker images...
cd backend
docker-compose build --no-cache

echo 🚀 Starting ExoPlanet AI Enhanced...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 15 /nobreak >nul

REM Check service health
echo 🔍 Checking service health...

REM Check backend health
curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is healthy (http://localhost:8000)
) else (
    echo ⚠️  Backend health check failed, but it might still be starting...
)

REM Check frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is accessible (http://localhost:3000)
) else (
    echo ⚠️  Frontend check failed, but it might still be starting...
)

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo 📋 Useful Commands:
echo   View logs: docker-compose logs -f
echo   Stop services: docker-compose down
echo   Restart services: docker-compose restart
echo   Update and rebuild: docker-compose up --build -d
echo.
echo ⚠️  Don't forget to update your API keys in backend\.env!
echo.
echo 🌌 Ready to explore the cosmos!
echo.
pause