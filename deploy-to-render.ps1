# ExoPlanet AI - Render Deployment Script
# Run this in PowerShell to push changes and deploy

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ExoPlanet AI - Render Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "[1/5] Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git not found! Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check current git status
Write-Host "[2/5] Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "✓ Changes detected:" -ForegroundColor Green
    git status --short
} else {
    Write-Host "✓ No changes to commit" -ForegroundColor Green
}

Write-Host ""

# Add all changes
Write-Host "[3/5] Adding all changes to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ All files staged" -ForegroundColor Green

Write-Host ""

# Commit changes
Write-Host "[4/5] Committing changes..." -ForegroundColor Yellow
$commitMessage = "Fix Render deployment - use uvicorn for FastAPI"
git commit -m $commitMessage
Write-Host "✓ Changes committed" -ForegroundColor Green

Write-Host ""

# Push to GitHub
Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "✗ Push failed. Trying 'master' branch..." -ForegroundColor Yellow
    try {
        git push origin master
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Push failed. Please check your Git configuration." -ForegroundColor Red
        Write-Host "Run: git remote -v" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ Git Push Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Display next steps
Write-Host "📋 NEXT STEPS - Render Dashboard Configuration:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Click on your service (exoplanet-ai-backend)" -ForegroundColor White
Write-Host "3. Click 'Settings' in the left sidebar" -ForegroundColor White
Write-Host "4. Scroll to 'Build & Deploy' section" -ForegroundColor White
Write-Host ""
Write-Host "5. Update these settings:" -ForegroundColor Yellow
Write-Host "   Root Directory: backend" -ForegroundColor White
Write-Host "   Build Command: pip install -r requirements.txt" -ForegroundColor White
Write-Host "   Start Command: uvicorn app.main:app --host 0.0.0.0 --port `$PORT --workers 1" -ForegroundColor White
Write-Host ""
Write-Host "6. Click 'Save Changes'" -ForegroundColor White
Write-Host "7. Click 'Manual Deploy' → 'Deploy latest commit'" -ForegroundColor White
Write-Host "8. Wait 3-5 minutes for deployment" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Your backend will be live at:" -ForegroundColor Green
Write-Host "   https://exoplanet-ai-backend.onrender.com" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to open Render dashboard
Write-Host "Would you like to open Render dashboard now? (Y/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host
if ($response -eq "Y" -or $response -eq "y") {
    Start-Process "https://dashboard.render.com"
    Write-Host "✓ Opening Render dashboard in browser..." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
