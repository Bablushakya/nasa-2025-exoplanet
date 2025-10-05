#!/usr/bin/env python3
"""
Health check script for ExoPlanet AI Enhanced
Used by Docker health checks and monitoring
"""

import asyncio
import sys
import httpx
import logging
from pathlib import Path

# Add app to path
sys.path.append(str(Path(__file__).parent.parent))

from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def check_health():
    """Check application health"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://localhost:8000/health",
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    logger.info("✅ Health check passed")
                    return True
                else:
                    logger.error("❌ Health check failed: Invalid response")
                    return False
            else:
                logger.error(f"❌ Health check failed: HTTP {response.status_code}")
                return False
                
    except Exception as e:
        logger.error(f"❌ Health check failed: {e}")
        return False


async def check_database():
    """Check database connectivity"""
    try:
        from app.core.database import engine
        
        async with engine.begin() as conn:
            result = await conn.execute("SELECT 1")
            if result:
                logger.info("✅ Database check passed")
                return True
            else:
                logger.error("❌ Database check failed")
                return False
                
    except Exception as e:
        logger.error(f"❌ Database check failed: {e}")
        return False


async def check_apis():
    """Check external API connectivity"""
    checks = {
        "NASA API": "https://api.nasa.gov/planetary/apod",
        "Gemini API": "https://generativelanguage.googleapis.com/v1beta/models"
    }
    
    results = {}
    
    async with httpx.AsyncClient() as client:
        for name, url in checks.items():
            try:
                # Add API key for NASA
                params = {}
                if "nasa.gov" in url:
                    params["api_key"] = settings.NASA_API.API_KEY if hasattr(settings, 'NASA_API') else "DEMO_KEY"
                
                response = await client.get(url, params=params, timeout=5.0)
                
                if response.status_code in [200, 401, 403]:  # 401/403 means API is reachable
                    results[name] = True
                    logger.info(f"✅ {name} is reachable")
                else:
                    results[name] = False
                    logger.warning(f"⚠️ {name} returned HTTP {response.status_code}")
                    
            except Exception as e:
                results[name] = False
                logger.warning(f"⚠️ {name} check failed: {e}")
    
    return results


async def main():
    """Main health check function"""
    logger.info("🔍 Starting comprehensive health check...")
    
    # Check application health
    app_healthy = await check_health()
    
    # Check database
    db_healthy = await check_database()
    
    # Check external APIs
    api_results = await check_apis()
    
    # Summary
    logger.info("📊 Health Check Summary:")
    logger.info(f"   Application: {'✅' if app_healthy else '❌'}")
    logger.info(f"   Database: {'✅' if db_healthy else '❌'}")
    
    for api_name, status in api_results.items():
        logger.info(f"   {api_name}: {'✅' if status else '⚠️'}")
    
    # Exit code for Docker health check
    if app_healthy and db_healthy:
        logger.info("🎉 Overall health: HEALTHY")
        sys.exit(0)
    else:
        logger.error("💥 Overall health: UNHEALTHY")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())