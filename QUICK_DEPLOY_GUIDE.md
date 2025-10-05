# 🚀 Quick Deploy Guide - PowerShell Commands

## Step 1: Push to GitHub (Run in PowerShell)

### Option A: Use the Automated Script
```powershell
# Run the deployment script
.\deploy-to-render.ps1
```

### Option B: Manual Commands
```powershell
# Add all changes
git add .

# Commit changes
git commit -m "Fix Render deployment - use uvicorn for FastAPI"

# Push to GitHub
git push origin main
```

---

## Step 2: Configure Render Dashboard

### 🌐 Open Render Dashboard
1. Go to: https://dashboard.render.com
2. Sign in with your GitHub account
3. Click on your service: **exoplanet-ai-backend**

### ⚙️ Update Settings
Click **"Settings"** (left sidebar) and update:

**Build & Deploy Section:**
```
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1
```

**Environment Variables:**
```
PYTHON_VERSION = 3.11.0
ENVIRONMENT = production
DEBUG = false
```

### 🚀 Deploy
1. Click **"Save Changes"** (bottom of page)
2. Go back to main dashboard
3. Click **"Manual Deploy"** (top right)
4. Select **"Deploy latest commit"**
5. Wait 3-5 minutes

---

## Step 3: Verify Deployment

### Check Logs
In Render dashboard, click **"Logs"** tab

Look for:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000
```

### Test API
Open in browser or use curl:
```
https://exoplanet-ai-backend.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0"
  }
}
```

### Test API Docs
Visit: https://exoplanet-ai-backend.onrender.com/docs

---

## Step 4: Update Frontend

Update `js/config.js`:
```javascript
const CONFIG = {
    API_BASE_URL: 'https://exoplanet-ai-backend.onrender.com',
    API_TIMEOUT: 30000
};
```

---

## 🆘 Troubleshooting

### Error: "git push failed"
```powershell
# Check remote
git remote -v

# If no remote, add it
git remote add origin https://github.com/Bablushakya/nasa-2025-hackathon.git

# Try push again
git push origin main
```

### Error: "gunicorn: command not found" (still)
- Make sure Start Command uses `uvicorn` not `gunicorn`
- Check Root Directory is set to `backend`
- Redeploy after saving changes

### Error: "ModuleNotFoundError: No module named 'app'"
- Verify Root Directory is `backend`
- Check that `backend/app/main.py` exists
- Redeploy

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Root Directory set to `backend`
- [ ] Start Command uses `uvicorn app.main:app`
- [ ] Build successful (check logs)
- [ ] Deployment successful (check logs)
- [ ] Health endpoint returns 200 OK
- [ ] API docs accessible at /docs
- [ ] Frontend updated with new API URL

---

## 🎉 You're Done!

Your backend is now live at:
**https://exoplanet-ai-backend.onrender.com**

Test it and update your frontend to use this URL!
