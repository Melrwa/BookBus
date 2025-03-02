from flask import Blueprint, jsonify, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from server.app.services.auth_service import register_user, login_user, logout_user, refresh_token, check_session, me_service

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
                        'role': {'type': 'string'}
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
    
    def options(self):
        """Handle preflight requests."""
        response = jsonify({"message": "Preflight request handled"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5001")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

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
    @jwt_required()
    def get(self):
        """Get details of the currently logged-in user."""
        return me_service()

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
    @jwt_required()
    def post(self):
        """Logout the current user."""
        return logout_user()

class RefreshTokenResource(Resource):
    @swag_from({
        'tags': ['auth'],
        'description': 'Refresh access token',
        'security': [{'BearerAuth': []}],
        'responses': {
            '200': {
                'description': 'Token refreshed successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'token': {'type': 'string'}
                    }
                }
            },
            '401': {
                'description': 'Unauthorized (missing or invalid token)'
            }
        }
    })
    @jwt_required(refresh=True)
    def post(self):
        """Refresh the access token."""
        return refresh_token()

class CheckSessionResource(Resource):
    @swag_from({
        'tags': ['auth'],
        'description': 'Check user session',
        'security': [{'BearerAuth': []}],
        'responses': {
            '200': {
                'description': 'Session is valid',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'role': {'type': 'string'}
                    }
                }
            },
            '401': {
                'description': 'Unauthorized (missing or invalid token)'
            }
        }
    })
    @jwt_required()
    def get(self):
        """Check if the user's session is still valid."""
        return check_session()

class Protected(Resource):
    @jwt_required()
    def get(self):  # Add self as the first parameter
        user_id = get_jwt_identity()
        return{"message": f"Hello, user {user_id}!"}, 200

# Register resources with Flask-RESTful API
api.add_resource(SignupResource, "/signup")
api.add_resource(LoginResource, "/login")
api.add_resource(MeResource, "/me")
api.add_resource(LogoutResource, "/logout")
api.add_resource(RefreshTokenResource, "/refresh")
api.add_resource(CheckSessionResource, "/check-session")
api.add_resource(Protected, "/protected")  # Protected route for testing