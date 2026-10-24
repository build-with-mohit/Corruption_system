from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

def create_db_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite"):
        return create_engine(db_url, connect_args={"check_same_thread": False})

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
