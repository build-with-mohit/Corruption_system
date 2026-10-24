from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/officers", response_model=List[schemas.OfficerOut])
def list_officers(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    return db.query(models.User).filter(models.User.role == models.UserRole.admin).all()
