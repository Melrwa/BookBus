# server/app/schemas/booking_review_schema.py
from marshmallow import Schema, fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.app.models.booking_review import BookingReview

class BookingReviewSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = BookingReview
        include_fk = True  # Include foreign keys in the schema
        load_instance = True  # Automatically create BookingReview instances when loading

    # Custom validations
    review = fields.Str(required=True, validate=validate.Length(min=1, max=500))  # Limit review length
    alert = fields.Bool(required=False, default=False)
    created_at = fields.DateTime(dump_only=True)  # Automatically set on creation, not required in input

# Initialize the schema
booking_review_schema = BookingReviewSchema()
booking_reviews_schema = BookingReviewSchema(many=True)  # For serializing multiple reviews