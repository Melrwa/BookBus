from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from server.app.models import UserRole
from server.app.services.schedule_service import (
    get_schedule_by_id_service,
    get_all_schedules_service,
    add_schedule_service,
    update_schedule_service,
    delete_schedule_service,
    search_schedules_service
)

# Define the Blueprint
schedule_bp = Blueprint("schedule", __name__, url_prefix="/schedules")

# Initialize Api with the Blueprint
api = Api(schedule_bp)

class ScheduleResource(Resource):
    @swag_from({
        'tags': ['schedules'],
        'description': 'Get a schedule by ID',
        'parameters': [
            {
                'name': 'schedule_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the schedule to retrieve'
            }
        ],
        'responses': {
            '200': {
                'description': 'Schedule details retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'departure_time': {'type': 'string', 'format': 'date-time'},
                        'arrival_time': {'type': 'string', 'format': 'date-time'},
                        'origin': {'type': 'string'},
                        'destination': {'type': 'string'},
                        'vip_price': {'type': 'number'},
                        'business_price': {'type': 'number'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            },
            '404': {
                'description': 'Schedule not found'
            }
        }
    })
    @jwt_required()
    def get(self, schedule_id):
        """Get a schedule by ID."""
        schedule = get_schedule_by_id_service(schedule_id)
        if not schedule:
            return {"error": "Schedule not found"}, 404
        return schedule, 200

    @swag_from({
        'tags': ['schedules'],
        'description': 'Update a schedule by ID',
        'parameters': [
            {
                'name': 'schedule_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the schedule to update'
            },
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'departure_time': {'type': 'string', 'format': 'date-time'},
                        'arrival_time': {'type': 'string', 'format': 'date-time'},
                        'origin': {'type': 'string'},
                        'destination': {'type': 'string'},
                        'vip_price': {'type': 'number'},
                        'business_price': {'type': 'number'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            }
        ],
        'responses': {
            '200': {
                'description': 'Schedule updated successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'departure_time': {'type': 'string', 'format': 'date-time'},
                        'arrival_time': {'type': 'string', 'format': 'date-time'},
                        'origin': {'type': 'string'},
                        'destination': {'type': 'string'},
                        'vip_price': {'type': 'number'},
                        'business_price': {'type': 'number'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            },
            '404': {
                'description': 'Schedule not found'
            }
        }
    })
    @jwt_required()
    def put(self, schedule_id):
        """Update a schedule by ID."""
        current_user = get_jwt_identity()
        if current_user['role'] != UserRole.ADMIN.value:
            return {"error": "Unauthorized. Only admins can update schedules."}, 403

        data = request.get_json()
        try:
            schedule = update_schedule_service(schedule_id, data)
        except ValueError as err:
            return {"error": str(err)}, 400

        if not schedule:
            return {"error": "Schedule not found"}, 404
        return schedule, 200

    @swag_from({
        'tags': ['schedules'],
        'description': 'Delete a schedule by ID',
        'parameters': [
            {
                'name': 'schedule_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the schedule to delete'
            }
        ],
        'responses': {
            '200': {
                'description': 'Schedule deleted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'Schedule not found'
            }
        }
    })
    @jwt_required()
    def delete(self, schedule_id):
        """Delete a schedule by ID."""
        current_user = get_jwt_identity()
        if current_user['role'] != UserRole.ADMIN.value:
            return {"error": "Unauthorized. Only admins can delete schedules."}, 403

        success = delete_schedule_service(schedule_id)
        if not success:
            return {"error": "Schedule not found"}, 404
        return {"message": "Schedule deleted successfully"}, 200

class ScheduleListResource(Resource):
    @swag_from({
        'tags': ['schedules'],
        'description': 'Get all schedules',
        'responses': {
            '200': {
                'description': 'List of all schedules',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'departure_time': {'type': 'string', 'format': 'date-time'},
                            'arrival_time': {'type': 'string', 'format': 'date-time'},
                            'origin': {'type': 'string'},
                            'destination': {'type': 'string'},
                            'vip_price': {'type': 'number'},
                            'business_price': {'type': 'number'},
                            'bus_id': {'type': 'integer'}
                        }
                    }
                }
            }
        }
    })
    @jwt_required()
    def get(self):
        """Get all schedules."""
        schedules = get_all_schedules_service()
        return schedules, 200

    @swag_from({
        'tags': ['schedules'],
        'description': 'Add a new schedule',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'departure_time': {'type': 'string', 'format': 'date-time'},
                        'arrival_time': {'type': 'string', 'format': 'date-time'},
                        'origin': {'type': 'string'},
                        'destination': {'type': 'string'},
                        'vip_price': {'type': 'number'},
                        'business_price': {'type': 'number'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'Schedule created successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'departure_time': {'type': 'string', 'format': 'date-time'},
                        'arrival_time': {'type': 'string', 'format': 'date-time'},
                        'origin': {'type': 'string'},
                        'destination': {'type': 'string'},
                        'vip_price': {'type': 'number'},
                        'business_price': {'type': 'number'},
                        'bus_id': {'type': 'integer'}
                    }
                }
            }
        }
    })
    @jwt_required()
    def post(self):
        """Add a new schedule."""
        current_user = get_jwt_identity()
        if current_user['role'] != UserRole.ADMIN.value:
            return {"error": "Unauthorized. Only admins can add schedules."}, 403

        data = request.get_json()
        try:
            schedule = add_schedule_service(data)
        except ValueError as err:
            return {"error": str(err)}, 400

        return schedule, 201

class SearchSchedulesResource(Resource):
    @swag_from({
        'tags': ['schedules'],
        'description': 'Search schedules by origin, destination, and date',
        'parameters': [
            {
                'name': 'origin',
                'in': 'query',
                'type': 'string',
                'required': True,
                'description': 'Origin of the schedule'
            },
            {
                'name': 'destination',
                'in': 'query',
                'type': 'string',
                'required': True,
                'description': 'Destination of the schedule'
            },
            {
                'name': 'date',
                'in': 'query',
                'type': 'string',
                'format': 'date',
                'required': True,
                'description': 'Date of the schedule (YYYY-MM-DD)'
            }
        ],
        'responses': {
            '200': {
                'description': 'List of matching schedules',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'departure_time': {'type': 'string', 'format': 'date-time'},
                            'arrival_time': {'type': 'string', 'format': 'date-time'},
                            'origin': {'type': 'string'},
                            'destination': {'type': 'string'},
                            'vip_price': {'type': 'number'},
                            'business_price': {'type': 'number'},
                            'bus_id': {'type': 'integer'}
                        }
                    }
                }
            }
        }
    })
    @jwt_required()
    def get(self):
        """Search schedules by origin, destination, and date."""
        origin = request.args.get('origin')
        destination = request.args.get('destination')
        date = request.args.get('date')

        if not origin or not destination or not date:
            return {"error": "Origin, destination, and date are required."}, 400

        schedules = search_schedules_service(origin, destination, date)
        return schedules, 200

# Register Resources
# api.add_resource(ScheduleResource, "/<int:schedule_id>")
# api.add_resource(ScheduleListResource, "/")
# api.add_resource(SearchSchedulesResource, "/search")