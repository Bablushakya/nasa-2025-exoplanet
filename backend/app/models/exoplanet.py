"""
Exoplanet database models
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Index
from sqlalchemy.sql import func
from app.core.database import Base


class Exoplanet(Base):
    """Exoplanet model"""
    
    __tablename__ = "exoplanets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    host_star = Column(String(255), index=True, nullable=False)
    discovery_year = Column(Integer, index=True)
    mission = Column(String(100), index=True)
    
    # Orbital characteristics
    orbital_period = Column(Float)  # days
    transit_duration = Column(Float)  # hours
    
    # Physical characteristics
    planetary_radius = Column(Float)  # Earth radii
    transit_depth = Column(Float)  # percentage
    stellar_magnitude = Column(Float)
    equilibrium_temperature = Column(Float)  # Kelvin
    
    # Location
    distance = Column(Float)  # light years
    
    # Classification
    planet_type = Column(String(100))
    habitable_zone = Column(Boolean, default=False)
    confirmed = Column(Boolean, default=False, index=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Additional data (JSON)
    additional_data = Column(Text)  # JSON string for flexible data
    
    # Indexes for common queries
    __table_args__ = (
        Index('idx_discovery_year_mission', 'discovery_year', 'mission'),
        Index('idx_confirmed_habitable', 'confirmed', 'habitable_zone'),
        Index('idx_orbital_period', 'orbital_period'),
        Index('idx_planetary_radius', 'planetary_radius'),
    )


class Prediction(Base):
    """ML prediction results model"""
    
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(String(255), unique=True, index=True, nullable=False)
    
    # Input data
    orbital_period = Column(Float, nullable=False)
    transit_duration = Column(Float, nullable=False)
    planetary_radius = Column(Float, nullable=False)
    transit_depth = Column(Float, nullable=False)
    stellar_magnitude = Column(Float, nullable=False)
    equilibrium_temperature = Column(Float, nullable=False)
    
    # Prediction results
    classification = Column(String(50), nullable=False)  # Confirmed, Candidate, False Positive
    confidence = Column(Float, nullable=False)  # 0-100
    
    # Probability scores
    prob_confirmed = Column(Float, nullable=False)
    prob_candidate = Column(Float, nullable=False)
    prob_false_positive = Column(Float, nullable=False)
    
    # Metrics
    signal_to_noise = Column(Float)
    transit_score = Column(Float)
    periodicity = Column(Float)
    
    # Processing info
    processing_time = Column(Float)  # seconds
    model_version = Column(String(50))
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(String(255), index=True)  # Optional user tracking
    
    # Indexes
    __table_args__ = (
        Index('idx_classification_confidence', 'classification', 'confidence'),
        Index('idx_created_at', 'created_at'),
        Index('idx_user_predictions', 'user_id', 'created_at'),
    )


class ModelMetrics(Base):
    """Model performance metrics"""
    
    __tablename__ = "model_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    model_version = Column(String(50), nullable=False, index=True)
    
    # Performance metrics
    accuracy = Column(Float, nullable=False)
    precision_confirmed = Column(Float, nullable=False)
    precision_candidate = Column(Float, nullable=False)
    precision_false_positive = Column(Float, nullable=False)
    
    recall_confirmed = Column(Float, nullable=False)
    recall_candidate = Column(Float, nullable=False)
    recall_false_positive = Column(Float, nullable=False)
    
    f1_confirmed = Column(Float, nullable=False)
    f1_candidate = Column(Float, nullable=False)
    f1_false_positive = Column(Float, nullable=False)
    
    # Training info
    training_samples = Column(Integer)
    validation_samples = Column(Integer)
    test_samples = Column(Integer)
    
    training_time = Column(Float)  # hours
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=False, index=True)
    
    # Additional metrics (JSON)
    confusion_matrix = Column(Text)  # JSON string
    roc_curves = Column(Text)  # JSON string
    training_history = Column(Text)  # JSON string