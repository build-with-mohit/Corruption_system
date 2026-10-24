# CivicLedger — Anti-Corruption Reporting & Complaint Management Platform

A modern, institutional-grade civic integrity and anti-corruption complaint management platform built with **React (TypeScript)**, **Tailwind CSS v3**, **Python FastAPI**, and **PostgreSQL / SQLite**.

---

## 🏛️ Architecture & Three Portals

### 1. Public Portal (`/`)
- **Authentic Documentary Aesthetics**: Warm off-white background (`#F7F7F5`), deep charcoal (`#242622`), and muted sage green (`#687B69`).
- **Educational Knowledge Base**: Explaining the socio-economic impact of corruption and institutional abuse.
- **Reporting Workflow Guide**: Step-by-step breakdown of complaint filing, hash verification, investigation, and legal resolution.
- **Strict Disclaimers & Security**: Whistleblower anonymity standards and public guidance.

### 2. Citizen Whistleblower Portal (`/portal`)
- **Complaint Submission Wizard**: Department selection, corruption classification (Bribery, Fraud, Misuse of Power, Embezzlement, Nepotism), incident date, geo-location, and narrative details.
- **Evidence Vault**: Multi-file attachment supporting photographic proof, video footage, and legal PDFs with SHA-256 checksum verification.
- **Complaint Tracking**: Real-time status badges (`Pending`, `Under Investigation`, `Resolved`, `Rejected`).
- **Whistleblower Profile & Notifications**: Security settings and real-time status alerts.

### 3. Investigation & Administrative Console (`/admin`)
- **Executive Analytics**: Real-time caseload volume, resolution ratios, category distribution, and department breakdown charts.
- **Complaint Triage & Case Review**: Search, filter by status or department, review submitted evidence, assign investigating officers, update case status, and append legal audit logs.
- **Investigation Pipeline Tracker**: Multi-stage case tracker categorized by investigation phase.
- **Directory & Security Settings**: Officer roster and cryptographic anonymity enforcement.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Chief Investigator (Admin)** | `admin@civicledger.org` | `Password123!` |
| **Integrity Officer (Admin)** | `officer.sharma@civicledger.org` | `Password123!` |
| **Citizen Whistleblower** | `citizen@example.com` | `Password123!` |

*(Or register a new Citizen account directly through the web UI)*

---

## 🚀 Quick Start Guide

### Option 1: Run via Provided Batch Scripts (Windows)

1. **Start Backend**: Double-click `start-backend.bat`
   - Spawns FastAPI at `http://localhost:8000`
   - Interactive Swagger API documentation: `http://localhost:8000/docs`
2. **Start Frontend**: Double-click `start-frontend.bat`
   - Spawns Vite development server at `http://localhost:5173`

---

### Option 2: Manual Terminal Execution

#### 1. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python seed.py               # Seeds sample admin, officer, citizen, and complaints
python -m uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🗄️ Database Configuration

By default, the backend checks for a live PostgreSQL instance defined in `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/corruption_db
```
If PostgreSQL is running, it will automatically connect and create all tables. If PostgreSQL is not currently running locally, CivicLedger automatically initializes `sqlite:///./civicledger.db` so you can test all features immediately without setup delays.

To use PostgreSQL:
1. Ensure PostgreSQL is running on port 5432:
   ```bash
   createdb corruption_db
   ```
2. Adjust username/password in `backend/.env`.

---

## 🔒 Security & Whistleblower Protections
- **JWT (JSON Web Tokens)** with OAuth2 Bearer authorization.
- **Direct bcrypt password hashing** (72-byte safe truncation, salt generation).
- **Client header and telemetry stripping** for anonymous complaints.
- **MIME-type validation & safe file renaming** for all uploaded evidence attachments.
