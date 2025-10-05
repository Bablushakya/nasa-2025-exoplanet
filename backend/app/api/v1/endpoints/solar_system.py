"""
Solar System API Endpoints
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
import time

from app.schemas.solar_system import (
    SolarSystemResponse, Planet, Sun, PlanetPositionsResponse,
    OrbitPathsResponse, SimulationRequest, SimulationResponse
)
from app.services.solar_system_service import solar_system_service

router = APIRouter()


@router.get("/", response_model=SolarSystemResponse)
async def get_solar_system():
    """
    Get complete solar system data including all planets and the Sun
    """
    try:
        return solar_system_service.get_solar_system()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get solar system data: {str(e)}")


@router.get("/planets", response_model=List[Planet])
async def get_all_planets():
    """
    Get list of all planets
    """
    try:
        solar_system = solar_system_service.get_solar_system()
        return solar_system.planets
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get planets: {str(e)}")


@router.get("/planets/{planet_id}", response_model=Planet)
async def get_planet(planet_id: str):
    """
    Get specific planet by ID
    
    - **planet_id**: Planet identifier (mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto)
    """
    try:
        planet = solar_system_service.get_planet(planet_id.lower())
        if not planet:
            raise HTTPException(status_code=404, detail=f"Planet '{planet_id}' not found")
        return planet
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get planet: {str(e)}")


@router.get("/sun", response_model=Sun)
async def get_sun():
    """
    Get Sun information
    """
    try:
        return solar_system_service.get_sun()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sun data: {str(e)}")


@router.get("/positions", response_model=PlanetPositionsResponse)
async def get_planet_positions(
    timestamp: Optional[float] = Query(None, description="Unix timestamp (default: current time)")
):
    """
    Get current 3D positions of all planets
    
    - **timestamp**: Unix timestamp for position calculation (optional, defaults to current time)
    """
    try:
        return solar_system_service.get_planet_positions(timestamp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate positions: {str(e)}")


@router.get("/positions/{planet_id}")
async def get_planet_position(
    planet_id: str,
    timestamp: Optional[float] = Query(None, description="Unix timestamp (default: current time)")
):
    """
    Get current 3D position of specific planet
    
    - **planet_id**: Planet identifier
    - **timestamp**: Unix timestamp for position calculation (optional)
    """
    try:
        positions_response = solar_system_service.get_planet_positions(timestamp)
        
        for planet in positions_response.planets:
            if planet.id == planet_id.lower():
                return {
                    "planet": planet.name,
                    "position": planet.position,
                    "distance_from_sun_km": planet.distance_from_sun_km,
                    "velocity_kms": planet.velocity_kms,
                    "timestamp": positions_response.timestamp,
                    "julian_date": positions_response.julian_date
                }
        
        raise HTTPException(status_code=404, detail=f"Planet '{planet_id}' not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get planet position: {str(e)}")


@router.get("/orbits", response_model=OrbitPathsResponse)
async def get_orbit_paths(
    resolution: int = Query(360, description="Number of points per orbit (default: 360)", ge=36, le=1440)
):
    """
    Get orbital paths for all planets
    
    - **resolution**: Number of points per orbit (36-1440, default: 360)
    """
    try:
        return solar_system_service.generate_orbit_paths(resolution)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate orbit paths: {str(e)}")


@router.get("/orbits/{planet_id}")
async def get_planet_orbit(
    planet_id: str,
    resolution: int = Query(360, description="Number of points per orbit", ge=36, le=1440)
):
    """
    Get orbital path for specific planet
    
    - **planet_id**: Planet identifier
    - **resolution**: Number of points per orbit (36-1440, default: 360)
    """
    try:
        orbit_paths = solar_system_service.generate_orbit_paths(resolution)
        
        for orbit in orbit_paths.orbits:
            if orbit.planet_id == planet_id.lower():
                return orbit
        
        raise HTTPException(status_code=404, detail=f"Planet '{planet_id}' not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get planet orbit: {str(e)}")


@router.post("/simulate", response_model=SimulationResponse)
async def simulate_solar_system(request: SimulationRequest):
    """
    Simulate solar system positions over time
    
    - **start_date**: Start Julian date (optional, defaults to current time)
    - **end_date**: End Julian date (optional, defaults to start + 1 year)
    - **time_step_days**: Time step in days (default: 1.0)
    - **planet_ids**: List of planet IDs to include (optional, defaults to all)
    """
    try:
        # Validate time range
        if request.start_date and request.end_date:
            if request.end_date <= request.start_date:
                raise HTTPException(status_code=400, detail="End date must be after start date")
            
            time_range = request.end_date - request.start_date
            if time_range > 36525:  # 100 years
                raise HTTPException(status_code=400, detail="Time range cannot exceed 100 years")
        
        # Validate time step
        if request.time_step_days <= 0:
            raise HTTPException(status_code=400, detail="Time step must be positive")
        
        if request.time_step_days > 365:
            raise HTTPException(status_code=400, detail="Time step cannot exceed 365 days")
        
        return solar_system_service.simulate_positions(request)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


@router.get("/scale")
async def get_scale_info():
    """
    Get scale information for visualization
    """
    try:
        solar_system = solar_system_service.get_solar_system()
        return {
            "success": True,
            "data": solar_system.scale_info,
            "message": "Scale information retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get scale info: {str(e)}")


@router.get("/stats")
async def get_solar_system_stats():
    """
    Get solar system statistics
    """
    try:
        solar_system = solar_system_service.get_solar_system()
        
        # Calculate statistics
        total_planets = len(solar_system.planets)
        terrestrial_planets = len([p for p in solar_system.planets if p.type == "terrestrial"])
        gas_giants = len([p for p in solar_system.planets if p.type == "gas_giant"])
        ice_giants = len([p for p in solar_system.planets if p.type == "ice_giant"])
        dwarf_planets = len([p for p in solar_system.planets if p.type == "dwarf_planet"])
        
        total_moons = sum(p.moons for p in solar_system.planets)
        planets_with_rings = len([p for p in solar_system.planets if p.has_rings])
        
        # Find extremes
        largest_planet = max(solar_system.planets, key=lambda p: p.radius_km)
        smallest_planet = min(solar_system.planets, key=lambda p: p.radius_km)
        hottest_planet = max(solar_system.planets, key=lambda p: p.surface_temp_k)
        coldest_planet = min(solar_system.planets, key=lambda p: p.surface_temp_k)
        
        return {
            "success": True,
            "data": {
                "total_planets": total_planets,
                "planet_types": {
                    "terrestrial": terrestrial_planets,
                    "gas_giant": gas_giants,
                    "ice_giant": ice_giants,
                    "dwarf_planet": dwarf_planets
                },
                "total_moons": total_moons,
                "planets_with_rings": planets_with_rings,
                "extremes": {
                    "largest_planet": {"name": largest_planet.name, "radius_km": largest_planet.radius_km},
                    "smallest_planet": {"name": smallest_planet.name, "radius_km": smallest_planet.radius_km},
                    "hottest_planet": {"name": hottest_planet.name, "surface_temp_k": hottest_planet.surface_temp_k},
                    "coldest_planet": {"name": coldest_planet.name, "surface_temp_k": coldest_planet.surface_temp_k}
                }
            },
            "message": "Solar system statistics calculated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate stats: {str(e)}")