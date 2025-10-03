"""
Exoplanet CRUD endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import logging

from app.core.database import get_db
from app.schemas.exoplanet import (
    ExoplanetCreate, ExoplanetUpdate, ExoplanetResponse, 
    ExoplanetFilter, ExoplanetListResponse, Mission, PlanetType
)
from app.services.exoplanet_service import ExoplanetService
from app.core.exceptions import NotFoundError, ValidationError

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=ExoplanetListResponse)
async def get_exoplanets(
    # Search parameters
    search: Optional[str] = Query(None, description="Search by name, host star, or planet type"),
    
    # Filter parameters
    missions: Optional[List[Mission]] = Query(None, description="Filter by space missions"),
    year_min: Optional[int] = Query(None, ge=1995, le=2030, description="Minimum discovery year"),
    year_max: Optional[int] = Query(None, ge=1995, le=2030, description="Maximum discovery year"),
    planet_types: Optional[List[PlanetType]] = Query(None, description="Filter by planet types"),
    period_min: Optional[float] = Query(None, ge=0, description="Minimum orbital period (days)"),
    period_max: Optional[float] = Query(None, ge=0, description="Maximum orbital period (days)"),
    radius_min: Optional[float] = Query(None, ge=0, description="Minimum planetary radius (Earth radii)"),
    radius_max: Optional[float] = Query(None, ge=0, description="Maximum planetary radius (Earth radii)"),
    distance_min: Optional[float] = Query(None, ge=0, description="Minimum distance (light years)"),
    distance_max: Optional[float] = Query(None, ge=0, description="Maximum distance (light years)"),
    habitable_zone: Optional[bool] = Query(None, description="Filter by habitable zone"),
    confirmed_only: Optional[bool] = Query(None, description="Show only confirmed exoplanets"),
    
    # Pagination parameters
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    
    # Sorting parameters
    sort_by: str = Query("name", description="Sort field (name, discovery_year, distance, orbital_period, planetary_radius)"),
    sort_order: str = Query("asc", description="Sort order (asc, desc)"),
    
    db: AsyncSession = Depends(get_db)
):
    """
    Get a list of exoplanets with filtering, sorting, and pagination
    
    This endpoint provides comprehensive access to the exoplanet database with advanced filtering capabilities.
    
    **Filtering Options:**
    - Search by name, host star, or planet type
    - Filter by discovery mission (Kepler, K2, TESS, Ground-based)
    - Filter by discovery year range
    - Filter by planet type (Rocky, Gas Giant, Super Earth, etc.)
    - Filter by orbital period range
    - Filter by planetary radius range
    - Filter by distance from Earth
    - Filter by habitable zone status
    - Show only confirmed exoplanets
    
    **Sorting Options:**
    - Sort by name, discovery year, distance, orbital period, or planetary radius
    - Ascending or descending order
    
    **Pagination:**
    - Page-based pagination with configurable page size (max 100 items per page)
    
    **Returns:**
    - List of exoplanets matching the criteria
    - Pagination metadata (total count, pages, etc.)
    """
    try:
        # Create filter object
        filters = ExoplanetFilter(
            search=search,
            missions=missions or [],
            year_min=year_min,
            year_max=year_max,
            planet_types=planet_types or [],
            period_min=period_min,
            period_max=period_max,
            radius_min=radius_min,
            radius_max=radius_max,
            distance_min=distance_min,
            distance_max=distance_max,
            habitable_zone=habitable_zone,
            confirmed_only=confirmed_only,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        # Get exoplanets
        exoplanets, pagination = await ExoplanetService.get_exoplanets(db, filters)
        
        return ExoplanetListResponse(
            success=True,
            data=[ExoplanetResponse.from_orm(exo) for exo in exoplanets],
            pagination=pagination,
            message=f"Retrieved {len(exoplanets)} exoplanets"
        )
        
    except ValidationError as e:
        logger.error(f"Validation error in get_exoplanets: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {e.message}"
        )
    except Exception as e:
        logger.error(f"Error retrieving exoplanets: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving exoplanets"
        )


@router.get("/{exoplanet_id}", response_model=ExoplanetResponse)
async def get_exoplanet(
    exoplanet_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific exoplanet by ID
    
    **Parameters:**
    - exoplanet_id: Unique identifier for the exoplanet
    
    **Returns:**
    - Complete exoplanet information including all physical and orbital characteristics
    """
    try:
        exoplanet = await ExoplanetService.get_exoplanet(db, exoplanet_id)
        
        if not exoplanet:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Exoplanet with ID {exoplanet_id} not found"
            )
        
        return ExoplanetResponse.from_orm(exoplanet)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving exoplanet {exoplanet_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the exoplanet"
        )


@router.post("/", response_model=ExoplanetResponse, status_code=status.HTTP_201_CREATED)
async def create_exoplanet(
    exoplanet_data: ExoplanetCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new exoplanet entry
    
    **Required Fields:**
    - name: Unique name for the exoplanet
    - host_star: Name of the host star
    
    **Optional Fields:**
    - All other physical and orbital characteristics
    - Discovery information (year, mission)
    - Classification data (planet type, habitable zone, confirmed status)
    
    **Returns:**
    - The created exoplanet with assigned ID and timestamps
    """
    try:
        exoplanet = await ExoplanetService.create_exoplanet(db, exoplanet_data)
        return ExoplanetResponse.from_orm(exoplanet)
        
    except ValidationError as e:
        logger.error(f"Validation error creating exoplanet: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {e.message}"
        )
    except Exception as e:
        logger.error(f"Error creating exoplanet: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the exoplanet"
        )


@router.put("/{exoplanet_id}", response_model=ExoplanetResponse)
async def update_exoplanet(
    exoplanet_id: int,
    exoplanet_data: ExoplanetUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Update an existing exoplanet
    
    **Parameters:**
    - exoplanet_id: ID of the exoplanet to update
    - exoplanet_data: Fields to update (only provided fields will be updated)
    
    **Returns:**
    - The updated exoplanet information
    """
    try:
        exoplanet = await ExoplanetService.update_exoplanet(db, exoplanet_id, exoplanet_data)
        return ExoplanetResponse.from_orm(exoplanet)
        
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.message
        )
    except ValidationError as e:
        logger.error(f"Validation error updating exoplanet: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {e.message}"
        )
    except Exception as e:
        logger.error(f"Error updating exoplanet {exoplanet_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the exoplanet"
        )


@router.delete("/{exoplanet_id}")
async def delete_exoplanet(
    exoplanet_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete an exoplanet
    
    **Parameters:**
    - exoplanet_id: ID of the exoplanet to delete
    
    **Returns:**
    - Confirmation of deletion
    """
    try:
        await ExoplanetService.delete_exoplanet(db, exoplanet_id)
        
        return {
            "success": True,
            "message": f"Exoplanet {exoplanet_id} deleted successfully"
        }
        
    except NotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.message
        )
    except Exception as e:
        logger.error(f"Error deleting exoplanet {exoplanet_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the exoplanet"
        )


@router.get("/stats/overview")
async def get_exoplanet_statistics(db: AsyncSession = Depends(get_db)):
    """
    Get comprehensive exoplanet database statistics
    
    **Returns:**
    - Total counts and breakdowns
    - Mission statistics
    - Planet type distribution
    - Recent activity metrics
    """
    try:
        stats = await ExoplanetService.get_statistics(db)
        
        return {
            "success": True,
            "data": stats,
            "message": "Statistics retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving statistics"
        )