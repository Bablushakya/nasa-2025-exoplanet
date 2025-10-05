@echo off
echo 🔧 ExoPlanet AI - Quick Fix Script
echo ===================================

echo.
echo 🐍 Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo.
echo 📦 Creating virtual environment...
if exist venv (
    echo Virtual environment already exists, removing old one...
    rmdir /s /q venv
)
python -m venv venv

echo.
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo 📚 Upgrading pip...
python -m pip install --upgrade pip

echo.
echo 📦 Installing core dependencies first...
pip install fastapi uvicorn[standard] sqlalchemy aiosqlite pydantic

echo.
echo 📦 Installing remaining dependencies...
pip install -r requirements.txt

echo.
echo 🗄️ Creating simple database initialization...
python -c "
import sqlite3
import os

# Create database file
db_path = 'exoplanet_ai.db'
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create simple tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS exoplanets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    host_star TEXT,
    discovery_method TEXT,
    discovery_year INTEGER,
    orbital_period REAL,
    transit_duration REAL,
    planetary_radius REAL,
    transit_depth REAL,
    stellar_magnitude REAL,
    equilibrium_temperature REAL,
    disposition TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS predictions (
    id TEXT PRIMARY KEY,
    input_data TEXT,
    classification TEXT,
    confidence REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Insert sample data
cursor.execute('''
INSERT INTO exoplanets (name, host_star, discovery_method, discovery_year, orbital_period, planetary_radius, disposition)
VALUES 
    ('Kepler-452b', 'Kepler-452', 'Transit', 2015, 384.84, 1.63, 'Confirmed'),
    ('TRAPPIST-1e', 'TRAPPIST-1', 'Transit', 2017, 6.1, 0.92, 'Confirmed'),
    ('Proxima Centauri b', 'Proxima Centauri', 'Radial Velocity', 2016, 11.2, 1.17, 'Confirmed')
''')

conn.commit()
conn.close()
print('✅ Database created successfully!')
"

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting the server...
echo Backend will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
python run.py