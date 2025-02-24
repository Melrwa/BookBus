from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from server.app.models import UserRole, User
from server.app.services.bus_service import (
    get_bus_by_id_service,
    get_all_buses_service,
    add_bus_service,
    update_bus_service,
    delete_bus_service
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
        return bus, 200  # Already serialized by the service

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
        
        # Fetch the user from the database
        current_user = User.query.get(user_id)
        
        if not current_user:
            return {"error": "User not found"}, 404
        
        # Debug print to check the role
        print(f"Current user role: {current_user.role}")
        
        # Check if the user is an admin
        if current_user.role != UserRole.ADMIN:
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
        """Delete a bus by ID."""
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        
        # Fetch the user from the database
        current_user = User.query.get(user_id)
        
        if not current_user:
            return {"error": "User not found"}, 404
        
        # Debug print to check the role
        print(f"Current user role: {current_user.role}")
        
        # Check if the user is an admin
        if current_user.role != UserRole.ADMIN:
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
        """Get all buses."""
        buses = get_all_buses_service()
        return buses, 200  # Already serialized by the service

    @swag_from({
        'tags': ['buses'],
        'description': 'Add a new bus',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'bus_number': {'type': 'string'},
                        'capacity': {'type': 'integer'},
                        'route': {'type': 'string'},
                        'company_id': {'type': 'integer'}
                    }
                }
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
                        'company_id': {'type': 'integer'}
                    }
                }
            }
        }
    })

    @jwt_required()
    def post(self):
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        
        # Fetch the user from the database
        current_user = User.query.get(user_id)
        
        if not current_user:
            return {"error": "User not found"}, 404
        
        # Debug print to check the role
        print(f"Current user role: {current_user.role}")
        
        # Check if the user is an admin
        if current_user.role != UserRole.ADMIN:
            return {"error": "Unauthorized. Only admins can add buses."}, 403

        # Proceed with adding the bus
        data = request.get_json()
        try:
            bus = add_bus_service(data)
        except ValueError as err:
            return {"error": str(err)}, 400

        return bus, 201



# # Register Resources
# api.add_resource(BusResource, "/<int:bus_id>")
# api.add_resource(BusListResource, "/")