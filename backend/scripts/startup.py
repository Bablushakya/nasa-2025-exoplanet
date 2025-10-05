#!/usr/bin/env python3
"""
Startup script for ExoPlanet AI Enhanced
Handles initialization, database setup, and application startup
"""

import asyncio
import sys
import os
import logging
from pathlib import Path

# Add app to path
sys.path.append(str(Path(__file__).parent.parent))

from app.core.config import settings
from app.core.database import engine, Base
from app.core.logging import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


async def create_directories():
    """Create necessary directories"""
    directories = [
        "logs",
        "models", 
        "data",
        "cache"
    ]
    
    for directory in directories:
        path = Path(directory)
        path.mkdir(exist_ok=True)
        logger.info(f"✅ Directory ensured: {directory}")


async def initialize_database():
    """Initialize database tables"""
    try:
        logger.info("🗄️ Initializing database...")
        
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        logger.info("✅ Database initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        return False


async def check_environment():
    """Check environment configuration"""
    logger.info("🔍 Checking environment configuration...")
    
    # Check required settings
    required_settings = [
        "PROJECT_NAME",
        "VERSION",
        "API_V1_STR"
    ]
    
    missing_settings = []
    for setting in required_settings:
        if not hasattr(settings, setting):
            missing_settings.append(setting)
    
    if missing_settings:
        logger.error(f"❌ Missing required settings: {missing_settings}")
        return False
    
    # Check API keys (warn if missing but don't fail)
    api_keys = {
        "NASA_API_KEY": os.getenv("NASA_API_KEY"),
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY")
    }
    
    for key_name, key_value in api_keys.items():
        if not key_value or key_value.startswith("your_"):
            logger.warning(f"⚠️ {key_name} not configured - some features may not work")
        else:
            logger.info(f"✅ {key_name} configured")
    
    logger.info("✅ Environment check completed")
    return True


async def setup_models():
    """Setup ML models and metadata"""
    try:
        logger.info("🤖 Setting up ML models...")
        
        models_dir = Path("models")
        models_dir.mkdir(exist_ok=True)
        
        # Create default model metadata if it doesn't exist
        metadata_file = models_dir / "model_metadata.json"
        if not metadata_file.exists():
            import json
            import time
            
            default_metadata = {
                "version": "2.1.0-mock",
                "feature_names": [
                    "orbital_period",
                    "transit_duration", 
                    "planetary_radius",
                    "transit_depth",
                    "stellar_magnitude",
                    "equilibrium_temperature"
                ],
                "classes": ["Confirmed", "Candidate", "False Positive"],
                "created_at": time.time(),
                "model_type": "MockRandomForestClassifier"
            }
            
            with open(metadata_file, 'w') as f:
                json.dump(default_metadata, f, indent=2)
            
            logger.info("✅ Default model metadata created")
        
        logger.info("✅ ML models setup completed")
        return True
        
    except Exception as e:
        logger.error(f"❌ ML models setup failed: {e}")
        return False


async def main():
    """Main startup function"""
    logger.info("🚀 Starting ExoPlanet AI Enhanced initialization...")
    
    # Create directories
    await create_directories()
    
    # Check environment
    env_ok = await check_environment()
    if not env_ok:
        logger.error("💥 Environment check failed")
        sys.exit(1)
    
    # Initialize database
    db_ok = await initialize_database()
    if not db_ok:
        logger.error("💥 Database initialization failed")
        sys.exit(1)
    
    # Setup models
    models_ok = await setup_models()
    if not models_ok:
        logger.error("💥 Models setup failed")
        sys.exit(1)
    
    logger.info("🎉 Initialization completed successfully!")
    logger.info("🌌 ExoPlanet AI Enhanced is ready to explore the cosmos!")
    
    return True


if __name__ == "__main__":
    success = asyncio.run(main())
    if success:
        sys.exit(0)
    else:
        sys.exit(1)