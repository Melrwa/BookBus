from datetime import datetime, timedelta
from server.app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from server.app.models.user import User  
from server.app.models.bus import Bus    
from server.app.models.schedule import Schedule  


class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Link to User
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'), nullable=False)

    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    travel_time = db.Column(db.Interval, nullable=True)  # Auto-calculated
    amount_paid = db.Column(db.Float, nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='bookings')  # Link to User
    bus = db.relationship('Bus', back_populates='bookings')
    schedule = db.relationship('Schedule', back_populates='bookings')

    # Serialization rules
    serialize_rules = ('-bus.bookings', '-schedule.bookings', '-user.bookings')

    @property
    def calculate_travel_time(self):
        """Automatically calculate travel time."""
        return self.arrival_time - self.departure_time

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.travel_time = self.calculate_travel_time  # Auto-set on creation

    @validates("amount_paid")
    def validate_amount_paid(self, key, amount):
        """Ensure amount paid is non-negative."""
        if amount < 0:
            raise ValueError("Amount paid cannot be negative.")
        return amount