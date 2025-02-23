from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from server.app.extensions import db

class Schedule(db.Model, SerializerMixin):
    __tablename__ = "schedules"

    id = db.Column(db.Integer, primary_key=True)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    vip_price = db.Column(db.Float, nullable=False)  # VIP class price
    business_price = db.Column(db.Float, nullable=False)  # Business class price
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bus = db.relationship('Bus', back_populates='schedules')
       # Add new relationships
    bookings = db.relationship('Booking', back_populates='schedule', cascade='all, delete')
    transactions = db.relationship('Transaction', back_populates='schedule', cascade='all, delete')

    # Serialization rules
    serialize_rules = ("-bus_id", "-created_at", "-updated_at", "-bus.schedules", "-bookings.schedule", "-transactions.schedule")

    def __repr__(self):
        return f"<Schedule {self.origin} to {self.destination} - {self.bus.bus_number}>"

    # Validations
    @validates("departure_time", "arrival_time")
    def validate_times(self, key, time):
        if key == "arrival_time" and self.departure_time and time <= self.departure_time:
            raise ValueError("Arrival time must be after departure time.")
        return time

    @validates("vip_price", "business_price")
    def validate_prices(self, key, price):
        if price < 0:
            raise ValueError(f"{key} must be a positive value.")
        return price