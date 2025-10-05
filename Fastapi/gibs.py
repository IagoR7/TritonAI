from fastapi import FastAPI
from GIBS.routers import hotspot_router
from GIBS.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GIBS API")

app.include_router(hotspot_router.router)

@app.get("/")

def root():
    return {"Mensagem": "Api rodando Vá em /docs para ver a documentação."}
