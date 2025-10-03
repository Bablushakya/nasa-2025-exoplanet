@echo off
echo 🌌 ExoPlanet AI Backend Setup
echo ================================

echo.
echo 📦 Creating virtual environment...
python -m venv venv

echo.
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo 📚 Installing dependencies...
pip install -r requirements.txt

echo.
echo 🗄️ Initializing database...
python scripts\init_db.py

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the server, run:
echo    venv\Scripts\activate.bat
echo    python run.py
echo.
echo 📖 Then visit: http://localhost:8000/docs
pause