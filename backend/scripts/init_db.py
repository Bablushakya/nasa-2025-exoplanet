"""
Database initialization script
"""

import asyncio
import json
from pathlib import Path
import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.database import init_db, AsyncSessionLocal
from app.models.exoplanet import Exoplanet
from app.models.user import User  # Import to ensure tables are created
from app.core.config import settings

async def init_sample_data():
    """Initialize database with sample exoplanet data"""
    
    # Sample exoplanet data
    sample_exoplanets = [
        {
            "name": "Kepler-452b",
            "host_star": "Kepler-452",
            "discovery_year": 2015,
            "mission": "Kepler",
            "orbital_period": 384.8,
            "transit_duration": 10.9,
            "planetary_radius": 1.63,
            "transit_depth": 0.0087,
            "stellar_magnitude": 13.426,
            "equilibrium_temperature": 265,
            "distance": 1402,
            "planet_type": "Super Earth",
            "habitable_zone": True,
            "confirmed": True
        },
        {
            "name": "Kepler-186f",
            "host_star": "Kepler-186",
            "discovery_year": 2014,
            "mission": "Kepler",
            "orbital_period": 129.9,
            "transit_duration": 4.2,
            "planetary_radius": 1.11,
            "transit_depth": 0.0034,
            "stellar_magnitude": 14.24,
            "equilibrium_temperature": 188,
            "distance": 582,
            "planet_type": "Rocky",
            "habitable_zone": True,
            "confirmed": True
        },
        {
            "name": "TRAPPIST-1e",
            "host_star": "TRAPPIST-1",
            "discovery_year": 2017,
            "mission": "TESS",
            "orbital_period": 6.1,
            "transit_duration": 0.8,
            "planetary_radius": 0.92,
            "transit_depth": 0.0067,
            "stellar_magnitude": 18.8,
            "equilibrium_temperature": 251,
            "distance": 40,
            "planet_type": "Rocky",
            "habitable_zone": True,
            "confirmed": True
        },
        {
            "name": "HD 209458b",
            "host_star": "HD 209458",
            "discovery_year": 1999,
            "mission": "Ground-based",
            "orbital_period": 3.5,
            "transit_duration": 3.1,
            "planetary_radius": 1.38,
            "transit_depth": 0.015,
            "stellar_magnitude": 7.65,
            "equilibrium_temperature": 1130,
            "distance": 159,
            "planet_type": "Hot Jupiter",
            "habitable_zone": False,
            "confirmed": True
        },
        {
            "name": "Proxima Centauri b",
            "host_star": "Proxima Centauri",
            "discovery_year": 2016,
            "mission": "Ground-based",
            "orbital_period": 11.2,
            "transit_duration": 1.3,
            "planetary_radius": 1.17,
            "transit_depth": 0.0001,
            "stellar_magnitude": 11.13,
            "equilibrium_temperature": 234,
            "distance": 4.24,
            "planet_type": "Rocky",
            "habitable_zone": True,
            "confirmed": True
        }
    ]
    
    async with AsyncSessionLocal() as session:
        try:
            # Check if data already exists
            from sqlalchemy import select, func
            result = await session.execute(select(func.count(Exoplanet.id)))
            count = result.scalar()
            
            if count > 0:
                print(f"Database already contains {count} exoplanets. Skipping initialization.")
                return
            
            # Add sample exoplanets
            for exo_data in sample_exoplanets:
                exoplanet = Exoplanet(**exo_data)
                session.add(exoplanet)
            
            await session.commit()
            print(f"Successfully added {len(sample_exoplanets)} sample exoplanets to the database.")
            
        except Exception as e:
            await session.rollback()
            print(f"Error initializing sample data: {e}")
            raise


async def main():
    """Main initialization function"""
    print("Initializing ExoPlanet AI database...")
    
    try:
        # Initialize database tables
        await init_db()
        print("Database tables created successfully.")
        
        # Add sample data
        await init_sample_data()
        
        print("Database initialization completed successfully!")
        
    except Exception as e:
        print(f"Database initialization failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())