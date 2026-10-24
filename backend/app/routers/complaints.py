import os
import uuid
import json
from typing import Optional, List
from fastapi import (
    APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime

from app.database import get_db
from app import models, schemas, auth
from app.config import settings

router = APIRouter(prefix="/api/complaints", tags=["complaints"])

ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/mpeg", "video/quicktime",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def save_upload_file(file: UploadFile, complaint_uuid: str) -> tuple[str, str, str, int]:
    upload_dir = os.path.join(settings.UPLOAD_DIR, complaint_uuid)
    os.makedirs(upload_dir, exist_ok=True)

    ext = os.path.splitext(file.filename)[1]
    stored_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(upload_dir, stored_name)

    content = file.file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large: {file.filename}")

    with open(file_path, "wb") as f:
        f.write(content)

    return file.filename, stored_name, file.content_type or "application/octet-stream", len(content)


# ─── Citizen Routes ──────────────────────────────────────────────────────────

@router.post("/", response_model=schemas.ComplaintOut, status_code=201)
async def create_complaint(
    category: str = Form(...),
    department: str = Form(...),
    incident_location: str = Form(...),
    incident_date: str = Form(...),
    description: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_citizen),
):
    try:
        cat = models.ComplaintCategory(category)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid category")

    try:
        inc_date = datetime.fromisoformat(incident_date)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid incident date format")

    complaint = models.Complaint(
        citizen_id=current_user.id,
        category=cat,
        department=department,
        incident_location=incident_location,
        incident_date=inc_date,
        description=description,
    )
    db.add(complaint)
    db.flush()

    if files:
        for f in files:
            if f.filename and f.content_type in ALLOWED_TYPES:
                orig_name, stored_name, ftype, fsize = save_upload_file(f, str(complaint.id))
                ev = models.EvidenceFile(
                    complaint_id=complaint.id,
                    original_filename=orig_name,
                    stored_filename=stored_name,
                    file_type=ftype,
                    file_size=fsize,
                )
                db.add(ev)

    db.commit()
    db.refresh(complaint)
    return complaint


@router.get("/my", response_model=List[schemas.ComplaintListOut])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_citizen),
):
    return (
        db.query(models.Complaint)
        .filter(models.Complaint.citizen_id == current_user.id)
        .order_by(desc(models.Complaint.created_at))
        .all()
    )


@router.get("/my/stats", response_model=schemas.CitizenStats)
def get_my_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_citizen),
):
    base = db.query(models.Complaint).filter(models.Complaint.citizen_id == current_user.id)
    return {
        "total": base.count(),
        "pending": base.filter(models.Complaint.status == models.ComplaintStatus.pending).count(),
        "under_investigation": base.filter(models.Complaint.status == models.ComplaintStatus.under_investigation).count(),
        "resolved": base.filter(models.Complaint.status == models.ComplaintStatus.resolved).count(),
    }


@router.get("/my/{complaint_id}", response_model=schemas.ComplaintOut)
def get_my_complaint_detail(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_citizen),
):
    complaint = (
        db.query(models.Complaint)
        .filter(
            models.Complaint.complaint_id == complaint_id,
            models.Complaint.citizen_id == current_user.id,
        )
        .first()
    )
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint


# ─── Admin Routes ────────────────────────────────────────────────────────────

