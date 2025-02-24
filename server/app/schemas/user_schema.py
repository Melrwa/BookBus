from marshmallow import Schema, fields, validate, post_load, EXCLUDE
from server.app.models import UserRole, User
from .booking_schema import BookingSchema  # Import BookingSchema
from .transaction_schema import TransactionSchema  # Import TransactionSchema
from .driver_schema import DriverSchema  # Import DriverSchema
from .company_schema import CompanySchema  # Import CompanySchema

class UserSchema(Schema):
    """Marshmallow schema for the User model."""
    id = fields.Int(dump_only=True)
    fullname = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    username = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    email = fields.Email(required=True)
    phone_number = fields.Str(required=True, validate=validate.Length(min=10, max=15))
    picture = fields.Str(allow_none=True)
    role = fields.Str(required=True, validate=validate.OneOf([role.value for role in UserRole]))
    company_id = fields.Int(allow_none=True)

    # Related fields (ensure these exist in the User model)
    bookings = fields.Nested(BookingSchema, many=True, dump_only=True)  # Use imported BookingSchema
    transactions = fields.Nested(TransactionSchema, many=True, dump_only=True)  # Use imported TransactionSchema
    driver = fields.Nested(DriverSchema, dump_only=True)  # Use imported DriverSchema
    company = fields.Nested(CompanySchema, dump_only=True)  # Use imported CompanySchema

    class Meta:
        fields = (
            "id",
            "fullname",
            "username",
            "email",
            "phone_number",
            "picture",
            "role",
            "company_id",
            "bookings",
            "transactions",
            "driver",
            "company",
        )
        # exclude = ("password_hash",)  # Exclude sensitive fields
        unknown = EXCLUDE  # Ignore unknown fields during deserialization

    @post_load
    def make_user(self, data, **kwargs):
        """Convert role string back to UserRole enum before creating a User instance."""
        if "role" in data and isinstance(data["role"], str):
            data["role"] = UserRole(data["role"])
        return data