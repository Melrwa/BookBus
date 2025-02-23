from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from server.app.extensions import db


class Bus(db.Model, SerializerMixin):
    __tablename__ = "buses"

    id = db.Column(db.Integer, primary_key=True)
    bus_number = db.Column(db.String(50), nullable=False, unique=True)
    capacity = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)  # Bus picture
    route = db.Column(db.String(255), nullable=False)  # General route (e.g., "Nairobi - Mombasa")
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    company = db.relationship('Company', back_populates='buses')
    schedules = db.relationship('Schedule', back_populates='bus', cascade='all, delete')

    # Serialization rules
    serialize_rules = ("-company_id", "-created_at", "-updated_at")

    def __repr__(self):
        return f"<Bus {self.bus_number} - {self.company.name}>"

    # Validations
    @validates("capacity")
    def validate_capacity(self, key, capacity):
        if capacity <= 0:
            raise ValueError("Capacity must be a positive integer.")
        return capacity

    @validates("route")
    def validate_route(self, key, route):
        if not route:
            raise ValueError("Route cannot be empty.")
        return route