@router.get("/admin/all", response_model=schemas.PaginatedComplaints)
def admin_get_all_complaints(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    q = db.query(models.Complaint)

    if search:
        q = q.filter(
            models.Complaint.complaint_id.ilike(f"%{search}%") |
            models.Complaint.department.ilike(f"%{search}%") |
            models.Complaint.incident_location.ilike(f"%{search}%")
        )
    if status:
        try:
            q = q.filter(models.Complaint.status == models.ComplaintStatus(status))
        except ValueError:
            pass
    if category:
        try:
            q = q.filter(models.Complaint.category == models.ComplaintCategory(category))
        except ValueError:
            pass

    total = q.count()
    items = q.order_by(desc(models.Complaint.created_at)).offset((page - 1) * limit).limit(limit).all()
    return {"total": total, "items": items}


@router.get("/admin/analytics", response_model=schemas.AnalyticsOut)
def admin_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    from datetime import timedelta

    now = datetime.utcnow()
    last_month = now - timedelta(days=30)

    total = db.query(func.count(models.Complaint.id)).scalar()
    pending = db.query(func.count(models.Complaint.id)).filter(models.Complaint.status == models.ComplaintStatus.pending).scalar()
    under_inv = db.query(func.count(models.Complaint.id)).filter(models.Complaint.status == models.ComplaintStatus.under_investigation).scalar()
    resolved = db.query(func.count(models.Complaint.id)).filter(models.Complaint.status == models.ComplaintStatus.resolved).scalar()

    total_prev = db.query(func.count(models.Complaint.id)).filter(models.Complaint.created_at < last_month).scalar() or 1
    pending_prev = db.query(func.count(models.Complaint.id)).filter(
        models.Complaint.status == models.ComplaintStatus.pending,
        models.Complaint.created_at < last_month
    ).scalar() or 1

    def pct_change(current, previous):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return round(((current - previous) / previous) * 100, 1)

    # Category distribution
    cat_rows = (
        db.query(models.Complaint.category, func.count(models.Complaint.id).label("cnt"))
        .group_by(models.Complaint.category)
        .all()
    )
    total_for_pct = total or 1
    category_distribution = [
        {
            "category": row.category.value,
            "count": row.cnt,
            "percentage": round((row.cnt / total_for_pct) * 100, 1),
        }
        for row in cat_rows
    ]

    # Department stats
    dept_rows = (
        db.query(models.Complaint.department, func.count(models.Complaint.id).label("cnt"))
        .group_by(models.Complaint.department)
        .order_by(desc("cnt"))
        .limit(10)
        .all()
    )
    department_stats = [{"department": r.department, "count": r.cnt} for r in dept_rows]

    return {
        "stats": {
            "total": total,
            "pending": pending,
            "under_investigation": under_inv,
            "resolved": resolved,
            "total_change": pct_change(total, total_prev),
            "pending_change": pct_change(pending, pending_prev),
            "under_investigation_change": 0.0,
            "resolved_change": 0.0,
        },
        "category_distribution": category_distribution,
        "department_stats": department_stats,
    }


@router.get("/admin/{complaint_id}", response_model=schemas.ComplaintOut)
def admin_get_complaint(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.complaint_id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint


@router.patch("/admin/{complaint_id}", response_model=schemas.ComplaintOut)
def admin_update_complaint(
    complaint_id: str,
    update: schemas.ComplaintUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    complaint = db.query(models.Complaint).filter(models.Complaint.complaint_id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if update.status is not None:
        complaint.status = update.status
    if update.assigned_officer_id is not None:
        officer = db.query(models.User).filter(
            models.User.id == update.assigned_officer_id,
            models.User.role == models.UserRole.admin,
        ).first()
        if not officer:
            raise HTTPException(status_code=404, detail="Officer not found")
        complaint.assigned_officer_id = update.assigned_officer_id
    if update.investigation_notes is not None:
        complaint.investigation_notes = update.investigation_notes

    complaint.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(complaint)
    return complaint


@router.get("/admin/evidence/{complaint_id}/{stored_filename}")
def serve_evidence(
    complaint_id: str,
    stored_filename: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    file_path = os.path.join(settings.UPLOAD_DIR, complaint_id, stored_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)


@router.get("/citizen/evidence/{complaint_id}/{stored_filename}")
def serve_evidence_citizen(
    complaint_id: str,
    stored_filename: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_citizen),
):
    complaint = db.query(models.Complaint).filter(
        models.Complaint.id == complaint_id,
        models.Complaint.citizen_id == current_user.id,
    ).first()
    if not complaint:
        raise HTTPException(status_code=403, detail="Access denied")
    file_path = os.path.join(settings.UPLOAD_DIR, complaint_id, stored_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)


# ─── Officers List ───────────────────────────────────────────────────────────

@router.get("/admin/officers/list", response_model=List[schemas.OfficerOut])
def list_officers(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin),
):
    return db.query(models.User).filter(models.User.role == models.UserRole.admin).all()
