# ExoPlanet AI - Exoplanet Detection Web Application

A modern, space-themed web application for detecting and exploring exoplanets using AI-powered analysis. Built for the NASA Space Apps Challenge 2025.

## 🌟 Features

- **AI-Powered Detection**: Advanced machine learning algorithms for exoplanet classification
- **Interactive Dashboard**: Real-time analysis with multiple input methods
- **Data Explorer**: Browse and filter thousands of known exoplanets
- **Educational Content**: Learn about exoplanets and detection methods
- **Model Information**: Detailed AI model architecture and performance metrics
- **API Documentation**: Complete REST API reference with interactive testing
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Accessibility**: WCAG 2.1 compliant with full keyboard navigation

## 🚀 Live Demo

Visit the live application: [ExoPlanet AI](https://your-domain.com)

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Grid, Flexbox, and custom properties
- **JavaScript ES6+**: Vanilla JavaScript with modular architecture
- **Chart.js**: Interactive data visualizations
- **Particles.js**: Animated space background effects
- **AOS**: Animate On Scroll library for smooth animations

### Design
- **Glassmorphism**: Modern glass-like UI effects
- **Space Theme**: Dark navy background with purple/blue gradients
- **Typography**: Space Grotesk, Rajdhani, and Inter fonts
- **Icons**: Font Awesome icon library
- **Responsive**: Mobile-first design approach

### Flow chat of exoplants web interface or High-Level Architecture:

┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                           │
│  (Web Browser, Mobile, API Clients)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    CDN / CLOUDFLARE                         │
│  (Static Assets, DDoS Protection, Caching)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ↓                              ↓
┌──────────────────┐          ┌──────────────────┐
│   FRONTEND       │          │   BACKEND API     │
│   (Static Site)  │←────────→│   (FastAPI)       │
│   Netlify/Vercel │          │   Railway/AWS     │
└──────────────────┘          └────────┬──────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ↓                  ↓                   ↓
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │  PostgreSQL  │  │  Redis Cache │  │  ML Model    │
            │  Database    │  │  (Sessions)  │  │  Storage     │
            │  (Supabase)  │  │              │  │  (S3/GCS)    │
            └──────────────┘  └──────────────┘  └──────────────┘
                    ↓                  ↓                   ↓
            ┌──────────────────────────────────────────────────┐
            │         MONITORING & LOGGING LAYER               │
            │  (Sentry, LogDNA, Prometheus, Grafana)           │
            └──────────────────────────────────────────────────┘




### Technology Stack (Production):

ComponentTechnologyWhy?FrontendHTML/CSS/JS + Chart.jsLightweight, fast, no build step neededFrontend HostingNetlify/VercelFree tier, auto-deploy, CDN includedBackendPython + FastAPIFast, async, perfect for MLBackend HostingRailway/RenderFree tier, easy deploy, auto-scalingDatabasePostgreSQL (Supabase)Reliable, free tier, managedCacheRedis (Upstash)Fast caching, free tierML StorageAWS S3 / Google Cloud StorageModel versioning, cheapCDNCloudflareFree, DDoS protectionMonitoringSentry + Google AnalyticsError tracking, usage analyticsCI/CDGitHub ActionsAutomated testing & deploymentDomainNamecheap/GoDaddyCustom domain for professionalism

## 📁 Project Structure

```
exoplanet-detection-webapp/
├── index.html                 # Landing page
├── dashboard.html            # Detection dashboard
├── explorer.html             # Data explorer
├── learn.html               # Educational content
├── model.html               # Model information
├── api.html                 # API documentation
├── about.html               # About page
├── css/
│   ├── style.css            # Main styles and theme
│   ├── components.css       # Reusable UI components
│   └── responsive.css       # Media queries and responsive design
├── js/
│   ├── main.js              # Core application logic
│   ├── dashboard.js         # Dashboard functionality
│   ├── charts.js            # Chart configurations
│   ├── explorer.js          # Data filtering and search
│   └── utils.js             # Utility functions
├── assets/
│   ├── images/              # Images and icons
│   └── data/
│       └── sample-data.json # Sample exoplanet datasets
└── README.md
```

## 🎯 Key Pages

### 1. Home Page (index.html)
- Hero section with animated background
- Statistics counters with real-time animations
- Feature highlights with hover effects
- "How It Works" timeline

### 2. Detection Dashboard (dashboard.html)
- Multiple input methods (manual, file upload, sample data)
- Real-time AI analysis simulation
- Interactive results visualization
- Confidence scoring and classification

### 3. Data Explorer (explorer.html)
- Advanced filtering system
- Grid/list view toggle
- Detailed planet information modals
- Pagination and search functionality

### 4. Learn Page (learn.html)
- Educational content about exoplanets
- Interactive transit method visualization
- Data variables glossary with accordion
- Knowledge quiz with instant feedback

### 5. Model Information (model.html)
- AI model architecture visualization
- Performance metrics and charts
- Training information and history
- Model comparison table

### 6. API Documentation (api.html)
- Complete endpoint reference
- Interactive code examples
- API testing interface
- Authentication and rate limiting info

### 7. About Page (about.html)
- Mission statement and project goals
- Team member profiles
- Technology stack information
- Contact form

## 🎨 Design Features

### Color Palette
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Purple)
- **Accent**: #3b82f6 (Blue)
- **Background**: #0f172a (Dark Navy)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Orange)
- **Error**: #ef4444 (Red)

