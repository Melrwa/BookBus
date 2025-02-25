# server/app/routes/driver_routes.py
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from server.app.models import UserRole, User
from server.app.services.driver_service import (
    add_driver_service,
    get_driver_by_id_service,
    get_all_drivers_service,
    update_driver_service,
    delete_driver_service
)

# Define the Blueprint
driver_bp = Blueprint("driver", __name__, url_prefix="/drivers")

# Initialize Api with the Blueprint
api = Api(driver_bp)

def check_admin_permission():
    """Check if the current user is an admin."""
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)
    
    if not current_user:
        return {"error": "User not found"}, 404
    
    if current_user.role != UserRole.ADMIN:
        return {"error": "Unauthorized. Only admins can perform this action."}, 403
    
    return None

class DriverResource(Resource):
    @swag_from({
        'tags': ['drivers'],
        'description': 'Get a driver by ID',
        'parameters': [
            {
                'name': 'driver_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the driver to retrieve'
            }
        ],
        'responses': {
            '200': {
                'description': 'Driver details retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'dob': {'type': 'string', 'format': 'date'},
                        'gender': {'type': 'string'},
                        'license_number': {'type': 'string'},
                        'accident_record': {'type': 'integer'},
                        'years_of_experience': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            },
            '404': {
                'description': 'Driver not found'
            }
        }
    })
    @jwt_required()
    def get(self, driver_id):
        """Get a driver by ID."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        driver = get_driver_by_id_service(driver_id)
        if not driver:
            return {"error": "Driver not found"}, 404
        return driver, 200  # Already serialized by the service

    @swag_from({
        'tags': ['drivers'],
        'description': 'Update a driver by ID',
        'parameters': [
            {
                'name': 'driver_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the driver to update'
            },
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string'},
                        'dob': {'type': 'string', 'format': 'date'},
                        'gender': {'type': 'string'},
                        'license_number': {'type': 'string'},
                        'accident_record': {'type': 'integer'},
                        'years_of_experience': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            }
        ],
        'responses': {
            '200': {
                'description': 'Driver updated successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'dob': {'type': 'string', 'format': 'date'},
                        'gender': {'type': 'string'},
                        'license_number': {'type': 'string'},
                        'accident_record': {'type': 'integer'},
                        'years_of_experience': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            },
            '404': {
                'description': 'Driver not found'
            }
        }
    })
    @jwt_required()
    def put(self, driver_id):
        """Update a driver by ID."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        data = request.get_json()
        try:
            driver = update_driver_service(driver_id, data)
        except ValueError as err:
            return {"error": str(err)}, 400

        if not driver:
            return {"error": "Driver not found"}, 404
        return driver, 200

    @swag_from({
        'tags': ['drivers'],
        'description': 'Delete a driver by ID',
        'parameters': [
            {
                'name': 'driver_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the driver to delete'
            }
        ],
        'responses': {
            '200': {
                'description': 'Driver deleted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'Driver not found'
            }
        }
    })
    @jwt_required()
    def delete(self, driver_id):
        """Delete a driver by ID."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        # Proceed with deleting the driver
        success = delete_driver_service(driver_id)
        if not success:
            return {"error": "Driver not found"}, 404
        return {"message": "Driver deleted successfully"}, 200

class DriverListResource(Resource):
    @swag_from({
        'tags': ['drivers'],
        'description': 'Get all drivers with pagination',
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
                'description': 'List of drivers retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'drivers': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'id': {'type': 'integer'},
                                    'name': {'type': 'string'},
                                    'dob': {'type': 'string', 'format': 'date'},
                                    'gender': {'type': 'string'},
                                    'license_number': {'type': 'string'},
                                    'accident_record': {'type': 'integer'},
                                    'years_of_experience': {'type': 'integer'},
                                    'user_id': {'type': 'integer'},
                                    'bus_id': {'type': 'integer'}
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
        """Get all drivers with pagination."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        drivers = get_all_drivers_service(page=page, per_page=per_page)
        return drivers, 200

    @swag_from({
        'tags': ['drivers'],
        'description': 'Add a new driver',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string'},
                        'dob': {'type': 'string', 'format': 'date'},
                        'gender': {'type': 'string'},
                        'license_number': {'type': 'string'},
                        'accident_record': {'type': 'integer'},
                        'years_of_experience': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'Driver created successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'dob': {'type': 'string', 'format': 'date'},
                        'gender': {'type': 'string'},
                        'license_number': {'type': 'string'},
                        'accident_record': {'type': 'integer'},
                        'years_of_experience': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'}
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
        """Add a new driver."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        data = request.get_json()
        try:
            driver = add_driver_service(data)
        except ValueError as err:
            return {"error": str(err)}, 400
        return driver, 201

# Register Resources
