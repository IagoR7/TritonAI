from sqlalchemy import Column, Integer, Float, String
from GIBS.core.database import Base

class Hotspot(Base):
    __tablename__ = "hotspots"
    
    id = Column(Integer, primary_key=True, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    probabilidade = Column(Float, nullable=False)
    especie = Column(String, nullable=False)
    
    
    
    