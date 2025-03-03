from marshmallow import Schema, fields, validate, ValidationError, validates
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.app.models import Company

class CompanySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        include_fk = True  # Include foreign keys in the schema
        load_instance = True  # Automatically create Company instances when loading

    # Custom validations
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    license_number = fields.Str(required=True, validate=validate.Length(min=1, max=50))  # New field
    location = fields.Str(required=True, validate=validate.Length(min=1, max=100))  # New field

    # Custom validation for unique license_number
    @validates("license_number")
    def validate_license_number(self, value):
        existing_company = Company.query.filter_by(license_number=value).first()
        if existing_company:
            raise ValidationError("License number must be unique.")

# Initialize the schema
company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)  # For serializing multiple companies