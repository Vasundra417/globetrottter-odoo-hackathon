# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .database import Base, engine
from .routes import trips 
from .routes import trips, stops, activities, parking, budget, sharing, admin, auth

# ============================================
# 1. CREATE DATABASE TABLES
# ============================================
# This creates all tables defined in models
# (Only creates if they don't exist)
Base.metadata.create_all(bind=engine)

# ============================================
# 2. INITIALIZE FASTAPI APP
# ============================================
app = FastAPI(
    title="GlobeTrotter API",
    description="Personalized Travel Planning Platform with Smart Parking",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI at /docs
    redoc_url="/redoc"  # Alternative UI at /redoc
)

# ============================================
# 3. ADD CORS MIDDLEWARE
# ============================================
# This allows frontend (React) to make requests to backend (FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Which domains can access
    allow_credentials=True,                # Allow cookies/auth
    allow_methods=["*"],                   # Allow all HTTP methods
    allow_headers=["*"],                   # Allow all headers
)

# ============================================
# 4. ROOT ENDPOINT
# ============================================
@app.get("/")
def read_root():
    """Welcome endpoint - test if API is working"""
    return {
        "message": "GlobeTrotter API v1.0",
        "status": "Running",
        "docs": "http://localhost:8000/docs"
    }

# ============================================
# 5. HEALTH CHECK ENDPOINT
# ============================================
@app.get("/health")
def health_check():
    """Check if API is healthy"""
    return {"status": "healthy", "service": "globetrotter"}

# ============================================
# 6. INCLUDE ROUTERS (Add these after creating route files)
# ============================================
# We'll add these later after creating route files:
# from .routes import trips, activities, parking, budget, admin
# app.include_router(trips.router)
# app.include_router(activities.router)
# etc...
app.include_router(trips.router)
app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(stops.router)
app.include_router(activities.router)
app.include_router(parking.router)
app.include_router(budget.router)
app.include_router(sharing.router)
app.include_router(admin.router)
# ============================================
# 7. ERROR HANDLERS (Optional but recommended)
# ============================================
@app.exception_handler(Exception)
async def universal_exception_handler(request, exc):
    """Handle all uncaught exceptions"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )

# ============================================
# TO RUN THIS:
# ============================================
# In terminal: uvicorn app.main:app --reload --port 8000
# Then visit: http://localhost:8000/docs