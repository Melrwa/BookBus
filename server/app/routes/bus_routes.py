from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from flask_restful import Api, Resource
from server.app.models import UserRole, User
from server.app.services.bus_service import (
    get_bus_by_id_service,
    get_all_buses_service,
    add_bus_service,
    update_bus_service,
    delete_bus_service,
)

# Define the Blueprint
bus_bp = Blueprint("bus", __name__, url_prefix="/buses")

# Initialize Api with the Blueprint
api = Api(bus_bp)

class BusResource(Resource):
    @swag_from({
        'tags': ['buses'],
        'description': 'Get a bus by ID',
        'parameters': [
            {
                'name': 'bus_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the bus to retrieve'
            }
        ],
        'responses': {
            '200': {
                'description': 'Bus details retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'bus_number': {'type': 'string'},
                        'capacity': {'type': 'integer'},
                        'seats_available': {'type': 'integer'},
                        'route': {'type': 'string'},
                        'company_id': {'type': 'integer'}
                    }
                }
            },
            '404': {
                'description': 'Bus not found'
            }
        }
    })
    @jwt_required()
    def get(self, bus_id):
        """Get a bus by ID."""
        bus = get_bus_by_id_service(bus_id)
        if not bus:
            return {"error": "Bus not found"}, 404
        return bus, 200

    @swag_from({
        'tags': ['buses'],
        'description': 'Update a bus by ID',
        'parameters': [
            {
                'name': 'bus_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the bus to update'
            },
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'bus_number': {'type': 'string'},
                        'capacity': {'type': 'integer'},
                        'seats_available': {'type': 'integer'},
                        'route': {'type': 'string'},
                        'company_id': {'type': 'integer'}
                    }
                }
            }
        ],
        'responses': {
            '200': {
                'description': 'Bus updated successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'bus_number': {'type': 'string'},
                        'capacity': {'type': 'integer'},
                        'seats_available': {'type': 'integer'},
                        'route': {'type': 'string'},
                        'company_id': {'type': 'integer'}
                    }
                }
            },
            '404': {
                'description': 'Bus not found'
            }
        }
    })
    @jwt_required()
    def put(self, bus_id):
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        if not current_user or current_user.role != UserRole.ADMIN:
            return {"error": "Unauthorized. Only admins can update buses."}, 403

        # Proceed with updating the bus
        data = request.get_json()
        try:
            bus = update_bus_service(bus_id, data)
        except ValueError as err:
            return {"error": str(err)}, 400

        if not bus:
            return {"error": "Bus not found"}, 404
        return bus, 200

    @swag_from({
        'tags': ['buses'],
        'description': 'Delete a bus by ID',
        'parameters': [
            {
                'name': 'bus_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the bus to delete'
            }
        ],
        'responses': {
            '200': {
                'description': 'Bus deleted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'Bus not found'
            }
        }
    })
    @jwt_required()
    def delete(self, bus_id):
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        if not current_user or current_user.role != UserRole.ADMIN:
            return {"error": "Unauthorized. Only admins can delete buses."}, 403

        # Proceed with deleting the bus
        success = delete_bus_service(bus_id)
        if not success:
            return {"error": "Bus not found"}, 404
        return {"message": "Bus deleted successfully"}, 200


class BusListResource(Resource):
    @swag_from({
        'tags': ['buses'],
        'description': 'Get all buses',
        'responses': {
            '200': {
                'description': 'List of all buses',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'bus_number': {'type': 'string'},
                            'capacity': {'type': 'integer'},
                            'seats_available': {'type': 'integer'},
                            'route': {'type': 'string'},
                            'company_id': {'type': 'integer'}
                        }
                    }
                }
            }
        }
    })
    @jwt_required()
    def get(self):
        """Get all buses, filtered by the logged-in admin's company_id."""
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        if not current_user:
            return {"error": "User not found"}, 404

        buses = get_all_buses_service(current_user.company_id)
        return buses, 200

    @swag_from({
        'tags': ['buses'],
        'description': 'Add a new bus',
        'parameters': [
            {
                'name': 'bus_number',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Bus number'
            },
            {
                'name': 'capacity',
                'in': 'formData',
                'type': 'integer',
                'required': True,
                'description': 'Bus capacity'
            },
            {
                'name': 'route',
                'in': 'formData',
                'type': 'string',
                'required': True,
                'description': 'Bus route'
            },
            {
                'name': 'company_id',
                'in': 'formData',
                'type': 'integer',
                'required': True,
                'description': 'Company ID'
            },
            {
                'name': 'image',
                'in': 'formData',
                'type': 'file',
                'required': False,
                'description': 'Bus image'
            }
        ],
        'responses': {
            '201': {
                'description': 'Bus created successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'bus_number': {'type': 'string'},
                        'capacity': {'type': 'integer'},
                        'seats_available': {'type': 'integer'},
                        'route': {'type': 'string'},
                        'company_id': {'type': 'integer'},
                        'image_url': {'type': 'string'}
                    }
                }
            },
            '400': {
                'description': 'Validation error'
            },
            '403': {
                'description': 'Unauthorized. Only admins can add buses.'
            }
        }
    })
    @jwt_required()
    def post(self):
        """Add a new bus."""
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)
        if not current_user or current_user.role != UserRole.ADMIN:
            return {"error": "Unauthorized. Only admins can add buses."}, 403

        try:
            # Get form data
            bus_number = request.form.get("bus_number")
            capacity = request.form.get("capacity")
            route = request.form.get("route")
            company_id = request.form.get("company_id")

            # Handle file upload
            image_file = request.files.get("image")

            # Create the bus object
            bus_data = {
                "bus_number": bus_number,
                "capacity": int(capacity),
                "route": route,
                "company_id": int(company_id),
            }

            # Call the service function to add the bus
            bus = add_bus_service(bus_data, image_file)
            return bus, 201
        except ValueError as err:
            return {"error": str(err)}, 400
        except Exception as e:
            return {"error": str(e)}, 400