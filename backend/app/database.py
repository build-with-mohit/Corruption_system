import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings


def create_db_engine():
    db_url = settings.DATABASE_URL

    # On Vercel (production), always require a real PostgreSQL URL
    if os.environ.get("VERCEL"):
        if not db_url or db_url.startswith("sqlite"):
            raise RuntimeError(
                "DATABASE_URL must point to a PostgreSQL database in production. "
                "Set it in Vercel environment variables."
            )
        # Vercel / Neon / Supabase often provide postgres:// which SQLAlchemy 2.x
        # requires as postgresql://
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        return create_engine(db_url, pool_pre_ping=True, pool_recycle=300)

    # ── Local development ────────────────────────────────────────────────────
    if db_url.startswith("sqlite"):
        return create_engine(db_url, connect_args={"check_same_thread": False})

    # Fix postgres:// → postgresql:// for local dev too
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    try:
        test_engine = create_engine(db_url, connect_args={"connect_timeout": 2})
        with test_engine.connect():
            pass
        return test_engine
    except Exception as e:
        print(f"\n[CivicLedger] Note: PostgreSQL at '{db_url}' is not currently reachable.")
        print("[CivicLedger] Initializing local database 'sqlite:///./civicledger.db' for instant development and testing.")
        print("[CivicLedger] To use PostgreSQL instead, ensure Postgres service is running and configured in .env.\n")
        return create_engine("sqlite:///./civicledger.db", connect_args={"check_same_thread": False})


engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
