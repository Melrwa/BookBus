# server/app/services/booking_service.py
from server.app.models import Booking, Bus
from server.app import db
from server.app.schemas.booking_schema import booking_schema, bookings_schema
from marshmallow import ValidationError
from server.app.schemas import booking_review_schema


def add_booking_service(data):
    """Add a new booking."""
    print(f"Adding booking with data: {data}")  # Debug print
    
    try:
        # Validate seat numbers
        booking_schema.validate_seat_numbers(data)
        
        # Deserialize the input data into a Booking instance
        booking = booking_schema.load(data, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # Add the booking to the database
    db.session.add(booking)
    db.session.commit()

    # Update the bus's seats_available
    booking.update_seats_available()

    # Serialize the booking into a dictionary
    serialized_booking = booking_schema.dump(booking)
    print(f"Serialized booking: {serialized_booking}")  # Debug print

    return serialized_booking

def get_booking_by_id_service(booking_id):
    """Get a booking by its ID and serialize using BookingSchema."""
    booking = Booking.query.get(booking_id)
    if not booking:
        return None
    # Include reviews in the response
    booking_data = booking_schema.dump(booking)
    booking_data['reviews'] = booking_review_schema.dump(booking.reviews)
    return booking_data

def get_all_bookings_service(page=1, per_page=10):
    """Get all bookings with pagination and serialize using BookingSchema."""
    bookings = Booking.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "bookings": bookings_schema.dump(bookings.items),
        "total_pages": bookings.pages,
        "current_page": bookings.page,
        "total_items": bookings.total
    }

def delete_booking_service(booking_id):
    """Delete a booking."""
    booking = Booking.query.get(booking_id)
    if not booking:
        return False

    # Update the bus's seats_available (add back the seats)
    bus = Bus.query.get(booking.bus_id)
    seats_booked = len(booking.seat_numbers.split(","))
    bus.seats_available += seats_booked

    # Delete the booking
    db.session.delete(booking)
    db.session.commit()
    return True