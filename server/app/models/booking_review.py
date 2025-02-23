from datetime import datetime
from server.app.extensions import db
from sqlalchemy_serializer import SerializerMixin


class BookingReview(db.Model, SerializerMixin):
    __tablename__ = "booking_reviews"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    review = db.Column(db.Text, nullable=False)  # User's review
    alert = db.Column(db.Boolean, default=False)  # Indicates if the review is an alert
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp of the review

    # Relationships
    booking = db.relationship('Booking', back_populates='review')

    # Serialization rules
    serialize_rules = ("-booking.review",)