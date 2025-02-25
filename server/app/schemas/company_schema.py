# server/app/schemas/company_schema.py
from marshmallow import Schema, fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.app.models import Company

class CompanySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        include_fk = True  # Include foreign keys in the schema
        load_instance = True  # Automatically create Company instances when loading

    # Custom validations
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))

# Initialize the schema
company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)  # For serializing multiple companies