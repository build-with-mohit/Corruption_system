from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import Base, engine
from app.routers import auth, complaints, users
from app.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

# Create uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="CivicLedger API",
    description="Anti-Corruption Reporting and Complaint Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(complaints.router)
app.include_router(users.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "CivicLedger API"}
