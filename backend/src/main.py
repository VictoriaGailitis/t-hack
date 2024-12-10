
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .budgets.router import budget_router
from .database import Base, engine
from dotenv import load_dotenv

load_dotenv()

#* Инициализация базы данных
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Budget API",
    version="1.0.0",
    description="API для работы с бюджетами",
    root_path="/api"
)

origins = os.getenv("ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#* ROUTERS
app.include_router(budget_router)
