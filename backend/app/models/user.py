"""
User authentication models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    """User model for authentication"""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile info
    full_name = Column(String(255))
    organization = Column(String(255))
    
    # Status
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)
    
    # API usage
    api_key = Column(String(255), unique=True, index=True)
    rate_limit_tier = Column(String(50), default="free")  # free, pro, enterprise
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Preferences (JSON)
    preferences = Column(Text)  # JSON string for user preferences


class APIKey(Base):
    """API key model for external access"""
    
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    key_id = Column(String(255), unique=True, index=True, nullable=False)
    key_hash = Column(String(255), nullable=False)
    
    # Key info
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Permissions
    scopes = Column(Text)  # JSON array of scopes
    rate_limit = Column(Integer, default=60)  # requests per minute
    
    # Status
    is_active = Column(Boolean, default=True, index=True)
    expires_at = Column(DateTime(timezone=True))
    
    # Usage tracking
    last_used = Column(DateTime(timezone=True))
    usage_count = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(Integer)  # User ID who created the key