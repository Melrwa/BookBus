from flask import Blueprint, request
from flask_restful import Api, Resource
from server.app.models.user import User
from flask_jwt_extended import jwt_required
from flasgger import swag_from
from server.app.services.user_service import (
    get_user_by_id_service,
    get_all_users_service,
    delete_user_service,
    promote_to_admin_service
)

user_bp = Blueprint("user", __name__, url_prefix="/api/users")
api = Api(user_bp)

class UserResource(Resource):
    @swag_from({
        'tags': ['users'],
        'description': 'Get a user by ID',
        'parameters': [
            {
                'name': 'user_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the user to retrieve'
            }
        ],
        'responses': {
            '200': {
                'description': 'User details retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'fullname': {'type': 'string'},
                        'username': {'type': 'string'},
                        'email': {'type': 'string'},
                        'role': {'type': 'string'},
                        'picture': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'User not found'
            }
        }
    })
    @jwt_required()
    def get(self, user_id):
        """Get a user by ID."""
        user = get_user_by_id_service(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return user.to_dict(), 200

    @swag_from({
        'tags': ['users'],
        'description': 'Delete a user by ID',
        'parameters': [
            {
                'name': 'user_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the user to delete'
            }
        ],
        'responses': {
            '200': {
                'description': 'User deleted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'User not found'
            }
        }
    })
    @jwt_required()
    def delete(self, user_id):
        """Delete a user by ID."""
        success = delete_user_service(user_id)
        if not success:
            return {"error": "User not found"}, 404
        return {"message": "User deleted successfully"}, 200

class UserListResource(Resource):
    @swag_from({
        'tags': ['users'],
        'description': 'Get all users',
        'responses': {
            '200': {
                'description': 'List of all users',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'fullname': {'type': 'string'},
                            'username': {'type': 'string'},
                            'email': {'type': 'string'},
                            'role': {'type': 'string'},
                            'picture': {'type': 'string'}
                        }
                    }
                }
            }
        }
    })
    @jwt_required()
    def get(self):
        """Get all users."""
        users = get_all_users_service()
        return [user.to_dict() for user in users], 200

class PromoteUserResource(Resource):
    @swag_from({
        'tags': ['users'],
        'description': 'Promote a user to admin and attach them to a company',
        'parameters': [
            {
                'name': 'user_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the user to promote'
            },
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'company_id': {'type': 'integer'}
                    },
                    'required': ['company_id']
                }
            }
        ],
        'responses': {
            '200': {
                'description': 'User promoted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'fullname': {'type': 'string'},
                        'username': {'type': 'string'},
                        'email': {'type': 'string'},
                        'role': {'type': 'string'},
                        'picture': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'User not found'
            }
        }
    })
    @jwt_required()
    def post(self, user_id):
        """Promote a user to admin."""
        data = request.get_json()
        user = promote_to_admin_service(user_id, data.get('company_id'))
        if not user:
            return {"error": "User not found"}, 404
        return user, 200

api.add_resource(UserResource, "/<int:user_id>")
api.add_resource(UserListResource, "/")
api.add_resource(PromoteUserResource, "/<int:user_id>/promote")