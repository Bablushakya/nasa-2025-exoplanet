"""
Pydantic schemas for exoplanet data validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class PlanetType(str, Enum):
    """Planet type enumeration"""
    ROCKY = "Rocky"
    GAS_GIANT = "Gas Giant"
    SUPER_EARTH = "Super Earth"
    HOT_JUPITER = "Hot Jupiter"
    SUB_NEPTUNE = "Sub-Neptune"


class Mission(str, Enum):
    """Space mission enumeration"""
    KEPLER = "Kepler"
    K2 = "K2"
    TESS = "TESS"
    GROUND_BASED = "Ground-based"


class Classification(str, Enum):
    """Prediction classification"""
    CONFIRMED = "Confirmed"
    CANDIDATE = "Candidate"
    FALSE_POSITIVE = "False Positive"


# Base schemas
class ExoplanetBase(BaseModel):
    """Base exoplanet schema"""
    name: str = Field(..., min_length=1, max_length=255)
    host_star: str = Field(..., min_length=1, max_length=255)
    discovery_year: Optional[int] = Field(None, ge=1995, le=2030)
    mission: Optional[Mission] = None
    
    # Orbital characteristics
    orbital_period: Optional[float] = Field(None, gt=0, le=10000)
    transit_duration: Optional[float] = Field(None, gt=0, le=24)
    
    # Physical characteristics
    planetary_radius: Optional[float] = Field(None, gt=0, le=50)
    transit_depth: Optional[float] = Field(None, gt=0, le=10)
    stellar_magnitude: Optional[float] = Field(None, ge=-5, le=20)
    equilibrium_temperature: Optional[float] = Field(None, gt=0, le=3000)
    
    # Location
    distance: Optional[float] = Field(None, gt=0, le=10000)
    
    # Classification
    planet_type: Optional[PlanetType] = None
    habitable_zone: Optional[bool] = False
    confirmed: Optional[bool] = False


class ExoplanetCreate(ExoplanetBase):
    """Schema for creating exoplanet"""
    pass


class ExoplanetUpdate(BaseModel):
    """Schema for updating exoplanet"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    host_star: Optional[str] = Field(None, min_length=1, max_length=255)
    discovery_year: Optional[int] = Field(None, ge=1995, le=2030)
    mission: Optional[Mission] = None
    orbital_period: Optional[float] = Field(None, gt=0, le=10000)
    transit_duration: Optional[float] = Field(None, gt=0, le=24)
    planetary_radius: Optional[float] = Field(None, gt=0, le=50)
    transit_depth: Optional[float] = Field(None, gt=0, le=10)
    stellar_magnitude: Optional[float] = Field(None, ge=-5, le=20)
    equilibrium_temperature: Optional[float] = Field(None, gt=0, le=3000)
    distance: Optional[float] = Field(None, gt=0, le=10000)
    planet_type: Optional[PlanetType] = None
    habitable_zone: Optional[bool] = None
    confirmed: Optional[bool] = None


class ExoplanetResponse(ExoplanetBase):
    """Schema for exoplanet response"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Prediction schemas
class PredictionInput(BaseModel):
    """Schema for prediction input"""
    orbital_period: float = Field(..., gt=0, le=10000, description="Orbital period in days")
    transit_duration: float = Field(..., gt=0, le=24, description="Transit duration in hours")
    planetary_radius: float = Field(..., gt=0, le=50, description="Planetary radius in Earth radii")
    transit_depth: float = Field(..., gt=0, le=10, description="Transit depth percentage")
    stellar_magnitude: float = Field(..., ge=-5, le=20, description="Host star magnitude")
    equilibrium_temperature: float = Field(..., gt=0, le=3000, description="Equilibrium temperature in Kelvin")
    
    @validator('transit_depth')
    def validate_transit_depth(cls, v):
        if v <= 0 or v > 10:
            raise ValueError('Transit depth must be between 0 and 10 percent')
        return v


class PredictionBatch(BaseModel):
    """Schema for batch predictions"""
    predictions: List[PredictionInput] = Field(..., max_items=100)


class ProbabilityScores(BaseModel):
    """Probability scores for each class"""
    confirmed: float = Field(..., ge=0, le=1)
    candidate: float = Field(..., ge=0, le=1)
    false_positive: float = Field(..., ge=0, le=1)


class PredictionMetrics(BaseModel):
    """Additional prediction metrics"""
    signal_to_noise: float
    transit_score: float
    periodicity: float


class PredictionResult(BaseModel):
    """Schema for prediction result"""
    id: str = Field(..., description="Unique prediction ID")
    classification: Classification
    confidence: float = Field(..., ge=0, le=100, description="Confidence percentage")
    probability: ProbabilityScores
    metrics: PredictionMetrics
    processing_time: float = Field(..., description="Processing time in seconds")
    model_version: str
    timestamp: datetime


class PredictionResponse(BaseModel):
    """Schema for prediction API response"""
    success: bool = True
    data: PredictionResult
    message: str = "Prediction completed successfully"


class BatchPredictionResponse(BaseModel):
    """Schema for batch prediction response"""
    success: bool = True
    data: List[PredictionResult]
    message: str = "Batch prediction completed successfully"


# Filter schemas
class ExoplanetFilter(BaseModel):
    """Schema for filtering exoplanets"""
    search: Optional[str] = Field(None, max_length=255)
    missions: Optional[List[Mission]] = None
    year_min: Optional[int] = Field(None, ge=1995, le=2030)
    year_max: Optional[int] = Field(None, ge=1995, le=2030)
    planet_types: Optional[List[PlanetType]] = None
    period_min: Optional[float] = Field(None, ge=0)
    period_max: Optional[float] = Field(None, ge=0)
    radius_min: Optional[float] = Field(None, ge=0)
    radius_max: Optional[float] = Field(None, ge=0)
    distance_min: Optional[float] = Field(None, ge=0)
    distance_max: Optional[float] = Field(None, ge=0)
    habitable_zone: Optional[bool] = None
    confirmed_only: Optional[bool] = None
    
    # Pagination
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
    
    # Sorting
    sort_by: Optional[str] = Field("name", pattern="^(name|discovery_year|distance|orbital_period|planetary_radius)$")
    sort_order: Optional[str] = Field("asc", pattern="^(asc|desc)$")


class ExoplanetListResponse(BaseModel):
    """Schema for exoplanet list response"""
    success: bool = True
    data: List[ExoplanetResponse]
    pagination: Dict[str, Any]
    message: str = "Exoplanets retrieved successfully"


# Model performance schemas
class ModelPerformance(BaseModel):
    """Model performance metrics"""
    accuracy: float = Field(..., ge=0, le=1)
    precision: Dict[str, float]
    recall: Dict[str, float]
    f1_score: Dict[str, float]
    confusion_matrix: List[List[int]]
    training_samples: int
    model_version: str
    created_at: datetime


class ModelPerformanceResponse(BaseModel):
    """Model performance response"""
    success: bool = True
    data: ModelPerformance
    message: str = "Model performance retrieved successfully"