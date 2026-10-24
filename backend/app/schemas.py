from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, validator
import uuid
from app.models import UserRole, ComplaintStatus, ComplaintCategory


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    phone: Optional[str] = None

    @validator("password")
    def password_min_length(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class AdminCreate(UserCreate):
    admin_secret: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole
    phone: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Evidence Schemas ────────────────────────────────────────────────────────

class EvidenceFileOut(BaseModel):
    id: uuid.UUID
    original_filename: str
    stored_filename: str
    file_type: str
    file_size: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ─── Complaint Schemas ───────────────────────────────────────────────────────

class ComplaintCreate(BaseModel):
    category: ComplaintCategory
    department: str
    incident_location: str
    incident_date: datetime
    description: str


class ComplaintUpdate(BaseModel):
    status: Optional[ComplaintStatus] = None
    assigned_officer_id: Optional[uuid.UUID] = None
    investigation_notes: Optional[str] = None


class OfficerOut(BaseModel):
    id: uuid.UUID
    full_name: str
    email: str

    class Config:
        from_attributes = True


class ComplaintOut(BaseModel):
    id: uuid.UUID
    complaint_id: str
    category: ComplaintCategory
    department: str
    incident_location: str
    incident_date: datetime
    description: str
    status: ComplaintStatus
    investigation_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    citizen: Optional[UserOut]
    assigned_officer: Optional[OfficerOut]
    evidence_files: List[EvidenceFileOut] = []

    class Config:
        from_attributes = True


class ComplaintListOut(BaseModel):
    id: uuid.UUID
    complaint_id: str
    category: ComplaintCategory
    department: str
    incident_location: str
    incident_date: datetime
    status: ComplaintStatus
    created_at: datetime
    assigned_officer: Optional[OfficerOut]

    class Config:
        from_attributes = True


class PaginatedComplaints(BaseModel):
    total: int
    items: List[ComplaintListOut]


# ─── Analytics Schemas ───────────────────────────────────────────────────────

class CitizenStats(BaseModel):
    total: int
    pending: int
    under_investigation: int
    resolved: int


class AdminStats(BaseModel):
    total: int
    pending: int
    under_investigation: int
    resolved: int
    total_change: float
    pending_change: float
    under_investigation_change: float
    resolved_change: float


class CategoryStat(BaseModel):
    category: str
    count: int
    percentage: float


class DepartmentStat(BaseModel):
    department: str
    count: int


class AnalyticsOut(BaseModel):
    stats: AdminStats
    category_distribution: List[CategoryStat]
    department_stats: List[DepartmentStat]
