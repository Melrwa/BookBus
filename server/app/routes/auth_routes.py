from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app.models import User
from server.app.services.auth_service import register_user, login_user

# Create Blueprint for auth routes
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
api = Api(auth_bp)  # Attach Flask-RESTful API to the Blueprint

class SignupResource(Resource):
    def post(self):
        """User Signup with Cloudinary Image Upload"""
        data = request.form.to_dict()
        if "picture" in request.files:
            data["picture"] = request.files["picture"]
        return register_user(data)


class LoginResource(Resource):
    def post(self):
        """User Login"""
        data = request.get_json()
        return login_user(data)


class MeResource(Resource):
    @jwt_required()
    def get(self):
        """Get current logged-in user"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
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

# Register resources with Flask-RESTful API
api.add_resource(SignupResource, "/signup")
api.add_resource(LoginResource, "/login")
api.add_resource(MeResource, "/me")
