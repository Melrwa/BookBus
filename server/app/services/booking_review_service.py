# server/app/services/booking_review_service.py
from server.app.models import BookingReview
from server.app import db
from server.app.schemas.booking_review_schema import booking_review_schema, booking_reviews_schema
from marshmallow import ValidationError

def add_booking_review_service(data):
    """Add a new booking review."""
    try:
        # Deserialize the input data into a BookingReview instance
        booking_review = booking_review_schema.load(data, session=db.session)
    except ValidationError as err:
        raise ValueError(err.messages)

    # Add the review to the database
    db.session.add(booking_review)
    db.session.commit()

    # Serialize the review into a dictionary
    serialized_review = booking_review_schema.dump(booking_review)
    return serialized_review

def get_booking_review_by_id_service(review_id):
    """Get a booking review by its ID."""
    review = BookingReview.query.get(review_id)
    if not review:
        return None
    return booking_review_schema.dump(review)  # Serialize the review

def get_all_booking_reviews_service(page=1, per_page=10):
    """Get all booking reviews with pagination."""
    reviews = BookingReview.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "reviews": booking_reviews_schema.dump(reviews.items),
        "total_pages": reviews.pages,
        "current_page": reviews.page,
        "total_items": reviews.total
    }

def delete_booking_review_service(review_id):
    """Delete a booking review."""
    review = BookingReview.query.get(review_id)
    if not review:
        return False

    # Delete the review
    db.session.delete(review)
    db.session.commit()
    return True