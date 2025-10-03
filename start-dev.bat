@echo off
echo Starting ExoPlanet AI Development Environment
echo ============================================

echo.
echo 1. Starting Backend Server...
echo.

cd backend
start "ExoPlanet AI Backend" cmd /k "venv\Scripts\activate && python run.py"

echo Backend server starting in new window...
echo.

echo 2. Starting Frontend Server...
echo.

cd ..
start "ExoPlanet AI Frontend" cmd /k "python -m http.server 3000"

echo.
echo ============================================
echo Development servers are starting:
echo.
echo Backend API: http://localhost:8000
echo Frontend:    http://localhost:3000
echo Test Page:   http://localhost:3000/integration-test.html
echo.
echo Press any key to close this window...
pause > nul