from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models here
from .bus import Bus
from .schedule import Schedule
from .company import Company
from .user import User
from .user import User, UserRole  # Export UserRole

# Optional: Export models for easier access
__all__ = ["Bus", "Schedule", "Company", "User", "UserRole"]
