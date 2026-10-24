import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/corruption_db"
    SECRET_KEY: str = "your-super-secret-key-change-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    UPLOAD_DIR: str = "/tmp/uploads" if os.environ.get("VERCEL") else "uploads"
    MAX_UPLOAD_SIZE: int = 52428800  # 50 MB
    ADMIN_SECRET_KEY: str = "admin-registration-secret-key-2024"

    class Config:
        env_file = ".env"


settings = Settings()
