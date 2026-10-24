"""
Vercel Serverless Entry Point
──────────────────────────────
Wraps the existing FastAPI application with Mangum so it can run
as an AWS Lambda-compatible handler inside Vercel's Python runtime.
"""

import sys
import os

# ── Make the backend package importable ──────────────────────────────────────
# Vercel runs this file from the project root. We need to add `backend/` to
# sys.path so that `from app.main import app` resolves correctly.
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from mangum import Mangum
from app.main import app   # the FastAPI instance

# Mangum adapter – translates API Gateway / Lambda events ↔ ASGI
handler = Mangum(app, lifespan="off")
