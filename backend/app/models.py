import uuid
import random
import string
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, DateTime, Enum, ForeignKey, Integer, Boolean
)
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses CHAR(36).
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == "postgresql":
            return value
        if not isinstance(value, uuid.UUID):
            return str(uuid.UUID(str(value)))
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if not isinstance(value, uuid.UUID):
            return uuid.UUID(str(value))
        return value



class UserRole(str, enum.Enum):
    citizen = "citizen"
    admin = "admin"


class ComplaintStatus(str, enum.Enum):
    pending = "pending"
    under_investigation = "under_investigation"
    resolved = "resolved"
    rejected = "rejected"


class ComplaintCategory(str, enum.Enum):
    bribery = "Bribery"
    misuse_of_power = "Misuse of Power"
    fraud = "Fraud"
    disproportionate_assets = "Disproportionate Assets"
    nepotism = "Nepotism"
    embezzlement = "Embezzlement"
    other = "Other"


def generate_complaint_id():
    year = datetime.now().year
    random_num = random.randint(1000, 9999)
    return f"CMP-{year}-{random_num}"


class User(Base):
    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.citizen, nullable=False)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    complaints = relationship("Complaint", back_populates="citizen", foreign_keys="Complaint.citizen_id")
    assigned_complaints = relationship("Complaint", back_populates="assigned_officer", foreign_keys="Complaint.assigned_officer_id")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    complaint_id = Column(String(30), unique=True, nullable=False, default=generate_complaint_id)
    citizen_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    category = Column(Enum(ComplaintCategory), nullable=False)
    department = Column(String(255), nullable=False)
    incident_location = Column(String(500), nullable=False)
    incident_date = Column(DateTime, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.pending, nullable=False)
    assigned_officer_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    investigation_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    citizen = relationship("User", back_populates="complaints", foreign_keys=[citizen_id])
    assigned_officer = relationship("User", back_populates="assigned_complaints", foreign_keys=[assigned_officer_id])
    evidence_files = relationship("EvidenceFile", back_populates="complaint", cascade="all, delete-orphan")


class EvidenceFile(Base):
    __tablename__ = "evidence_files"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    complaint_id = Column(GUID(), ForeignKey("complaints.id"), nullable=False)
    original_filename = Column(String(500), nullable=False)
    stored_filename = Column(String(500), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="evidence_files")
