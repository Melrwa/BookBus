import cloudinary.uploader
from server.app import db
from server.app.models import User, UserRole
import re

def is_valid_phone_number(phone):
    """Validates phone number format (digits only, 10-15 characters)"""
    return bool(re.fullmatch(r"^\d{10,15}$", phone))

def register_user(data):
    """Handles user registration and Cloudinary image upload"""
    if not data:
        return {"error": "No data received"}, 400

    required_fields = ["fullname", "username", "email", "phone_number", "password"]
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return {"error": f"Missing fields: {', '.join(missing_fields)}"}, 400

    # Validate phone number
    if not is_valid_phone_number(data["phone_number"]):
        return {"error": "Invalid phone number. Must be 10-15 digits."}, 400

    if User.query.filter_by(username=data["username"]).first():
        return {"error": "Username already taken"}, 400

    if User.query.filter_by(email=data["email"]).first():
        return {"error": "Email already registered"}, 400

    # Handle Cloudinary Image Upload
    picture_url = None
    if "picture" in data and data["picture"]:
        try:
            upload_result = cloudinary.uploader.upload(data["picture"])
            picture_url = upload_result.get("secure_url")
        except Exception as e:
            return {"error": f"Image upload failed: {str(e)}"}, 400

    # Create user
    new_user = User(
        fullname=data["fullname"],
        username=data["username"],
        email=data["email"],
        phone_number=data["phone_number"],
        password=data["password"],  # This automatically hashes the password
        picture=picture_url,
        role=data.get("role", "user"),  # Ensure default role is 'user'
    )

    db.session.add(new_user)
    db.session.commit()

    return {"message": "User registered", "token": new_user.generate_token()}, 201


def login_user(data):
    """Handles user login"""
    user = User.query.filter_by(username=data["username"]).first()
    if not user or not user.check_password(data["password"]):
        return {"error": "Invalid credentials"}, 401

    return {"message": "Login successful", "token": user.generate_token()}, 200
