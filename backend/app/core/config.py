"""
Configuration settings for ExoPlanet AI API
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings"""
    
    # Project info
    PROJECT_NAME: str = "ExoPlanet AI API"
    PROJECT_DESCRIPTION: str = "AI-powered exoplanet detection and analysis platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: Optional[str] = None
    SQLITE_URL: str = "sqlite+aiosqlite:///./exoplanet_ai.db"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:8080,http://localhost:5500,http://127.0.0.1:5500"
    ALLOWED_HOSTS: str = "*"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert comma-separated origins to list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    @property 
    def allowed_hosts_list(self) -> List[str]:
        """Convert comma-separated hosts to list"""
        if self.ALLOWED_HOSTS == "*":
            return ["*"]
        return [host.strip() for host in self.ALLOWED_HOSTS.split(",")]
    
    # Redis (optional)
    REDIS_URL: Optional[str] = None
    CACHE_TTL: int = 3600  # 1 hour
    
    # ML Model settings
    MODEL_PATH: str = "models/"
    MAX_PREDICTION_BATCH_SIZE: int = 100
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # File upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: str = ".csv,.json"
    
    @property
    def allowed_file_types_list(self) -> List[str]:
        """Convert comma-separated file types to list"""
        return [ft.strip() for ft in self.ALLOWED_FILE_TYPES.split(",")]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    @property
    def database_url(self) -> str:
        """Get database URL based on environment"""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return self.SQLITE_URL
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()