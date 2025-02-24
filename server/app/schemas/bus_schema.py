from marshmallow import Schema, fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.app.models import Bus

class BusSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Bus
        include_fk = True  # Include foreign keys in the schema
        load_instance = True  # Automatically create Bus instances when loading

    seats_available = fields.Int(required=False)

    # Custom validations
    bus_number = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    capacity = fields.Int(required=True, validate=validate.Range(min=1))
    seats_available = fields.Int(required=False, validate=validate.Range(min=0))
    route = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    company_id = fields.Int(required=True)

# Initialize the schema
bus_schema = BusSchema()
buses_schema = BusSchema(many=True)  # For serializing multiple buses