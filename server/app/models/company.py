from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from server.app.extensions import db

class Company(db.Model, SerializerMixin):
    __tablename__ = "companies"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    buses = db.relationship('Bus', back_populates='company', cascade='all, delete')

    # Serialization rules
    serialize_rules = ("-created_at", "-updated_at")

    def __repr__(self):
        return f"<Company {self.name}>"

    # Validations
    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Company name cannot be empty.")
        return name