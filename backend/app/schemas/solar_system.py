"""
Solar System Pydantic Schemas
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class PlanetType(str, Enum):
    """Planet type classification"""
    TERRESTRIAL = "terrestrial"
    GAS_GIANT = "gas_giant"
    ICE_GIANT = "ice_giant"
    DWARF_PLANET = "dwarf_planet"


class Position3D(BaseModel):
    """3D position coordinates"""
    x: float = Field(..., description="X coordinate in km")
    y: float = Field(..., description="Y coordinate in km")
    z: float = Field(..., description="Z coordinate in km")


class OrbitalElements(BaseModel):
    """Orbital elements for position calculation"""
    semi_major_axis_km: float = Field(..., description="Semi-major axis in km")
    eccentricity: float = Field(..., description="Orbital eccentricity")
    inclination_deg: float = Field(..., description="Orbital inclination in degrees")
    orbital_period_days: float = Field(..., description="Orbital period in days")


class Planet(BaseModel):
    """Planet information"""
    id: str = Field(..., description="Unique planet identifier")
    name: str = Field(..., description="Planet name")
    type: PlanetType = Field(..., description="Planet type")
    order: int = Field(..., description="Order from the Sun")
    
    # Physical characteristics
    radius_km: float = Field(..., description="Radius in kilometers")
    mass_kg: float = Field(..., description="Mass in kilograms")
    surface_temp_k: float = Field(..., description="Surface temperature in Kelvin")
    surface_gravity_ms2: float = Field(..., description="Surface gravity in m/s²")
    escape_velocity_kms: float = Field(..., description="Escape velocity in km/s")
    
    # Orbital characteristics
    orbital_period_days: float = Field(..., description="Orbital period in days")
    rotation_period_hours: float = Field(..., description="Rotation period in hours")
    semi_major_axis_km: float = Field(..., description="Semi-major axis in km")
    semi_major_axis_au: float = Field(..., description="Semi-major axis in AU")
    eccentricity: float = Field(..., description="Orbital eccentricity")
    inclination_deg: float = Field(..., description="Orbital inclination in degrees")
    
    # Additional info
    moons: int = Field(..., description="Number of moons")
    has_rings: bool = Field(..., description="Whether planet has rings")
    color: str = Field(..., description="Visual color")
    hex_color: str = Field(..., description="Hex color code")
    description: str = Field(..., description="Planet description")
    interesting_facts: List[str] = Field(..., description="Interesting facts")


class PlanetWithPosition(Planet):
    """Planet with current position"""
    position: Position3D = Field(..., description="Current 3D position")
    distance_from_sun_km: float = Field(..., description="Current distance from Sun")
    velocity_kms: float = Field(..., description="Current orbital velocity")


class Sun(BaseModel):
    """Sun information"""
    id: str = Field(..., description="Identifier")
    name: str = Field(..., description="Name")
    type: str = Field(..., description="Object type")
    radius_km: float = Field(..., description="Radius in kilometers")
    mass_kg: float = Field(..., description="Mass in kilograms")
    surface_temp_k: float = Field(..., description="Surface temperature in Kelvin")
    core_temp_k: float = Field(..., description="Core temperature in Kelvin")
    age_years: float = Field(..., description="Age in years")
    color: str = Field(..., description="Visual color")
    hex_color: str = Field(..., description="Hex color code")
    description: str = Field(..., description="Description")
    interesting_facts: List[str] = Field(..., description="Interesting facts")


class SolarSystemResponse(BaseModel):
    """Solar system complete response"""
    planets: List[Planet] = Field(..., description="List of planets")
    sun: Sun = Field(..., description="Sun information")
    scale_info: Dict[str, Any] = Field(..., description="Scale information")


class PlanetPositionsResponse(BaseModel):
    """Planets with positions response"""
    planets: List[PlanetWithPosition] = Field(..., description="Planets with positions")
    timestamp: float = Field(..., description="Calculation timestamp")
    julian_date: float = Field(..., description="Julian date")


class OrbitPathPoint(BaseModel):
    """Single point on orbital path"""
    angle_deg: float = Field(..., description="Angle in degrees")
    position: Position3D = Field(..., description="3D position")


class OrbitPath(BaseModel):
    """Complete orbital path"""
    planet_id: str = Field(..., description="Planet identifier")
    planet_name: str = Field(..., description="Planet name")
    points: List[OrbitPathPoint] = Field(..., description="Path points")
    color: str = Field(..., description="Orbit color")


class OrbitPathsResponse(BaseModel):
    """All orbital paths response"""
    orbits: List[OrbitPath] = Field(..., description="Orbital paths")
    resolution: int = Field(..., description="Number of points per orbit")


class SimulationRequest(BaseModel):
    """Simulation request parameters"""
    start_date: Optional[float] = Field(None, description="Start Julian date")
    end_date: Optional[float] = Field(None, description="End Julian date")
    time_step_days: float = Field(1.0, description="Time step in days")
    planet_ids: Optional[List[str]] = Field(None, description="Specific planets to simulate")


class SimulationFrame(BaseModel):
    """Single frame of simulation"""
    julian_date: float = Field(..., description="Julian date")
    timestamp: float = Field(..., description="Unix timestamp")
    planets: List[PlanetWithPosition] = Field(..., description="Planet positions")


class SimulationResponse(BaseModel):
    """Simulation response"""
    frames: List[SimulationFrame] = Field(..., description="Simulation frames")
    start_date: float = Field(..., description="Start Julian date")
    end_date: float = Field(..., description="End Julian date")
    time_step_days: float = Field(..., description="Time step")
    total_frames: int = Field(..., description="Total number of frames")
