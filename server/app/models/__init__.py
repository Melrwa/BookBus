from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models here
from .bus import Bus
from .schedule import Schedule
from .company import Company
from .user import User
from .user import User, UserRole  # Export UserRole
from .transaction import Transaction
from .booking import Booking
from .driver import Driver
from .booking_review import BookingReview
from .tokenblacklist import TokenBlacklist

# Optional: Export models for easier access
__all__ = ["Bus", "Schedule", "Company", "User", "UserRole", "Transaction", "Booking", "Driver", "BookingReview", "TokenBlacklist"]

