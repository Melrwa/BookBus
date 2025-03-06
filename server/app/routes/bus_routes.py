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
                'name': 'image_url',
                'in': 'formData',
                'type': 'string',
                'required': False,
                'description': 'Bus image URL'
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
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)

        try:
            data = request.get_json()
            if not data:
                return {"error": "No data provided"}, 400

            required_fields = ["bus_number", "capacity", "route"]
            if not all(field in data for field in required_fields):
                return {"error": "Missing required fields"}, 400

            bus = add_bus_service(data, current_user)
            return bus, 201
        except ValueError as err:
            return {"error": str(err)}, 403  # Unauthorized
        except Exception as e:
            return {"error": str(e)}, 500

# Register the BusResource class



    @jwt_required()
    def put(self, bus_id):
        """Update a bus by ID."""
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)

        try:
            data = request.get_json()
            if not data:
                return {"error": "No data provided"}, 400

            bus = update_bus_service(bus_id, data, current_user)
            if not bus:
                return {"error": "Bus not found"}, 404
            return bus, 200
        except ValueError as err:
            return {"error": str(err)}, 403  # Unauthorized
        except Exception as e:
            return {"error": str(e)}, 500
        

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

        # Allow only admins and drivers to delete buses
        if not current_user or current_user.role not in [UserRole.ADMIN, UserRole.DRIVER]:
            return {"error": "Unauthorized. Only admins and drivers can delete buses."}, 403

        # Proceed with deleting the bus
        success = delete_bus_service(bus_id)
        if not success:
            return {"error": "Bus not found"}, 404
        return {"message": "Bus deleted successfully"}, 200


class BusListResource(Resource):       
    @swag_from({
    'tags': ['buses'],
    'description': 'Get all buses',
    'parameters': [
        {
            'name': 'page',
            'in': 'query',
            'type': 'integer',
            'required': False,
            'description': 'Page number'
        },
        {
            'name': 'per_page',
            'in': 'query',
            'type': 'integer',
            'required': False,
            'description': 'Number of buses per page'
        }
    ],
    'responses': {
        '200': {
            'description': 'List of all buses',
            'schema': {
                'type': 'object',
                'properties': {
                    'buses': {
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
                    },
                    'total_pages': {'type': 'integer'},
                    'current_page': {'type': 'integer'},
                    'total_buses': {'type': 'integer'}
                }
            }
        }
    }
})
    @jwt_required()
    def get(self):
        """Get all buses (admin and drivers only)."""
        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)

        # Allow only admins and drivers to access this resource
        if not current_user or current_user.role not in [UserRole.ADMIN, UserRole.DRIVER]:
            return {"error": "Unauthorized. Only admins and drivers can access this resource."}, 403

        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        buses = get_all_buses_service(page, per_page)
        return buses, 200
    
# Register the BusListResource class
api.add_resource(BusResource,  "/")
   
 