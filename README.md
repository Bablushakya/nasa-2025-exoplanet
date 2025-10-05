# 🌌 ExoPlanet AI - NASA Space Apps Challenge 2025

An AI-powered web application for exoplanet detection and analysis, featuring beautiful space-themed UI and interactive learning experiences.

## ✨ Features

- **🎨 Beautiful Space-Themed UI**: Stunning animations, glassmorphism effects, and cosmic gradients
- **🤖 AI-Powered Detection**: Machine learning models for exoplanet classification
- **📊 Interactive Dashboard**: Real-time data visualization with animated charts
- **🎓 Educational Content**: Interactive learning modules about exoplanets
- **🔍 Data Explorer**: Browse and analyze exoplanet datasets
- **📱 Responsive Design**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Modern web browser
- Internet connection (for external fonts and libraries)

### 🎯 Easy Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exoplanet-ai
   ```

2. **Start the Backend**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate          # Windows
   # source venv/bin/activate     # macOS/Linux
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

3. **Start the Frontend** (in a new terminal)
   ```bash
   python start_frontend.py
   ```

4. **Access the Application**
   - 🌐 Frontend: http://localhost:3000
   - 🔧 Backend API: http://localhost:8000
   - 📚 API Docs: http://localhost:8000/docs

### 🪟 Windows Users

Use the provided batch files for easy startup:
- **Backend**: Double-click `backend/start_server.bat`
- **Frontend**: Double-click `start_frontend.bat`

## 🎨 Enhanced UI Features

### 🌟 Visual Enhancements
- **Animated Planet Types**: Spinning planets with unique colors and effects
- **Glassmorphism Cards**: Frosted glass effects with backdrop blur
- **Cosmic Backgrounds**: Twinkling stars and nebula effects
- **Interactive Hover Effects**: Smooth transitions and glow animations
- **Neural Network Visualizations**: AI processing pipeline animations

### 🎭 Page-Specific Features

#### 🏠 **Home Page**
- Hero section with animated space background
- Feature cards with hover effects
- Smooth scroll animations

#### 📊 **Dashboard**
- Real-time animated charts
- Interactive data cards
- Status indicators with pulsing effects

#### 🔍 **Explorer**
- Filterable exoplanet catalog
- Interactive data visualization
- Smooth transitions between views

#### 🎓 **Learn Page**
- Animated planet type demonstrations
- Interactive transit simulation
- Gamified quiz with progress tracking

#### 🤖 **Model Page**
- AI pipeline visualization
- Performance metrics with animated badges
- Version timeline with gradient connectors

#### 👥 **About Page**
- Team member cards with photo zoom effects
- Skill tags with hover animations
- Contact cards with slide effects

## 📁 Project Structure

```
exoplanet-ai/
├── 🔧 backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── core/              # Core functionality
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic (Mock ML)
│   ├── start_server.bat       # Windows startup script
│   └── requirements.txt       # Python dependencies
├── 🎨 css/                    # Stylesheets
│   ├── style.css             # Main styles
│   ├── components.css        # Component styles
│   ├── animations.css        # Animation effects
│   ├── page-enhancements.css # Page-specific enhancements
│   └── responsive.css        # Mobile responsiveness
├── ⚡ js/                     # JavaScript modules
│   ├── main.js               # Core functionality
│   ├── space-animations.js   # Animation system
│   ├── api.js                # API integration
│   └── [page-specific].js    # Page modules
├── 🖼️ assets/                 # Images and data
├── 🌐 *.html                  # Frontend pages
├── 🚀 start_frontend.py       # Frontend server
├── 🪟 start_frontend.bat      # Windows frontend startup
└── 📖 README.md
```

## 🛠️ Development

### Backend Features
- **FastAPI** with automatic API documentation
- **SQLite** database with SQLAlchemy ORM
- **Mock ML Service** (ready for real ML integration)
- **CORS enabled** for frontend integration
- **Comprehensive error handling**

### Frontend Architecture
- **Vanilla JavaScript** with modular design
- **CSS Grid/Flexbox** for responsive layouts
- **AOS animations** for scroll effects
- **Chart.js** for data visualization
- **Progressive enhancement** approach

## 🎯 NASA Space Apps Challenge 2025

This project showcases:

1. **🎓 Educational Impact**: Interactive learning about exoplanets and detection methods
2. **🔬 Scientific Accuracy**: Based on real astronomical principles and data
3. **🤖 AI Innovation**: Demonstrates machine learning applications in astronomy
4. **🎨 User Experience**: Engaging, beautiful interface that makes science accessible
5. **🌍 Accessibility**: Works on all devices and connection speeds

## 🚀 Deployment Ready

The application is designed for easy deployment:
- **Frontend**: Static files ready for any web server
- **Backend**: FastAPI app ready for cloud deployment
- **Database**: SQLite for development, easily upgradeable to PostgreSQL
- **Docker**: Dockerfile included for containerization

## 🎨 Customization

The UI system is highly customizable:
- **CSS Variables**: Easy color scheme changes
- **Modular Components**: Reusable UI elements
- **Animation Controls**: Configurable timing and effects
- **Responsive Breakpoints**: Adaptable to any screen size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- 🚀 **NASA** for inspiring space exploration and providing astronomical data
- 🌟 **The astronomical community** for research and open datasets
- 💻 **Open source contributors** for the amazing libraries and frameworks
- 🎨 **Design inspiration** from modern space exploration interfaces

---

**🌌 Ready to explore the cosmos? Start your journey with ExoPlanet AI!**