### UI Components
- Glassmorphism cards with backdrop blur
- Gradient buttons with hover animations
- Toast notifications system
- Loading spinners and progress bars
- Modal dialogs with smooth transitions
- Responsive navigation with mobile menu

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility Features

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences
- Proper ARIA labels and semantic HTML

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/exoplanet-detection-webapp.git
   cd exoplanet-detection-webapp
   ```

2. **Serve the files**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js:
   ```bash
   npx serve .
   ```
   
   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🔧 Configuration

### Theme Customization
Edit CSS custom properties in `css/style.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --background-color: #0f172a;
  /* ... other variables */
}
```

### Sample Data
Modify `assets/data/sample-data.json` to update:
- Exoplanet database
- Sample datasets
- Model performance metrics
- Application statistics

## 📊 Data Sources

- **NASA Exoplanet Archive**: Confirmed exoplanet data
- **Kepler Mission**: High-quality transit photometry
- **TESS Survey**: Recent exoplanet discoveries
- **K2 Extended Mission**: Diverse astronomical targets

## 🤖 AI Model Simulation

The application simulates an AI model for educational purposes:
- **Architecture**: 3-layer neural network with dropout
- **Input Features**: 6 exoplanet characteristics
- **Output Classes**: Confirmed, Candidate, False Positive
- **Accuracy**: 94.7% (simulated)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Security

- Content Security Policy (CSP) headers
- Input sanitization and validation
- XSS protection
- Secure external resource loading

## 💬 Comments & Feedback

| Date | Author | Comment | Status | Priority |
|------|--------|---------|--------|----------|
| 2025-01-15 | @developer1 | Add dark mode toggle for better accessibility | Open | High |
| 2025-01-14 | @uxdesigner | Consider adding animation presets for reduced motion users | In Progress | Medium |
| 2025-01-13 | @tester | Mobile navigation needs improvement on small screens | Resolved | High |
| 2025-01-12 | @scientist | Include more detailed exoplanet classification criteria | Open | Medium |
| 2025-01-11 | @reviewer | API documentation could use more code examples | Open | Low |
| 2025-01-10 | @contributor | Performance optimization needed for large datasets | In Progress | High |
| 2025-01-09 | @mentor | Great work on the glassmorphism design! | Closed | - |
| 2025-01-08 | @teamlead | Consider adding unit tests for utility functions | Open | Medium |

### Comment Guidelines
- Use clear, constructive feedback
- Include specific examples when possible
- Tag relevant team members
- Update status as issues are addressed
- Prioritize based on user impact

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 NASA Space Apps Challenge 2025

This project was developed for the NASA Space Apps Challenge 2025, focusing on:
- **Challenge**: Exoplanet Detection and Analysis
- **Team**: ExoPlanet AI Development Team
- **Goal**: Democratize exoplanet discovery through AI-powered tools

## 🙏 Acknowledgments

- **NASA**: For providing exoplanet data and inspiring space exploration
- **Kepler/TESS Teams**: For groundbreaking exoplanet discoveries
- **Open Source Community**: For the amazing libraries and tools
- **Space Apps Challenge**: For fostering innovation in space technology

## 📞 Contact

- **Website**: [exoplanet-ai.com](https://exoplanet-ai.com)
- **Email**: hello@exoplanet-ai.com
- **GitHub**: [@exoplanet-ai](https://github.com/exoplanet-ai)
- **Twitter**: [@ExoPlanetAI](https://twitter.com/ExoPlanetAI)

## 🔗 Links

- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)
- [Kepler Mission](https://www.nasa.gov/kepler)
- [TESS Mission](https://www.nasa.gov/tess-transiting-exoplanet-survey-satellite)
- [Space Apps Challenge](https://www.spaceappschallenge.org/)

---

**Built with ❤️ for space exploration and the search for life beyond Earth.**
## 🔗 
Frontend-Backend Integration

The application now features a fully integrated frontend and backend system:

### Quick Start with Integration

#### Easy Setup (Windows)
```bash
# Clone the repository
git clone https://github.com/yourusername/exoplanet-ai.git
cd exoplanet-ai

