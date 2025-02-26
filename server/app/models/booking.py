from datetime import datetime, timedelta
from server.app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from server.app.models.user import User  
from server.app.models.bus import Bus    
from server.app.models.schedule import Schedule  

class Booking(db.Model, SerializerMixin):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'), nullable=False)
    seat_numbers = db.Column(db.String(255), nullable=False)  # Store seat numbers as a comma-separated string
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    travel_time = db.Column(db.Interval, nullable=True)
    amount_paid = db.Column(db.Float, nullable=False)
    is_vip = db.Column(db.Boolean, default=False)  # Indicates if the booking is for VIP seats

    # Relationships
    user = db.relationship('User', back_populates='bookings')
    bus = db.relationship('Bus', back_populates='bookings')
    schedule = db.relationship('Schedule', back_populates='bookings')
    review = db.relationship('BookingReview', back_populates='booking', uselist=False)  # One-to-one relationship

    # Serialization rules
    serialize_rules = ("-bus.bookings", "-schedule.bookings", "-user.bookings", "-review.booking")

    @property
    def calculate_travel_time(self):
        """Automatically calculate travel time."""
        return self.arrival_time - self.departure_time

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.travel_time = self.calculate_travel_time  # Auto-set on creation
        # Debugging: Print the bus_id to verify it's being set
        print(f"Initializing Booking with bus_id: {self.bus_id}")

    @validates("seat_numbers")
    def validate_seat_numbers(self, key, seat_numbers):
        """Ensure seat numbers are valid and available."""
        seats = seat_numbers.split(",")
        bus = Bus.query.get(self.bus_id)
        if len(seats) > bus.seats_available:
            raise ValueError("Not enough seats available.")
        return seat_numbers

    @validates("seat_numbers")
    def validate_seat_numbers(self, key, seat_numbers):
        """Ensure seat numbers are valid and available."""
        seats = seat_numbers.split(",")
        
        # Fetch the bus object
        bus = Bus.query.get(self.bus_id)
        
        # Check if the bus exists
        if not bus:
            raise ValueError(f"Bus with ID {self.bus_id} not found.")
        
        # Check if there are enough seats available
        if len(seats) > bus.seats_available:
            raise ValueError("Not enough seats available.")
        
        return seat_numbers
    

    def update_seats_available(self):
        """Update the bus's seats_available after booking."""
        bus = Bus.query.get(self.bus_id)
        if not bus:
            raise ValueError("Bus not found")
        
        seats_booked = len(self.seat_numbers.split(","))
        bus.seats_available -= seats_booked
        db.session.commit()