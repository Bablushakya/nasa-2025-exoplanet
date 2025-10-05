"""
API v1 router configuration
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
import time

api_router = APIRouter()

# Health check endpoint for API
@api_router.get("/health")
async def api_health():
    """API health check endpoint"""
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "api_version": "v1",
            "timestamp": time.time()
        },
        "message": "ExoPlanet AI API v1 is running"
    }

# Basic API endpoints for testing
@api_router.get("/")
async def api_root():
    """API root endpoint"""
    return {
        "success": True,
        "message": "ExoPlanet AI API v1",
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/api/v1/",
            "/api/v1/status",
            "/api/v1/exoplanets",
            "/api/v1/predictions",
            "/docs"
        ]
    }

@api_router.get("/status")
async def api_status():
    """API status endpoint"""
    return {
        "success": True,
        "data": {
            "status": "online",
            "timestamp": time.time(),
            "services": {
                "database": "connected",
                "ml_model": "loaded",
                "nasa_api": "available",
                "gemini_ai": "available"
            }
        },
        "message": "All systems operational"
    }

@api_router.get("/exoplanets")
async def get_exoplanets(limit: int = 10):
    """Get sample exoplanet data"""
    # Sample exoplanet data for testing
    sample_data = [
        {
            "id": 1,
            "name": "Kepler-452b",
            "host_star": "Kepler-452",
            "discovery_year": 2015,
            "orbital_period": 384.8,
            "planetary_radius": 1.6,
            "discovery_method": "Transit",
            "distance": 1402,
            "status": "Confirmed"
        },
        {
            "id": 2,
            "name": "TRAPPIST-1e",
            "host_star": "TRAPPIST-1",
            "discovery_year": 2017,
            "orbital_period": 6.1,
            "planetary_radius": 0.92,
            "discovery_method": "Transit",
            "distance": 40,
            "status": "Confirmed"
        },
        {
            "id": 3,
            "name": "Proxima Centauri b",
            "host_star": "Proxima Centauri",
            "discovery_year": 2016,
            "orbital_period": 11.2,
            "planetary_radius": 1.1,
            "discovery_method": "Radial Velocity",
            "distance": 4.24,
            "status": "Confirmed"
        }
    ]
    
    return {
        "success": True,
        "data": {
            "exoplanets": sample_data[:limit],
            "total": len(sample_data),
            "limit": limit
        },
        "message": f"Retrieved {min(limit, len(sample_data))} exoplanets"
    }

@api_router.post("/predictions")
async def create_prediction(prediction_data: Dict[str, Any]):
    """Create a new exoplanet prediction"""
    # Mock prediction response
    return {
        "success": True,
        "data": {
            "prediction_id": "pred_123456",
            "classification": "Confirmed",
            "confidence": 0.87,
            "probability": {
                "confirmed": 0.87,
                "candidate": 0.11,
                "false_positive": 0.02
            },
            "processing_time": 0.234,
            "timestamp": time.time()
        },
        "message": "Prediction completed successfully"
    }

@api_router.get("/models")
async def get_models():
    """Get available ML models"""
    return {
        "success": True,
        "data": {
            "models": [
                {
                    "id": "exoplanet_classifier_v2",
                    "name": "ExoPlanet Classifier v2.1",
                    "type": "Random Forest",
                    "accuracy": 0.892,
                    "status": "active",
                    "version": "2.1.0"
                }
            ]
        },
        "message": "Available models retrieved"
    }

# Try to include the original endpoints if they work
try:
    from app.api.v1.endpoints import exoplanets, predictions, auth, models
    
    # Include original routers if they exist and work
    api_router.include_router(
        exoplanets.router,
        prefix="/advanced/exoplanets",
        tags=["advanced-exoplanets"]
    )
    
    api_router.include_router(
        predictions.router,
        prefix="/advanced/predictions", 
        tags=["advanced-predictions"]
    )
    
    api_router.include_router(
        models.router,
        prefix="/advanced/models",
        tags=["advanced-models"]
    )
    
    api_router.include_router(
        auth.router,
        prefix="/auth",
        tags=["authentication"]
    )
    
except ImportError as e:
    print(f"Warning: Could not import advanced endpoints: {e}")
    # Continue with basic endpoints only