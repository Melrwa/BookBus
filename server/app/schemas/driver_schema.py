# server/app/schemas/driver_schema.py
from marshmallow import Schema, fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.app.models import Driver

class DriverSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Driver
        include_fk = True  # Include foreign keys in the schema
        load_instance = True  # Automatically create Driver instances when loading

    # Custom validations
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    dob = fields.Date(required=True)
    gender = fields.Str(required=True, validate=validate.OneOf(["Male", "Female", "Other"]))
    license_number = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    accident_record = fields.Int(required=False, validate=validate.Range(min=0))
    years_of_experience = fields.Int(required=False, validate=validate.Range(min=0))
    user_id = fields.Int(required=False)
    bus_id = fields.Int(required=False)

# Initialize the schema
driver_schema = DriverSchema()
drivers_schema = DriverSchema(many=True)  # For serializing multiple drivers