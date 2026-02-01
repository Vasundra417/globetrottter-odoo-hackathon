from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routes import auth, trips, stops, activities, budget

# Import routers with error handling
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
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "https://your-frontend.vercel.app"),  # Your Vercel URL
]
# ============================================
# CORS MIDDLEWARE - MUST BE FIRST!
# ============================================
print("Adding CORS middleware...")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)
print("CORS middleware added successfully!")

# ============================================
# INCLUDE ROUTERS
# ============================================
print("Including routers...")
app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(stops.router)
app.include_router(activities.router)
app.include_router(budget.router)
app.include_router(parking.router)
app.include_router(sharing.router)
app.include_router(admin.router)
print("All routers included!")

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

# Print startup message
@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("🚀 GlobeTrotter API Started!")
    print("📖 Docs: http://localhost:8000/docs")
    print("✅ CORS: Enabled for all origins")
    print("=" * 50)