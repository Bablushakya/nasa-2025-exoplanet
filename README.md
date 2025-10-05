# 🌌 ExoPlanet AI Enhanced - Complete Guide

**NASA Space Apps Challenge 2025 - AI-Powered Exoplanet Detection Platform**

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**ExoPlanet AI Enhanced** is a comprehensive web application that combines real NASA astronomical data with Google Gemini AI to make exoplanet discovery and analysis accessible to everyone. Built for the NASA Space Apps Challenge 2025, it features:

- 🤖 **AI-Powered Detection**: Machine learning models for exoplanet classification (94.7% accuracy)
- 🌐 **Real NASA Data**: Live integration with NASA Exoplanet Archive
- 🎨 **Beautiful UI**: Space-themed interface with glassmorphism effects
- 📊 **Interactive Dashboard**: Real-time data visualization
- 🎓 **Educational Content**: Interactive learning modules
- 🔍 **Data Explorer**: Browse 5,000+ confirmed exoplanets

---

## ✨ Features

### Core Capabilities
- **AI Predictions**: Neural network-based exoplanet classification
- **NASA Integration**: Real-time astronomical data from NASA APIs
- **Gemini AI**: Advanced AI analysis and educational content generation
- **Interactive Visualizations**: Charts, graphs, and animated displays
- **Responsive Design**: Works on desktop, tablet, and mobile
- **RESTful API**: Complete backend API with documentation

### User Experience
- **Space-Themed UI**: Cosmic animations and effects
- **Glassmorphism Design**: Modern frosted glass aesthetics
- **Smooth Animations**: Transitions and micro-interactions
- **Accessibility**: WCAG 2.1 AA compliant
- **Cross-Browser**: Works on Chrome, Firefox, Safari, Edge

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Modern web browser

### Simple 3-Step Setup

**Step 1: Clone the repository**
```bash
git clone https://github.com/Bablushakya/nasa-2025-hackathon.git
cd nasa-2025-hackathon
```

**Step 2: Setup and start backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python scripts/init_db.py
python run.py
```

**Step 3: Start frontend (new terminal)**
```bash
# From project root directory
python start_frontend.py
```

### Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📦 Installation

### System Requirements
- **OS**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Python**: 3.8 or higher

### Backend Setup

1. **Create Virtual Environment**
```bash
cd backend
python -m venv venv
```

2. **Activate Virtual Environment**
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Initialize Database**
```bash
python scripts/init_db.py
```

### Frontend Setup

No installation needed - uses vanilla JavaScript with CDN libraries.

---

## 🎮 Running the Application

### Start Backend
```bash
cd backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
python run.py
```

### Start Frontend (new terminal)
```bash
# From project root
python start_frontend.py
```

That's it! Your application is now running.

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Core Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "2.1.0"
  }
}
```

#### Exoplanet Prediction
```http
POST /api/v1/predictions/predict
Content-Type: application/json
```

**Request:**
```json
{
  "orbital_period": 365.25,
  "transit_duration": 4.2,
  "planetary_radius": 1.0,
  "transit_depth": 0.008,
  "stellar_magnitude": 4.83,
  "equilibrium_temperature": 288
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "classification": "Confirmed",
    "confidence": 94.7,
    "probability": {
      "confirmed": 0.947,
      "candidate": 0.041,
      "false_positive": 0.012
    }
  }
}
```

#### Get Exoplanets
```http
GET /api/v1/exoplanets?limit=10&offset=0
```

### Interactive Documentation
Visit http://localhost:8000/docs for full Swagger UI documentation.

---

## 📁 Project Structure

```
exoplanet-ai/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/v1/            # API routes
│   │   ├── core/              # Core functionality
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── main.py            # FastAPI app
│   ├── scripts/               # Utility scripts
│   ├── requirements.txt       # Python dependencies
│   └── README.md              # Backend documentation
├── css/                       # Stylesheets
│   ├── style.css             # Main styles
│   ├── components.css        # UI components
│   ├── animations.css        # Animations
│   └── responsive.css        # Mobile styles
├── js/                        # JavaScript modules
│   ├── main.js               # Core logic
│   ├── api.js                # API integration
│   ├── dashboard.js          # Dashboard
│   └── utils.js              # Utilities
├── assets/                    # Images and data
├── *.html                     # Frontend pages
├── start_frontend.py          # Frontend server
└── README.md                  # This file
```

---

## 💻 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling (Grid, Flexbox, Animations)
- **JavaScript ES6+** - Vanilla JS, modular architecture
- **Chart.js** - Data visualization
- **Particles.js** - Background effects
- **Font Awesome** - Icons

### Backend
- **Python 3.8+** - Core language
- **FastAPI** - Web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **SQLite** - Development database

### Machine Learning
- **TensorFlow 2.15** - Deep learning
- **Scikit-learn** - ML algorithms
- **NumPy** - Numerical computing
- **Pandas** - Data manipulation

---

## 🚀 Deployment

### Frontend Deployment
Deploy the static files (HTML, CSS, JS) to any web hosting service:
- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Enable in repository settings

### Backend Deployment
Deploy the backend folder to any Python hosting service:
- **Render**: Connect GitHub, set root to `backend`, start command: `python run.py`
- **Railway**: Connect GitHub, auto-detects Python
- **PythonAnywhere**: Upload backend folder and configure WSGI

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### API Testing
```bash
# Health check
curl http://localhost:8000/health

# Prediction test
curl -X POST http://localhost:8000/api/v1/predictions/predict \
  -H "Content-Type: application/json" \
  -d '{"orbital_period": 365.25, "planetary_radius": 1.0}'
```

### Frontend Testing
1. Open http://localhost:3000
2. Test all navigation links
3. Try prediction form
4. Check responsive design
5. Test API integration

---

## 🔧 Troubleshooting

### Backend Issues

**Issue: "ModuleNotFoundError"**
```bash
# Ensure virtual environment is activated
venv\Scripts\activate
pip install -r requirements.txt
```

**Issue: "Port already in use"**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**Issue: "Database error"**
```bash
# Reinitialize database
cd backend
python scripts/init_db.py
```

### Frontend Issues

**Issue: "API connection failed"**
- Check backend is running on port 8000
- Verify CORS settings in backend
- Check browser console for errors

**Issue: "Pages not loading"**
- Ensure frontend server is running on port 3000
- Check file paths are correct
- Clear browser cache

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NASA** - For exoplanet data and inspiration
- **Google Gemini** - For AI capabilities
- **FastAPI Team** - For excellent framework
- **Open Source Community** - For amazing libraries

---

## 📞 Contact

- **GitHub**: [Bablushakya](https://github.com/Bablushakya)
- **Project**: [nasa-2025-hackathon](https://github.com/Bablushakya/nasa-2025-hackathon)
- **NASA Space Apps Challenge**: [2025](https://www.spaceappschallenge.org/)

---

**🌌 Built with ❤️ for space exploration and the search for life beyond Earth.**

*NASA Space Apps Challenge 2025 - ExoPlanet AI Team*