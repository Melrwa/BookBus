from flask import Blueprint
from flask_restful import Api, Resource
from app.models.user import User

user_bp = Blueprint("user", __name__, url_prefix="/api/users") 
api = Api(user_bp)

class UserResource(Resource):
    def get(self, user_id):
        """Fetch a single user by ID."""
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        return user.to_dict(), 200  # Use SerializerMixin

class UserListResource(Resource):
    def get(self):
        """Fetch all users."""
        users = User.query.all()
        return [user.to_dict() for user in users], 200  # Serialize list of users

# Add resources to the API
api.add_resource(UserListResource, "/")
api.add_resource(UserResource, "/<int:user_id>")
