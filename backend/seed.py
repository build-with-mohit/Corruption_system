"""Seed script to populate initial users, officers, and complaints for demonstration."""
from datetime import datetime, timedelta
import uuid
from app.database import SessionLocal, Base, engine
from app import models, auth

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_admin = db.query(models.User).filter(models.User.email == "admin@civicledger.org").first()
        if existing_admin:
            print("Database already seeded.")
            return

        print("Seeding initial administrative and citizen accounts...")

        # 1. Admin
        admin_user = models.User(
            id=uuid.uuid4(),
            email="admin@civicledger.org",
            full_name="Chief Inspector Vance",
            hashed_password=auth.get_password_hash("Password123!"),
            role=models.UserRole.admin,
            phone="+91 98200 11223",
            is_active=True,
        )
        db.add(admin_user)

        # 2. Officer
        officer_user = models.User(
            id=uuid.uuid4(),
            email="officer.sharma@civicledger.org",
            full_name="Senior Officer Priya Sharma",
            hashed_password=auth.get_password_hash("Password123!"),
            role=models.UserRole.admin,
            phone="+91 98200 44556",
            is_active=True,
        )
        db.add(officer_user)

        # 3. Citizen
        citizen_user = models.User(
            id=uuid.uuid4(),
            email="citizen@example.com",
            full_name="Rajesh Kumar",
            hashed_password=auth.get_password_hash("Password123!"),
            role=models.UserRole.citizen,
            phone="+91 98111 22334",
            is_active=True,
        )
        db.add(citizen_user)
        db.flush()

        print("Seeding realistic sample complaints...")

        sample_complaints = [
            models.Complaint(
                complaint_id="CMP-2025-4521",
                citizen_id=citizen_user.id,
                category=models.ComplaintCategory.bribery,
                department="Municipal Corporation",
                incident_location="Zonal Ward 4 Office, Sector 12",
                incident_date=datetime.utcnow() - timedelta(days=12),
                description="Executive engineer demanded a 10% cash facilitation fee (INR 2,50,000) for clearing overdue contractor invoices on the storm drain rehabilitation project.",
                status=models.ComplaintStatus.under_investigation,
                assigned_officer_id=officer_user.id,
                investigation_notes="Audio recording of telephonic extortion submitted. Subpoena issued to municipal audit department.",
                created_at=datetime.utcnow() - timedelta(days=10),
            ),
            models.Complaint(
                complaint_id="CMP-2025-4522",
                citizen_id=citizen_user.id,
                category=models.ComplaintCategory.fraud,
                department="Public Works Department",
                incident_location="National Highway 48 Bypass Km 14-22",
                incident_date=datetime.utcnow() - timedelta(days=20),
                description="Contractor utilized substandard bitumen mix failing IRC 37-2018 specifications. Laboratory core test results falsified by assistant executive engineer.",
                status=models.ComplaintStatus.pending,
                created_at=datetime.utcnow() - timedelta(days=5),
            ),
            models.Complaint(
                complaint_id="CMP-2025-4523",
                citizen_id=citizen_user.id,
                category=models.ComplaintCategory.misuse_of_power,
                department="Revenue & Land Records",
                incident_location="Sub-Registrar Office, District HQ",
                incident_date=datetime.utcnow() - timedelta(days=35),
                description="Deliberate delay in issuing non-encumbrance certificate unless speed money paid through intermediary deed writer.",
                status=models.ComplaintStatus.resolved,
                assigned_officer_id=admin_user.id,
                investigation_notes="CCTV footage cross-referenced. Intermediary detained; disciplinary proceedings initiated against assistant sub-registrar. Certificate issued.",
                created_at=datetime.utcnow() - timedelta(days=32),
                updated_at=datetime.utcnow() - timedelta(days=2),
            ),
            models.Complaint(
                complaint_id="CMP-2025-4524",
                citizen_id=citizen_user.id,
                category=models.ComplaintCategory.embezzlement,
                department="Health & Family Welfare",
                incident_location="District Civil Hospital Central Pharmacy",
                incident_date=datetime.utcnow() - timedelta(days=15),
                description="Diversion of government-supplied life-saving oncology medications to private commercial pharmacies at inflated pricing.",
                status=models.ComplaintStatus.under_investigation,
                assigned_officer_id=officer_user.id,
                investigation_notes="Inventory batch serials tracked. Surprise raid conducted on private chemist shops.",
                created_at=datetime.utcnow() - timedelta(days=14),
            ),
            models.Complaint(
                complaint_id="CMP-2025-4525",
                citizen_id=citizen_user.id,
                category=models.ComplaintCategory.nepotism,
                department="State Transport Authority",
                incident_location="Regional Transport Office, West Zone",
                incident_date=datetime.utcnow() - timedelta(days=8),
                description="Unauthorized allocation of 18 inter-state commercial bus permits to entities directly owned by family members of the regional licensing officer.",
                status=models.ComplaintStatus.pending,
                created_at=datetime.utcnow() - timedelta(days=3),
            ),
        ]

        db.add_all(sample_complaints)
        db.commit()
        print("Database seeded successfully with demo users and complaints!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
