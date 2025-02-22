from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models here to make them available
from .user import User,  UserRole

