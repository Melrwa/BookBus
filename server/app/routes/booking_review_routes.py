# server/app/routes/booking_review_routes.py
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from server.app.models import UserRole, BookingReview, User
from server.app.services.booking_review_service import (
    add_booking_review_service,
    get_booking_review_by_id_service,
    get_all_booking_reviews_service,
    delete_booking_review_service
)

# Define the Blueprint
booking_review_bp = Blueprint("booking_review", __name__, url_prefix="/booking_reviews")

# Initialize Api with the Blueprint
api = Api(booking_review_bp)

class BookingReviewResource(Resource):
    @swag_from({
        'tags': ['booking_reviews'],
        'description': 'Get a booking review by ID',
        'parameters': [
            {
                'name': 'review_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the booking review to retrieve'
            }
        ],
        'responses': {
            '200': {
                'description': 'Booking review details retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'booking_id': {'type': 'integer'},
                        'review': {'type': 'string'},
                        'alert': {'type': 'boolean'},
                        'created_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            },
            '404': {
                'description': 'Booking review not found'
            }
        }
    })
    @jwt_required()
    def get(self, review_id):
        """Get a booking review by ID."""
        review = get_booking_review_by_id_service(review_id)
        if not review:
            return {"error": "Booking review not found"}, 404
        return review, 200

    @swag_from({
        'tags': ['booking_reviews'],
        'description': 'Delete a booking review by ID',
        'parameters': [
            {
                'name': 'review_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the booking review to delete'
            }
        ],
        'responses': {
            '200': {
                'description': 'Booking review deleted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'Booking review not found'
            }
        }
    })
    @jwt_required()
    def delete(self, review_id):
        """Delete a booking review by ID."""
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        
        # Fetch the user from the database (assuming you have a User model)
        current_user = User.query.get(user_id)
        
        if not current_user:
            return {"error": "User not found"}, 404
        
        # Check if the user is an admin or the owner of the booking
        review = BookingReview.query.get(review_id)
        if not review:
            return {"error": "Booking review not found"}, 404
        
        if current_user.role != UserRole.ADMIN and review.booking.user_id != current_user.id:
            return {"error": "Unauthorized. Only admins or the booking owner can delete reviews."}, 403

        # Proceed with deleting the review
        success = delete_booking_review_service(review_id)
        if not success:
            return {"error": "Booking review not found"}, 404
        return {"message": "Booking review deleted successfully"}, 200

class BookingReviewListResource(Resource):
    @swag_from({
        'tags': ['booking_reviews'],
        'description': 'Get all booking reviews with pagination',
        'parameters': [
            {
                'name': 'page',
                'in': 'query',
                'type': 'integer',
                'required': False,
                'description': 'Page number (default: 1)'
            },
            {
                'name': 'per_page',
                'in': 'query',
                'type': 'integer',
                'required': False,
                'description': 'Number of items per page (default: 10)'
            }
        ],
        'responses': {
            '200': {
                'description': 'List of booking reviews retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'reviews': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'id': {'type': 'integer'},
                                    'booking_id': {'type': 'integer'},
                                    'review': {'type': 'string'},
                                    'alert': {'type': 'boolean'},
                                    'created_at': {'type': 'string', 'format': 'date-time'}
                                }
                            }
                        },
                        'total_pages': {'type': 'integer'},
                        'current_page': {'type': 'integer'},
                        'total_items': {'type': 'integer'}
                    }
                }
            }
        }
    })
    @jwt_required()
    def get(self):
        """Get all booking reviews with pagination."""
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        reviews = get_all_booking_reviews_service(page=page, per_page=per_page)
        return reviews, 200

    @swag_from({
        'tags': ['booking_reviews'],
        'description': 'Add a new booking review',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'booking_id': {'type': 'integer'},
                        'review': {'type': 'string'},
                        'alert': {'type': 'boolean'}
                    }
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'Booking review created successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'booking_id': {'type': 'integer'},
                        'review': {'type': 'string'},
                        'alert': {'type': 'boolean'},
                        'created_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            },
            '400': {
                'description': 'Validation error'
            }
        }
    })
    @jwt_required()
    def post(self):
        """Add a new booking review."""
        data = request.get_json()
        try:
            review = add_booking_review_service(data)
        except ValueError as err:
            return {"error": str(err)}, 400
        return review, 201

# Register Resources
# api.add_resource(BookingReviewResource, "/<int:review_id>")
# api.add_resource(BookingReviewListResource, "/")