from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from GIBS.core.database import get_db
from GIBS.models.hotspot import Hotspot
from GIBS.schemas.hotspot_schema import HotspotOut

router = APIRouter(prefix="/hotspots", tags=["Hotspots"])

@router.get("/", response_model=List[HotspotOut])

def get_hotspots(db: Session = Depends(get_db)):
    return db.query(Hotspot).all()
        
        