# Run the development setup
start-dev.bat
```
This automatically starts:
- Backend server on http://localhost:8000
- Frontend server on http://localhost:3000
- Integration test page at http://localhost:3000/integration-test.html

#### Manual Setup
```bash
# 1. Set up the backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py

# 2. Serve the frontend (new terminal)
cd ..
python -m http.server 3000
```

### Integration Architecture

```
Frontend (Browser) 
    ↕ HTTP/JSON
API Service (js/api.js)
    ↕ REST API
FastAPI Backend (Python)
    ↕ SQLAlchemy
Database (SQLite/PostgreSQL)
```

### Key Integration Components

#### API Service (`js/api.js`)
- Centralized API communication layer
- Authentication and session management
- Request/response handling with error recovery
- Data caching and optimization
- Real-time connectivity monitoring

#### Dashboard Integration (`js/dashboard.js`)
- Live data synchronization with backend
- Interactive prediction forms with validation
- Real-time statistics and chart updates
- Automatic data refresh every 5 minutes
- Graceful degradation when backend unavailable

#### Authentication System
- Secure JWT-based authentication
- Automatic token refresh
- Session persistence across browser sessions
- Role-based access control

### API Endpoints

#### Core Endpoints
- `GET /api/v1/health` - System health check
- `GET /api/v1/statistics` - Real-time system statistics

#### Exoplanet Data
- `GET /api/v1/exoplanets` - List exoplanets with filtering
- `GET /api/v1/exoplanets/{id}` - Get specific exoplanet details
- `GET /api/v1/exoplanets/search` - Advanced search functionality

#### AI Predictions
- `POST /api/v1/predictions/predict` - Make exoplanet predictions
- `GET /api/v1/predictions` - List user predictions
- `GET /api/v1/predictions/{id}` - Get prediction details

#### Authentication
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - Session termination

### Testing the Integration

#### Integration Test Page
Visit `http://localhost:3000/integration-test.html` to:
- ✅ Test backend connectivity
- ✅ Verify all API endpoints
- ✅ Test prediction functionality
- ✅ Check authentication flow
- ✅ Monitor real-time data updates

#### Development Workflow
1. **Start Development**: Run `start-dev.bat` or start servers manually
2. **Backend Changes**: Auto-reloads on file changes
3. **Frontend Changes**: Refresh browser to see updates
4. **API Changes**: Update both backend and frontend API service
5. **Testing**: Use integration test page for verification

### Project Structure (Updated)

```
exoplanet-ai/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes and endpoints
│   │   ├── core/           # Core functionality and config
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic services
│   ├── scripts/            # Database and utility scripts
│   └── requirements.txt    # Python dependencies
├── js/                     # Frontend JavaScript
│   ├── api.js             # API service layer
│   ├── dashboard.js       # Dashboard integration
│   ├── main.js            # Main application logic
│   └── utils.js           # Utility functions
├── css/                    # Stylesheets
├── assets/                 # Static assets
├── integration-test.html   # Integration testing page
├── start-dev.bat          # Development startup script
└── *.html                 # Application pages
```

### Data Flow Examples

#### Making a Prediction
1. User fills prediction form on dashboard
2. Frontend validates input data
3. API service sends POST to `/api/v1/predictions/predict`
4. Backend processes with AI model
5. Results displayed in real-time on frontend
6. Prediction saved to database for history

#### Real-time Statistics
1. Dashboard loads and calls `/api/v1/statistics`
2. Statistics displayed with animated counters
3. Data refreshes automatically every 5 minutes
4. Charts update with new discovery trends
5. Graceful fallback if backend unavailable

### Troubleshooting Integration

#### Common Issues
- **CORS Errors**: Backend includes CORS middleware for localhost
- **Connection Refused**: Ensure backend is running on port 8000
- **API Timeouts**: Check network connectivity and backend logs
- **Authentication Issues**: Clear browser storage and re-login

#### Debug Tools
- **Backend Logs**: Check terminal running `python run.py`
- **Frontend Console**: Use browser developer tools
- **Network Tab**: Monitor API requests and responses
- **Integration Test**: Use test page for systematic verification

---

The integration provides a seamless full-stack experience with real-time data synchronization, robust error handling, and comprehensive testing capabilities.