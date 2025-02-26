# server/app/routes/booking_routes.py
from server.app.models.booking import Booking
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from server.app.models import UserRole, User
from server.app.services.booking_service import (
    add_booking_service,
    get_booking_by_id_service,
    get_all_bookings_service,
    delete_booking_service
)

# Define the Blueprint
booking_bp = Blueprint("booking", __name__, url_prefix="/bookings")

# Initialize Api with the Blueprint
api = Api(booking_bp)

class BookingResource(Resource):
    @swag_from({
        'tags': ['bookings'],
        'description': 'Get a booking by ID',
        'parameters': [
            {
                'name': 'booking_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the booking to retrieve'
            }
        ],
        'responses': {
            '200': {
                'description': 'Booking details retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'},
                        'schedule_id': {'type': 'integer'},
                        'seat_numbers': {'type': 'string'},
                        'origin': {'type': 'string'},
                        'destination': {'type': 'string'},
                        'departure_time': {'type': 'string', 'format': 'date-time'},
                        'arrival_time': {'type': 'string', 'format': 'date-time'},
                        'amount_paid': {'type': 'number'},
                        'is_vip': {'type': 'boolean'}
                    }
                }
            },
            '404': {
                'description': 'Booking not found'
            }
        }
    })
    @jwt_required()
    def get(self, booking_id):
        """Get a booking by ID."""
        booking = get_booking_by_id_service(booking_id)
        if not booking:
            return {"error": "Booking not found"}, 404
        return booking, 200  # Already serialized by the service

    @swag_from({
        'tags': ['bookings'],
        'description': 'Delete a booking by ID',
        'parameters': [
            {
                'name': 'booking_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the booking to delete'
            }
        ],
        'responses': {
            '200': {
                'description': 'Booking deleted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'Booking not found'
            }
        }
    })
    @jwt_required()
    def delete(self, booking_id):
        """Delete a booking by ID."""
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        
        # Fetch the user from the database
        current_user = User.query.get(user_id)
        
        if not current_user:
            return {"error": "User not found"}, 404
        
        # Check if the user is an admin or the owner of the booking
        booking = Booking.query.get(booking_id)
        if not booking:
            return {"error": "Booking not found"}, 404
        
        if current_user.role != UserRole.ADMIN and booking.user_id != current_user.id:
            return {"error": "Unauthorized. Only admins or the booking owner can delete bookings."}, 403

        # Proceed with deleting the booking
        success = delete_booking_service(booking_id)
        if not success:
            return {"error": "Booking not found"}, 404
        return {"message": "Booking deleted successfully"}, 200

class BookingListResource(Resource):
    @swag_from({
        'tags': ['bookings'],
        'description': 'Get all bookings with pagination',
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
                'description': 'List of bookings retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'bookings': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'id': {'type': 'integer'},
                                    'user_id': {'type': 'integer'},
                                    'bus_id': {'type': 'integer'},
                                    'schedule_id': {'type': 'integer'},
                                    'seat_numbers': {'type': 'string'},
                                    'origin': {'type': 'string'},
                                    'destination': {'type': 'string'},
                                    'departure_time': {'type': 'string', 'format': 'date-time'},
                                    'arrival_time': {'type': 'string', 'format': 'date-time'},
                                    'amount_paid': {'type': 'number'},
                                    'is_vip': {'type': 'boolean'}
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
        """Get all bookings with pagination."""
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        bookings = get_all_bookings_service(page=page, per_page=per_page)
        return bookings, 200

    @swag_from({
        'tags': ['bookings'],
        'description': 'Add a new booking',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'user_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'},
                        'schedule_id': {'type': 'integer'},
                        'seat_numbers': {'type': 'string'},
                        'origin': {'type': 'string'},
                        'destination': {'type': 'string'},
                        'departure_time': {'type': 'string', 'format': 'date-time'},
                        'arrival_time': {'type': 'string', 'format': 'date-time'},
                        'amount_paid': {'type': 'number'},
                        'is_vip': {'type': 'boolean'}
                    }
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'Booking created successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'},
                        'schedule_id': {'type': 'integer'},
                        'seat_numbers': {'type': 'string'},
                        'origin': {'type': 'string'},
                        'destination': {'type': 'string'},
                        'departure_time': {'type': 'string', 'format': 'date-time'},
                        'arrival_time': {'type': 'string', 'format': 'date-time'},
                        'amount_paid': {'type': 'number'},
                        'is_vip': {'type': 'boolean'}
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
        """Add a new booking."""
        data = request.get_json()
        try:
            booking = add_booking_service(data)
        except ValueError as err:
            return {"error": str(err)}, 400
        return booking, 201

# Register Resources
# api.add_resource(BookingResource, "/<int:booking_id>")
# api.add_resource(BookingListResource, "/")