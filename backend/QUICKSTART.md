# 🚀 ExoPlanet AI Backend - Quick Start Guide

## Step 1: Setup Virtual Environment

Open PowerShell/Command Prompt in the `backend` directory and run:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Step 2: Initialize Database

```bash
# Initialize database with sample data
python scripts\init_db.py
```

## Step 3: Start the Server

```bash
# Start development server
python run.py
```

The server will start on http://localhost:8000

## Step 4: Test the API

Open a new terminal and run:

```bash
# Simple test (no extra dependencies needed)
python simple_test.py

# Or visit in browser:
# http://localhost:8000/health
# http://localhost:8000/docs
```

## 🎯 Expected Output

When you run `python simple_test.py`, you should see:

```
🌌 Testing ExoPlanet AI API...
==================================================

🧪 Testing Health Check...
✅ Health Check passed: ExoPlanet AI API is running

🧪 Testing Prediction...
✅ Prediction passed: Confirmed (94.7% confidence)

🧪 Testing Model Info...
✅ Model Info passed: neural-network-v2.1

🎉 Basic API tests completed!
📖 Visit http://localhost:8000/docs for full API documentation
```

## 📖 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **API Status**: http://localhost:8000/api/v1/models/

## 🔧 Troubleshooting

### Issue: "ModuleNotFoundError"
**Solution**: Make sure you activated the virtual environment:
```bash
venv\Scripts\activate
```

### Issue: "Database error"
**Solution**: Run the database initialization:
```bash
python scripts\init_db.py
```

### Issue: "Port already in use"
**Solution**: Change the port in `run.py` or kill the process using port 8000

### Issue: "Permission denied"
**Solution**: Run PowerShell as Administrator or use Command Prompt

## 🌐 Frontend Integration

The backend is ready to work with the frontend. Update your frontend's API calls to point to:
```
http://localhost:8000/api/v1/
```

## 🎉 Success!

If all tests pass, your ExoPlanet AI backend is ready for NASA Space Apps Challenge 2025! 🌌