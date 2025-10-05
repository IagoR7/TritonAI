from pydantic import BaseModel

class HotspotBase(BaseModel):
    lat: float
    lng: float
    probabilidade: float
    especie: str
    
class HotspotOut(HotspotBase):
    id: int
    #converter direto
    class config:
        orm_mode = True