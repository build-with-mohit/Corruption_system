import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, complaints, users
from app.config import settings

# Create tables on startup (safe for PostgreSQL – only creates if not exists)
Base.metadata.create_all(bind=engine)

# Only create uploads directory in non-serverless environments
if not os.environ.get("VERCEL"):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="CivicLedger API",
    description="Anti-Corruption Reporting and Complaint Management System",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# In production on Vercel, frontend + API share the same origin so CORS isn't
# strictly required, but we allow the common dev origins too.
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

# Accept the deployed Vercel domain(s) – set ALLOWED_ORIGINS env var as a
# comma-separated list if you need to whitelist additional origins.
extra = os.environ.get("ALLOWED_ORIGINS", "")
if extra:
    allowed_origins.extend([o.strip() for o in extra.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
