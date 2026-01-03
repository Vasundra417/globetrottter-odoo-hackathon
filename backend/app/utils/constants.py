# backend/app/utils/constants.py

# ============================================
# ACTIVITY CATEGORIES
# ============================================
ACTIVITY_CATEGORIES = [
    "sightseeing",
    "food",
    "adventure",
    "shopping",
    "culture",
    "nightlife",
    "sports",
    "relaxation"
]

# ============================================
# BUDGET CATEGORIES
# ============================================
BUDGET_CATEGORIES = [
    "transport",
    "stay",
    "activities",
    "meals",
    "parking",
    "shopping",
    "other"
]

# ============================================
# PARKING STATUS
# ============================================
PARKING_STATUS = [
    "available",
    "booked",
    "maintenance"
]

# ============================================
# BOOKING STATUS
# ============================================
BOOKING_STATUS = [
    "confirmed",
    "pending",
    "cancelled"
]

# ============================================
# COST INDEX RANGES
# ============================================
COST_INDEX_CHEAP = 1.0  # Very budget-friendly
COST_INDEX_MODERATE = 5.0  # Mid-range
COST_INDEX_EXPENSIVE = 9.0  # Luxury

# ============================================
# ERROR MESSAGES
# ============================================
ERROR_TRIP_NOT_FOUND = "Trip not found"
ERROR_STOP_NOT_FOUND = "Stop not found"
ERROR_ACTIVITY_NOT_FOUND = "Activity not found"
ERROR_USER_NOT_FOUND = "User not found"
ERROR_UNAUTHORIZED = "Unauthorized access"
ERROR_INVALID_DATES = "Invalid date range"
ERROR_OVER_BUDGET = "Trip exceeds budget limit"