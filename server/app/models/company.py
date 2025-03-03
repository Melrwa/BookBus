from datetime import datetime
from sqlalchemy.orm import validates
from server.app.extensions import db

class Company(db.Model):
    __tablename__ = "companies"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    license_number = db.Column(db.String(50), nullable=False, unique=True)  # Unique constraint
    location = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    buses = db.relationship('Bus', back_populates='company', cascade='all, delete')
    transactions = db.relationship('Transaction', back_populates='company', cascade='all, delete')
    admins = db.relationship('User', back_populates='company')

    # Serialization rules
    serialize_rules = ("-created_at", "-updated_at", "-buses.company", "-transactions.company", "-admins.company", '-users.company',  "-admins.driver.bus.company" )
    
    def to_dict(self):
        print("Serializing Company:", self.name)
        print("Admins:", self.admins)
        print("Buses:", self.buses)
        return super().to_dict()

    def __repr__(self):
        return f"<Company {self.name}>"

    # Validations
    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Company name cannot be empty.")
        return name

    @validates("license_number")
    def validate_license_number(self, key, license_number):
        if not license_number:
            raise ValueError("License number cannot be empty.")
        
        # Check if the license number already exists
        existing_company = Company.query.filter_by(license_number=license_number).first()
        if existing_company:
            raise ValueError("License number must be unique.")
        
        return license_number

    @validates("location")
    def validate_location(self, key, location):
        if not location:
            raise ValueError("Location cannot be empty.")
        return location