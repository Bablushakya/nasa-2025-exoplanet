# 🚀 Free Backend Deployment Guide

## Quick Comparison

| Platform | Free Tier | Ease | Best For |
|----------|-----------|------|----------|
| **Render** | 750hrs/month | ⭐⭐⭐⭐⭐ | Beginners |
| **Railway** | $5 credit/month | ⭐⭐⭐⭐ | Quick deploys |
| **Fly.io** | 3 VMs free | ⭐⭐⭐ | Performance |
| **PythonAnywhere** | Always free | ⭐⭐⭐⭐⭐ | Simple apps |

---

## 🎯 Recommended: Render Deployment

### Prerequisites
- GitHub account
- Your code pushed to GitHub
- `requirements.txt` in backend folder ✅

### Step 1: Prepare Your Repository
```bash
# Make sure everything is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Sign Up for Render
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render to access your repositories

### Step 3: Create Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub repository
4. Click "Connect" next to your repo

### Step 4: Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `exoplanet-ai-backend` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Instance Type:**
- Select "Free" plan

### Step 5: Environment Variables
Click "Advanced" and add these:

```
ENVIRONMENT=production
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://your-frontend-domain.com
```

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for first deployment
3. Your API will be live at: `https://exoplanet-ai-backend.onrender.com`

### Step 7: Update Frontend
Update your frontend `js/config.js`:

```javascript
const API_BASE_URL = 'https://exoplanet-ai-backend.onrender.com';
```

---

## 🚂 Alternative: Railway Deployment

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign in with GitHub

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects Python

### Step 3: Configure
1. Go to Settings
2. Set **Root Directory**: `backend`
3. Add **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 4: Environment Variables
Add in Variables tab:
```
ENVIRONMENT=production
SECRET_KEY=your-secret-key
```

### Step 5: Get URL
1. Go to Settings → Networking
2. Click "Generate Domain"
3. Copy your URL: `https://your-app.up.railway.app`

---

## ✈️ Alternative: Fly.io Deployment

### Step 1: Install Fly CLI
**Windows (PowerShell):**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Restart your terminal after installation**

### Step 2: Sign Up & Login
```bash
fly auth signup
fly auth login
```

### Step 3: Initialize App
```bash
cd backend
fly launch
```

Answer the prompts:
- App name: `exoplanet-ai-backend`
- Region: Choose closest
- PostgreSQL: No (unless you need it)
- Deploy now: Yes

### Step 4: Configure
Fly creates `fly.toml`. Update it:

```toml
app = "exoplanet-ai-backend"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

### Step 5: Deploy
```bash
fly deploy
```

### Step 6: Set Secrets
```bash
fly secrets set SECRET_KEY=your-secret-key
fly secrets set ENVIRONMENT=production
```

Your API: `https://exoplanet-ai-backend.fly.dev`

---

## 🐍 Alternative: PythonAnywhere

### Step 1: Sign Up
1. Go to https://www.pythonanywhere.com
2. Create free "Beginner" account

### Step 2: Upload Code
**Option A - Git Clone:**
```bash
# In PythonAnywhere Bash console
git clone https://github.com/yourusername/your-repo.git
cd your-repo/backend
```

**Option B - Upload Files:**
- Use "Files" tab to upload backend folder

### Step 3: Create Virtual Environment
```bash
mkvirtualenv --python=/usr/bin/python3.10 exoplanet-env
pip install -r requirements.txt
```

### Step 4: Configure Web App
1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Select Python 3.10

### Step 5: Configure WSGI
Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`:

```python
import sys
import os

# Add your project directory
project_home = '/home/yourusername/your-repo/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['ENVIRONMENT'] = 'production'

# Import FastAPI app
from app.main import app as application
```

### Step 6: Reload
Click "Reload" button in Web tab

Your API: `https://yourusername.pythonanywhere.com`

---

## 🔧 Post-Deployment Checklist

### 1. Test Your API
```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Test API endpoint
curl https://your-backend-url.com/api/v1/predictions
```

### 2. Update Frontend
Update `js/config.js`:
```javascript
const CONFIG = {
    API_BASE_URL: 'https://your-backend-url.com',
    API_TIMEOUT: 30000
};
```

### 3. Enable CORS
Make sure your backend allows your frontend domain:
```python
# In app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.com",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. Monitor Logs
- **Render**: Dashboard → Logs tab
- **Railway**: Project → Deployments → View Logs
- **Fly.io**: `fly logs`
- **PythonAnywhere**: Web tab → Log files

---

## 🎯 Recommended Setup for Your Project

**For Hackathon/Demo:**
1. **Backend**: Render (free, reliable, easy)
2. **Frontend**: Netlify or Vercel (free, auto-deploy)
3. **Database**: Render PostgreSQL (free tier)

**Quick Deploy Commands:**
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy backend on Render (via dashboard)
# 3. Deploy frontend on Netlify
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🆘 Troubleshooting

### Issue: "Application failed to start"
**Solution**: Check logs for missing dependencies
```bash
# Add missing packages to requirements.txt
pip freeze > requirements.txt
```

### Issue: "Port already in use"
**Solution**: Use environment PORT variable
```python
# In app/main.py
import os
port = int(os.getenv("PORT", 8000))
```

### Issue: "CORS errors"
**Solution**: Update CORS origins
```python
allow_origins=["*"]  # For testing only
```

### Issue: "Cold starts (slow first request)"
**Solution**: 
- Render free tier sleeps after 15 min inactivity
- Use a cron job to ping every 14 minutes
- Or upgrade to paid tier ($7/month)

---

## 💡 Pro Tips

1. **Keep it lightweight**: Remove unused dependencies
2. **Use environment variables**: Never hardcode secrets
3. **Monitor usage**: Check free tier limits
4. **Set up CI/CD**: Auto-deploy on git push
5. **Add health checks**: `/health` endpoint for monitoring

---

## 📊 Cost Comparison (if you outgrow free tier)

| Platform | Paid Tier | Features |
|----------|-----------|----------|
| Render | $7/month | 512MB RAM, always on |
| Railway | $5 credit | Pay per usage |
| Fly.io | $1.94/month | 256MB RAM VM |
| Heroku | $7/month | 512MB RAM |

---

## 🎉 You're Ready!

Choose your platform and follow the steps. Render is the easiest for beginners.

Need help? Check the logs and error messages - they're usually very helpful!
