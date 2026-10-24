from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app import models, schemas, auth
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=schemas.Token, status_code=201)
def register_citizen(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = auth.get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_pw,
        phone=user_data.phone,
        role=models.UserRole.citizen,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = auth.create_access_token(
        data={"sub": str(new_user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer", "user": new_user}


@router.post("/register-admin", response_model=schemas.Token, status_code=201)
def register_admin(user_data: schemas.AdminCreate, db: Session = Depends(get_db)):
    if user_data.admin_secret != settings.ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin secret key")

    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = auth.get_password_hash(user_data.password)
    new_admin = models.User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_pw,
        phone=user_data.phone,
        role=models.UserRole.admin,
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    token = auth.create_access_token(
        data={"sub": str(new_admin.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer", "user": new_admin}


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    token = auth.create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
