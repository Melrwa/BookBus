import sys
import os

# Add the root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from server.app.extensions import db  # Import your SQLAlchemy instance
from server.app.models.user import User
from server.app.models.booking import Booking
from server.app.models.bus import Bus
from server.app.models.schedule import Schedule
from server.app.models.booking_review import BookingReview
from server.app.models.company import Company
from server.app.models.transaction import Transaction
from server.app.models.driver import Driver

# Define the output file path (in the root directory)
output_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "combined_models.py")

# Export all models to a single file
with open(output_file, "w") as f:
    # Write the necessary imports
    f.write("from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Float, Enum\n")
    f.write("from sqlalchemy.orm import relationship\n")
    f.write("from server.app.extensions import db\n")
    f.write("Base = db.Model\n\n")  # Define Base as the declarative base
    
    # Write the models
    for model in [User, Booking, Bus, Schedule, BookingReview, Company, Transaction, Driver]:
        f.write(f"class {model.__name__}(Base):\n")
        f.write(f"    __tablename__ = '{model.__tablename__}'\n")
        for column in model.__table__.columns:
            # Write the column definition
            f.write(f"    {column.name} = db.Column({column.type.__class__.__name__}")
            # Add additional column arguments (e.g., primary_key, nullable)
            if column.primary_key:
                f.write(", primary_key=True")
            if not column.nullable:
                f.write(", nullable=False")
            f.write(")\n")
        f.write("\n")