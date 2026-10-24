@echo off
echo Starting CivicLedger Backend...
cd backend
call pip install -r requirements.txt
echo.
echo Starting FastAPI server on http://localhost:8000
echo API docs: http://localhost:8000/docs
echo.
python -m uvicorn app.main:app --reload --port 8000
