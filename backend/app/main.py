# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Import routers
try:
    from app.routes import auth, trips, stops, activities, budget, parking, sharing, admin
except ImportError:
    try:
        from .routes import auth, trips, stops, activities, budget, parking, sharing, admin
    except ImportError as e:
        print(f"Error importing routes: {e}")
        raise

# Create FastAPI app
app = FastAPI(
    title="GlobeTrotter API",
    description="Travel Planning Platform",
    version="1.0.0"
)

# ============================================
# CORS MIDDLEWARE - MUST BE FIRST!
# ============================================
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "https://your-frontend.vercel.app"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# INCLUDE ROUTERS
# ============================================
app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(stops.router)
app.include_router(activities.router)
app.include_router(budget.router)
app.include_router(parking.router)
app.include_router(sharing.router)
app.include_router(admin.router)

# ============================================
# ROOT ENDPOINTS
# ============================================
@app.get("/")
def root():
    return {
        "message": "GlobeTrotter API is running!",
        "cors_enabled": True,
        "docs": "http://localhost:8000/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "cors": "enabled"}

@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("🚀 GlobeTrotter API Started!")
    print("📖 Docs: http://localhost:8000/docs")
    print("✅ CORS: Enabled")
    print("=" * 50)