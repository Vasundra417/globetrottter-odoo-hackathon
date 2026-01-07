# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ADD CORS BEFORE ANYTHING ELSE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Then include routers...
from .routes import trips, stops, activities, parking, budget, sharing, admin, auth

app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(stops.router)
app.include_router(activities.router)
app.include_router(parking.router)
app.include_router(budget.router)
app.include_router(sharing.router)
app.include_router(admin.router)