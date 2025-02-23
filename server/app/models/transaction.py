from server.app.models.booking import Booking  
from server.app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Link to User
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)

    total_amount = db.Column(db.Float, default=0.0)  # Total earnings per trip
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relationships
    user = db.relationship('User', back_populates='transactions')  # Link to User
    schedule = db.relationship('Schedule', back_populates='transactions')
    bus = db.relationship('Bus', back_populates='transactions')
    company = db.relationship('Company', back_populates='transactions')

    # Serialization rules
    serialize_rules = ('-bus.transactions', '-schedule.transactions', '-company.transactions', '-user.transactions')

    @staticmethod
    def record_transaction(schedule_id):
        """Calculate and record total earnings for a bus schedule."""
        bookings = Booking.query.filter_by(schedule_id=schedule_id).all()
        total_earnings = sum(booking.amount_paid for booking in bookings)

        transaction = Transaction(
            schedule_id=schedule_id,
            bus_id=bookings[0].bus_id if bookings else None,
            company_id=bookings[0].bus.company_id if bookings else None,
            total_amount=total_earnings
        )
        db.session.add(transaction)
        db.session.commit()

    @validates("total_amount")
    def validate_total_amount(self, key, amount):
        """Ensure total amount is non-negative."""
        if amount < 0:
            raise ValueError("Total amount cannot be negative.")
        return amount