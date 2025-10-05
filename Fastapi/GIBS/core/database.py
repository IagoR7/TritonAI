from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#conexão do banco
DataBase_URL = "postgresql://triton_db_pcl9_user:K5fVTf2EPfprILPhMKvLMbYxIzbYext2@dpg-d34mseqdbo4c73fj6nv0-a.oregon-postgres.render.com/triton_db_pcl9"
engine = create_engine(DataBase_URL)

SessionLocal  = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#base do banco de dados
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

