from datetime import date
from server.app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from server.app.models.user import User, UserRole  # Correct import path
from server.app.models.bus import Bus    # Correct import path

class Driver(db.Model, SerializerMixin):
    __tablename__ = 'drivers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Driver's full name
    dob = db.Column(db.Date, nullable=False)  # Date of birth
    gender = db.Column(db.String(10), nullable=False)  # Male/Female/Other
    license_number = db.Column(db.String(50), unique=True, nullable=False)  # Unique License
    accident_record = db.Column(db.Integer, default=0)  # Number of recorded accidents
    years_of_experience = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Link to User account
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=True)  # Assigned Bus (optional)

    # Relationships
    bus = db.relationship('Bus', back_populates='driver')
    user = db.relationship('User', back_populates='driver')  # Link to User

    # Serialization rules
    serialize_rules = ('-bus.driver', '-user.driver')  # Avoid circular serialization

    def age(self):
        """Calculate driver’s age."""
        return date.today().year - self.dob.year

    @validates("license_number")
    def validate_license_number(self, key, license_number):
        """Ensure license number is unique and not empty."""
        if not license_number:
            raise ValueError("License number cannot be empty.")
        return license_number

    @validates("years_of_experience")
    def validate_years_of_experience(self, key, years):
        """Ensure years of experience is non-negative."""
        if years < 0:
            raise ValueError("Years of experience cannot be negative.")
        return years
    
    @validates("user")
    def validate_user(self, key, user):
        """Ensure the linked user has a picture if they are a driver."""
        if user.role == UserRole.DRIVER and not user.picture:
            raise ValueError("Drivers must have a picture.")
        return user