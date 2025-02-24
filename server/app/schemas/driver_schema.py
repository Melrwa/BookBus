from marshmallow import Schema, fields

class DriverSchema(Schema):
    id = fields.Int(dump_only=True)
    # Add other fields as needed