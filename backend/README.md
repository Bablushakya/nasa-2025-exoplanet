# ExoPlanet AI - Backend API

A production-ready REST API for exoplanet detection and analysis using FastAPI, PostgreSQL, and machine learning.

## 🚀 Features

- **FastAPI Framework**: Modern, fast web framework with automatic API documentation
- **Machine Learning**: Scikit-learn and TensorFlow integration for exoplanet detection
- **Database**: PostgreSQL for production, SQLite for development
- **Authentication**: JWT-based authentication with API key support
- **Data Validation**: Pydantic models for request/response validation
- **Database Migrations**: Alembic for database schema management
- **Async Support**: Full async/await support for high performance
- **API Documentation**: Automatic OpenAPI/Swagger documentation
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 📋 Requirements

- Python 3.8+
- PostgreSQL 12+ (for production)
- Redis (optional, for caching)

## 🛠 Installation

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# For development, the default SQLite configuration works out of the box
```

### 3. Database Setup

```bash
# Initialize database (creates tables and sample data)
python scripts/init_db.py

# Or use Alembic for migrations
alembic upgrade head
```

### 4. Run the Application

```bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## 🔗 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/exoplanets/` | List exoplanets with filtering |
| GET | `/api/v1/exoplanets/{id}` | Get specific exoplanet |
| POST | `/api/v1/exoplanets/` | Create new exoplanet |
| PUT | `/api/v1/exoplanets/{id}` | Update exoplanet |
| DELETE | `/api/v1/exoplanets/{id}` | Delete exoplanet |

### Prediction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/predictions/predict` | Single prediction |
| POST | `/api/v1/predictions/predict/batch` | Batch predictions |
| GET | `/api/v1/predictions/{id}` | Get prediction result |
| GET | `/api/v1/predictions/history` | Prediction history |
| GET | `/api/v1/predictions/stats` | Prediction statistics |

### Model Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/models/` | Available models |
| GET | `/api/v1/models/performance` | Model performance metrics |
| GET | `/api/v1/models/architecture` | Model architecture info |
| GET | `/api/v1/models/training-history` | Training history |
| GET | `/api/v1/models/comparison` | Model comparison |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/token` | Get access token |
| GET | `/api/v1/auth/verify` | Verify token |
| GET | `/api/v1/auth/me` | Current user info |

## 🔍 Example API Usage

### Make a Prediction

```bash
curl -X POST "http://localhost:8000/api/v1/predictions/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "orbital_period": 365.25,
    "transit_duration": 4.2,
    "planetary_radius": 1.0,
    "transit_depth": 0.008,
    "stellar_magnitude": 4.83,
    "equilibrium_temperature": 288
  }'
```

### Search Exoplanets

```bash
curl "http://localhost:8000/api/v1/exoplanets/?search=kepler&habitable_zone=true&page=1&page_size=10"
```

### Get Model Performance

```bash
curl "http://localhost:8000/api/v1/models/performance"
```

## 🏗 Project Structure

```
backend/
├── app/
│   ├── api/v1/
│   │   ├── endpoints/          # API route handlers
│   │   └── api.py             # API router configuration
│   ├── core/
│   │   ├── config.py          # Application configuration
│   │   ├── database.py        # Database setup
│   │   ├── exceptions.py      # Custom exceptions
│   │   └── logging.py         # Logging configuration
│   ├── models/
│   │   ├── exoplanet.py       # Database models
│   │   └── user.py            # User models
│   ├── schemas/
│   │   ├── exoplanet.py       # Pydantic schemas
│   │   └── user.py            # User schemas
│   ├── services/
│   │   ├── exoplanet_service.py  # Business logic
│   │   └── ml_service.py         # ML model service
│   └── main.py                # FastAPI application
├── alembic/                   # Database migrations
├── scripts/                   # Utility scripts
├── models/                    # ML model files
├── logs/                      # Application logs
├── requirements.txt           # Python dependencies
├── alembic.ini               # Alembic configuration
└── README.md                 # This file
```

## 🤖 Machine Learning

The API includes a built-in machine learning model for exoplanet detection:

- **Algorithm**: Random Forest Classifier (production-ready)
- **Features**: 6 input parameters (orbital period, transit duration, etc.)
- **Classes**: Confirmed, Candidate, False Positive
- **Accuracy**: ~94.7% on test data
- **Performance**: Sub-second prediction times

### Model Features

1. **Orbital Period** (days): Time for one complete orbit
2. **Transit Duration** (hours): Duration of planet crossing the star
3. **Planetary Radius** (Earth radii): Planet size relative to Earth
4. **Transit Depth** (%): Percentage decrease in star brightness
5. **Stellar Magnitude**: Brightness of the host star
6. **Equilibrium Temperature** (K): Estimated planet temperature

## 🗄 Database Schema

### Exoplanets Table
- Basic information (name, host star, discovery year)
- Orbital characteristics (period, duration)
- Physical properties (radius, temperature)
- Classification (type, habitable zone, confirmed status)

### Predictions Table
- Input parameters and results
- Confidence scores and probabilities
- Processing metrics and timestamps
- Model version tracking

### Model Metrics Table
- Performance metrics (accuracy, precision, recall)
- Training information
- Confusion matrices and ROC curves

## 🔧 Configuration

### Environment Variables

```bash
# Core Settings
DEBUG=True
ENVIRONMENT=development
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=sqlite+aiosqlite:///./exoplanet_ai.db
# DATABASE_URL=postgresql+asyncpg://user:pass@localhost/exoplanet_ai

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# ML Model
MODEL_PATH=models/
MAX_PREDICTION_BATCH_SIZE=100

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

### Production Deployment

For production deployment:

1. **Use PostgreSQL**: Update `DATABASE_URL` to PostgreSQL connection string
2. **Set Security**: Change `SECRET_KEY` to a secure random string
3. **Configure CORS**: Set `ALLOWED_ORIGINS` to your frontend domains
4. **Enable Logging**: Set appropriate `LOG_LEVEL`
5. **Use HTTPS**: Deploy behind a reverse proxy with SSL/TLS

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_predictions.py
```

## 📊 Monitoring

The API includes built-in monitoring capabilities:

- **Health Checks**: `/health` endpoint for load balancer checks
- **Metrics**: Request timing and performance metrics
- **Logging**: Structured JSON logging with different levels
- **Error Tracking**: Comprehensive error handling and reporting

## 🔒 Security

- **Input Validation**: Pydantic models validate all inputs
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Rate Limiting**: Built-in rate limiting capabilities
- **Authentication**: JWT-based authentication system

## 🚀 Performance

- **Async/Await**: Full async support for high concurrency
- **Connection Pooling**: Database connection pooling
- **Caching**: Optional Redis caching for frequently accessed data
- **Batch Processing**: Efficient batch prediction endpoints
- **Optimized Queries**: Indexed database queries for fast lookups

## 📈 Scaling

For high-traffic deployments:

1. **Horizontal Scaling**: Run multiple worker processes
2. **Database Optimization**: Use read replicas and connection pooling
3. **Caching**: Implement Redis for caching frequently accessed data
4. **Load Balancing**: Use a load balancer (nginx, HAProxy)
5. **Monitoring**: Implement comprehensive monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- NASA for exoplanet data and inspiration
- FastAPI team for the excellent framework
- Scikit-learn and TensorFlow communities
- NASA Space Apps Challenge 2025

---

**Built with ❤️ for space exploration and the search for life beyond Earth.**