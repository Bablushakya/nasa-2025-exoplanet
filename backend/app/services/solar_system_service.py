"""
Solar System Service - Orbital calculations and data management
"""

import json
import math
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from app.schemas.solar_system import (
    Planet, Sun, SolarSystemResponse, PlanetWithPosition, 
    Position3D, PlanetPositionsResponse, OrbitPath, 
    OrbitPathPoint, OrbitPathsResponse, SimulationFrame,
    SimulationResponse, SimulationRequest
)


class SolarSystemService:
    """Service for solar system data and calculations"""
    
    def __init__(self):
        self.data_file = Path("data/solar_system_data.json")
        self._data = None
        self._load_data()
    
    def _load_data(self):
        """Load solar system data from JSON file"""
        try:
            with open(self.data_file, 'r') as f:
                self._data = json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Solar system data file not found: {self.data_file}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in solar system data file: {e}")
    
    def get_solar_system(self) -> SolarSystemResponse:
        """Get complete solar system data"""
        planets = [Planet(**planet_data) for planet_data in self._data["planets"]]
        sun = Sun(**self._data["sun"])
        
        return SolarSystemResponse(
            planets=planets,
            sun=sun,
            scale_info=self._data["scale_info"]
        )
    
    def get_planet(self, planet_id: str) -> Optional[Planet]:
        """Get specific planet by ID"""
        for planet_data in self._data["planets"]:
            if planet_data["id"] == planet_id:
                return Planet(**planet_data)
        return None
    
    def get_sun(self) -> Sun:
        """Get sun information"""
        return Sun(**self._data["sun"])
    
    def calculate_julian_date(self, timestamp: Optional[float] = None) -> float:
        """Calculate Julian date from Unix timestamp"""
        if timestamp is None:
            timestamp = time.time()
        
        # Convert to Julian date
        # Julian date epoch: January 1, 4713 BCE
        # Unix epoch: January 1, 1970 CE
        # Difference: 2440587.5 days
        julian_date = (timestamp / 86400.0) + 2440587.5
        return julian_date
    
    def calculate_orbital_position(self, planet: Planet, julian_date: float) -> Position3D:
        """Calculate planet's 3D position at given Julian date"""
        # Simplified orbital mechanics calculation
        # For more accuracy, would need full orbital elements and perturbations
        
        # Days since J2000.0 epoch (January 1, 2000, 12:00 TT)
        j2000 = 2451545.0
        days_since_j2000 = julian_date - j2000
        
        # Mean anomaly (angle from periapsis)
        mean_motion = 2 * math.pi / planet.orbital_period_days  # radians per day
        mean_anomaly = mean_motion * days_since_j2000
        
        # Eccentric anomaly (Kepler's equation - simplified)
        eccentric_anomaly = mean_anomaly + planet.eccentricity * math.sin(mean_anomaly)
        
        # True anomaly
        true_anomaly = 2 * math.atan2(
            math.sqrt(1 + planet.eccentricity) * math.sin(eccentric_anomaly / 2),
            math.sqrt(1 - planet.eccentricity) * math.cos(eccentric_anomaly / 2)
        )
        
        # Distance from sun
        distance = planet.semi_major_axis_km * (1 - planet.eccentricity * math.cos(eccentric_anomaly))
        
        # Position in orbital plane
        x_orbital = distance * math.cos(true_anomaly)
        y_orbital = distance * math.sin(true_anomaly)
        
        # Apply inclination (simplified - assumes ascending node at 0°)
        inclination_rad = math.radians(planet.inclination_deg)
        
        x = x_orbital
        y = y_orbital * math.cos(inclination_rad)
        z = y_orbital * math.sin(inclination_rad)
        
        return Position3D(x=x, y=y, z=z)
    
    def calculate_orbital_velocity(self, planet: Planet, distance_km: float) -> float:
        """Calculate orbital velocity at given distance"""
        # Simplified calculation using vis-viva equation
        # v = sqrt(GM * (2/r - 1/a))
        # Using GM_sun = 1.327e20 m³/s²
        
        GM_sun = 1.327e20  # m³/s²
        r = distance_km * 1000  # convert to meters
        a = planet.semi_major_axis_km * 1000  # convert to meters
        
        velocity_ms = math.sqrt(GM_sun * (2/r - 1/a))
        velocity_kms = velocity_ms / 1000  # convert to km/s
        
        return velocity_kms
    
    def get_planet_positions(self, timestamp: Optional[float] = None) -> PlanetPositionsResponse:
        """Get current positions of all planets"""
        if timestamp is None:
            timestamp = time.time()
        
        julian_date = self.calculate_julian_date(timestamp)
        planets_with_positions = []
        
        for planet_data in self._data["planets"]:
            planet = Planet(**planet_data)
            position = self.calculate_orbital_position(planet, julian_date)
            
            # Calculate distance from sun
            distance_from_sun = math.sqrt(position.x**2 + position.y**2 + position.z**2)
            
            # Calculate orbital velocity
            velocity = self.calculate_orbital_velocity(planet, distance_from_sun)
            
            planet_with_position = PlanetWithPosition(
                **planet.dict(),
                position=position,
                distance_from_sun_km=distance_from_sun,
                velocity_kms=velocity
            )
            planets_with_positions.append(planet_with_position)
        
        return PlanetPositionsResponse(
            planets=planets_with_positions,
            timestamp=timestamp,
            julian_date=julian_date
        )
    
    def generate_orbit_paths(self, resolution: int = 360) -> OrbitPathsResponse:
        """Generate orbital paths for all planets"""
        orbits = []
        
        for planet_data in self._data["planets"]:
            planet = Planet(**planet_data)
            points = []
            
            # Generate points around the orbit
            for i in range(resolution):
                angle_deg = (360.0 / resolution) * i
                angle_rad = math.radians(angle_deg)
                
                # Calculate position at this angle
                # Simplified: circular orbit approximation
                distance = planet.semi_major_axis_km
                
                x = distance * math.cos(angle_rad)
                y = distance * math.sin(angle_rad) * math.cos(math.radians(planet.inclination_deg))
                z = distance * math.sin(angle_rad) * math.sin(math.radians(planet.inclination_deg))
                
                point = OrbitPathPoint(
                    angle_deg=angle_deg,
                    position=Position3D(x=x, y=y, z=z)
                )
                points.append(point)
            
            orbit = OrbitPath(
                planet_id=planet.id,
                planet_name=planet.name,
                points=points,
                color=planet.hex_color
            )
            orbits.append(orbit)
        
        return OrbitPathsResponse(
            orbits=orbits,
            resolution=resolution
        )
    
    def simulate_positions(self, request: SimulationRequest) -> SimulationResponse:
        """Simulate planet positions over time"""
        # Default to 1 year simulation if not specified
        if request.start_date is None:
            request.start_date = self.calculate_julian_date()
        
        if request.end_date is None:
            request.end_date = request.start_date + 365.25  # 1 year
        
        frames = []
        current_date = request.start_date
        
        while current_date <= request.end_date:
            # Calculate positions for all planets (or specified ones)
            planets_with_positions = []
            
            planet_ids = request.planet_ids or [p["id"] for p in self._data["planets"]]
            
            for planet_data in self._data["planets"]:
                if planet_data["id"] in planet_ids:
                    planet = Planet(**planet_data)
                    position = self.calculate_orbital_position(planet, current_date)
                    
                    distance_from_sun = math.sqrt(position.x**2 + position.y**2 + position.z**2)
                    velocity = self.calculate_orbital_velocity(planet, distance_from_sun)
                    
                    planet_with_position = PlanetWithPosition(
                        **planet.dict(),
                        position=position,
                        distance_from_sun_km=distance_from_sun,
                        velocity_kms=velocity
                    )
                    planets_with_positions.append(planet_with_position)
            
            frame = SimulationFrame(
                julian_date=current_date,
                timestamp=(current_date - 2440587.5) * 86400.0,  # Convert back to Unix timestamp
                planets=planets_with_positions
            )
            frames.append(frame)
            
            current_date += request.time_step_days
        
        return SimulationResponse(
            frames=frames,
            start_date=request.start_date,
            end_date=request.end_date,
            time_step_days=request.time_step_days,
            total_frames=len(frames)
        )


# Global service instance
solar_system_service = SolarSystemService()