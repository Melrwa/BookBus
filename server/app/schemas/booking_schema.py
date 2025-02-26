# server/app/schemas/booking_schema.py
from marshmallow import Schema, fields, validate, ValidationError
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.app.models import Booking, Bus

class BookingSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Booking
        include_fk = True  # Include foreign keys in the schema
        load_instance = True  # Automatically create Booking instances when loading
    
    bus_id = fields.Int(required=True)
    
    # Custom validations
    seat_numbers = fields.Str(required=True, validate=validate.Length(min=1))
    origin = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    destination = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    departure_time = fields.DateTime(required=True)
    arrival_time = fields.DateTime(required=True)
    amount_paid = fields.Float(required=True, validate=validate.Range(min=0))
    is_vip = fields.Bool(required=False, default=False)

    def validate_seat_numbers(self, data):
        """Validate that the seat numbers are available."""
        bus = Bus.query.get(data.get("bus_id"))
        print(f"Validating seat numbers for bus_id: {data.get('bus_id')}, Bus: {bus}")  # Debug print
        if not bus:
            raise ValidationError(f"Bus with ID {data.get('bus_id')} not found.")
        
        seats = data.get("seat_numbers", "").split(",")
        if len(seats) > bus.seats_available:
            raise ValidationError("Not enough seats available.")

# Initialize the schema
booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)  # For serializing multiple bookings