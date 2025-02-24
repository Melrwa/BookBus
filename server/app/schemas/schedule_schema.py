from marshmallow import Schema, fields, validate, EXCLUDE
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.app.models import Schedule
from datetime import datetime

class ScheduleSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Schedule
        include_fk = True  # Include foreign keys in the schema
        load_instance = True  # Automatically create Schedule instances when loading
        unknown = EXCLUDE  # Ignore unknown fields during deserialization

    # Custom validations
    departure_time = fields.DateTime(required=True)
    arrival_time = fields.DateTime(required=True)
    origin = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    destination = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    vip_price = fields.Float(required=True, validate=validate.Range(min=0))
    business_price = fields.Float(required=True, validate=validate.Range(min=0))
    bus_id = fields.Int(required=True)

# Initialize the schema
schedule_schema = ScheduleSchema()
schedules_schema = ScheduleSchema(many=True)  # For serializing multiple schedules

