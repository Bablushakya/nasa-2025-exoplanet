# 🔧 ExoPlanet AI - Quick Fix Guide

**Immediate solutions for common setup issues**

---

## 🚨 Your Current Issue: Missing aiosqlite

The error you're seeing indicates that you're missing the `aiosqlite` package and not using a virtual environment properly.

### ⚡ Immediate Fix (Choose One)

#### Option 1: Use the Quick Fix Script (Recommended)
```bash
cd backend
quick_fix.bat
```

#### Option 2: Manual Fix
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install core packages
pip install fastapi uvicorn sqlalchemy aiosqlite pydantic

# Install all dependencies
pip install -r requirements.txt

# Initialize database with simple script
python simple_init.py

# Start server with simple app
python simple_run.py
```

#### Option 3: Super Simple Setup
```bash
cd backend

# Install just the essentials
pip install fastapi uvicorn sqlalchemy aiosqlite pydantic

# Create database
python simple_init.py

# Start simple server
python simple_app.py
```

---

## 🔍 Troubleshooting Steps

### Step 1: Check Python Installation
```bash
python --version
# Should show Python 3.8 or higher

pip --version
# Should show pip version
```

**If Python is not found:**
- Windows: Download from [python.org](https://python.org/downloads/)
- Or use: `winget install Python.Python.3.11`

### Step 2: Check Virtual Environment
```bash
# In backend directory
python -m venv venv
venv\Scripts\activate

# You should see (venv) in your prompt
```

### Step 3: Install Dependencies
```bash
# With virtual environment activated
pip install --upgrade pip
pip install fastapi uvicorn[standard] sqlalchemy aiosqlite pydantic
```

### Step 4: Test Installation
```bash
python -c "import fastapi, uvicorn, sqlalchemy, aiosqlite; print('✅ All packages installed')"
```

### Step 5: Initialize Database
```bash
python simple_init.py
```

### Step 6: Start Server
```bash
python simple_app.py
```

---

## 🎯 Quick Test Commands

### Test Backend Health
```bash
# In new terminal/command prompt
curl http://localhost:8000/health

# Or open in browser:
# http://localhost:8000/health
```

### Test API Documentation
```bash
# Open in browser:
# http://localhost:8000/docs
```

### Test Prediction
```bash
curl -X POST http://localhost:8000/api/v1/predictions/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"orbital_period\": 365.25, \"transit_duration\": 4.2, \"planetary_radius\": 1.0, \"transit_depth\": 0.008, \"stellar_magnitude\": 4.83, \"equilibrium_temperature\": 288}"
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "python is not recognized"
**Solution:**
```bash
# Use full path
C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\python.exe

# Or add Python to PATH in System Environment Variables
```

### Issue 2: "pip is not recognized"
**Solution:**
```bash
python -m pip install package_name
```

### Issue 3: "Permission denied"
**Solution:**
```bash
# Run Command Prompt as Administrator
# Or use --user flag
pip install --user package_name
```

### Issue 4: "Port 8000 already in use"
**Solution:**
```bash
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID 1234 /F

# Or use different port
python simple_app.py --port 8001
```

### Issue 5: "Module not found" errors
**Solution:**
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Reinstall packages
pip install -r requirements.txt
```

### Issue 6: Database errors
**Solution:**
```bash
# Delete and recreate database
del exoplanet_ai.db
python simple_init.py
```

---

## 📁 File Structure Check

Make sure you have these files in the backend directory:
```
backend/
├── simple_app.py          ✅ (New simple FastAPI app)
├── simple_init.py         ✅ (New simple database init)
├── simple_run.py          ✅ (New simple server runner)
├── quick_fix.bat          ✅ (New automated fix script)
├── requirements.txt       ✅ (Original dependencies)
├── run.py                 ✅ (Original runner)
└── venv/                  ✅ (Virtual environment folder)
```

---

## 🚀 Success Indicators

You'll know everything is working when you see:

### ✅ Virtual Environment Active
```
(venv) C:\path\to\backend>
```

### ✅ Database Created
```
🎉 Database initialization complete!
📊 Database file: C:\path\to\backend\exoplanet_ai.db
📈 Total exoplanets: 10
🔮 Total predictions: 3
```

### ✅ Server Running
```
🌌 Starting ExoPlanet AI Server...
🌐 Server: http://localhost:8000
📖 API Docs: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### ✅ Health Check Working
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "2.1.0",
    "database": "connected"
  }
}
```

---

## 🆘 Still Having Issues?

### Try the Nuclear Option (Complete Reset)
```bash
# Delete everything and start fresh
cd backend
rmdir /s /q venv
del exoplanet_ai.db

# Start over with simple setup
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy aiosqlite pydantic
python simple_init.py
python simple_app.py
```

### Check System Requirements
- **Windows 10/11** ✅
- **Python 3.8+** ✅
- **4GB RAM** ✅
- **2GB free space** ✅
- **Internet connection** ✅

### Alternative: Use Python from Microsoft Store
```bash
# If regular Python doesn't work, try:
# 1. Open Microsoft Store
# 2. Search for "Python 3.11"
# 3. Install Python 3.11
# 4. Use "python3" instead of "python"
```

---

## 📞 Next Steps After Fix

Once the backend is running:

1. **Test the API**: Visit http://localhost:8000/docs
2. **Start Frontend**: In new terminal, run `python -m http.server 3000` from project root
3. **Test Integration**: Visit http://localhost:3000/integration-test.html
4. **Use the App**: Visit http://localhost:3000

---

## 🎯 Expected Results

After following this guide, you should have:
- ✅ Backend running on http://localhost:8000
- ✅ API documentation at http://localhost:8000/docs
- ✅ Database with sample data
- ✅ Working prediction endpoint
- ✅ All API endpoints functional

**🌌 Ready to explore exoplanets! 🚀**