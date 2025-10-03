"""
API v1 router configuration
"""

from fastapi import APIRouter
from app.api.v1.endpoints import exoplanets, predictions, auth, models

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    exoplanets.router,
    prefix="/exoplanets",
    tags=["exoplanets"]
)

api_router.include_router(
    predictions.router,
    prefix="/predictions",
    tags=["predictions"]
)

api_router.include_router(
    models.router,
    prefix="/models",
    tags=["models"]
)

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["authentication"]
)