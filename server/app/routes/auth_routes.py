from flask import Blueprint, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, jwt_required, get_jwt_identity, create_access_token
from flasgger import swag_from
from server.app.models import User
from server.app.services.auth_service import register_user, login_user, logout_user

# Create Blueprint for auth routes
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
api = Api(auth_bp)  # Attach Flask-RESTful API to the Blueprint

class SignupResource(Resource):
    @swag_from({
        'tags': ['auth'],
        'description': 'Register a new user',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'fullname': {'type': 'string'},
                        'username': {'type': 'string'},
                        'email': {'type': 'string'},
                        'phone_number': {'type': 'string'},
                        'password': {'type': 'string'},
                        'picture': {'type': 'string', 'description': 'Base64 encoded image (optional)'},
                        'role': {'type': 'string', 'description': 'User role (default: "user")'}
                    },
                    'required': ['fullname', 'username', 'email', 'phone_number', 'password']
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'User registered successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'},
                        'token': {'type': 'string'}
                    }
                }
            },
            '400': {
                'description': 'Invalid input or missing fields'
            },
            '409': {
                'description': 'Username or email already exists'
            }
        }
    })
    def post(self):
        """Register a new user."""
        data = request.get_json()  # Ensure JSON parsing
        if not data:
            return {"error": "Invalid or missing JSON body"}, 400

        return register_user(data)


class LoginResource(Resource):
    @swag_from({
        'tags': ['auth'],
        'description': 'Login an existing user',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'username': {'type': 'string'},
                        'password': {'type': 'string'}
                    },
                    'required': ['username', 'password']
                }
            }
        ],
        'responses': {
            '200': {
                'description': 'Login successful',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'},
                        'token': {'type': 'string'}
                    }
                }
            },
            '401': {
                'description': 'Invalid credentials'
            }
        }
    })
    def post(self):
        """Login an existing user."""
        data = request.get_json()
        return login_user(data)

class MeResource(Resource):
    @swag_from({
        'tags': ['auth'],
        'description': 'Get details of the currently logged-in user',
        'security': [{'BearerAuth': []}],  # Requires JWT authentication
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
            '401': {
                'description': 'Unauthorized (missing or invalid token)'
            },
            '404': {
                'description': 'User not found'
            }
        }
    })
    @jwt_required()  # Enforces JWT authentication
    def get(self):
        """Get current logged-in user."""
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return {"error": "User not found"}, 404

        return {
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "email": user.email,
            "role": user.role.value,
            "picture": user.picture,
        }, 200
class LogoutResource(Resource):
    @swag_from({
        'tags': ['auth'],
        'description': 'Logout the current user',
        'security': [{'BearerAuth': []}],  # Requires JWT authentication
        'responses': {
            '200': {
                'description': 'User logged out successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '401': {
                'description': 'Unauthorized (missing or invalid token)'
            }
        }
    })
    @jwt_required()  # Enforces JWT authentication
    def post(self):
        """Logout the current user."""
        return logout_user()
    


    @jwt_required(refresh=True)
    def refresh_token():
        current_user_id = get_jwt_identity()
        new_token = create_access_token(identity=current_user_id)
        return jsonify({"token": new_token}), 200
    
        






# Register resources with Flask-RESTful API
api.add_resource(SignupResource, "/signup")
api.add_resource(LoginResource, "/login")
api.add_resource(MeResource, "/me")
api.add_resource(LogoutResource, "/logout")