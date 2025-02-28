import cloudinary.uploader
from server.app import db
from server.app.models import User, UserRole, TokenBlacklist
import re
from flask_jwt_extended import get_jwt

from server.app.models.driver import Driver

def is_valid_phone_number(phone):
    """Validates phone number format (digits only, 10-15 characters)"""
    return bool(re.fullmatch(r"^\d{10,15}$", phone))
def register_user(data):
    """Handles user registration and Cloudinary image upload."""
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

    # Use the image URL provided by the frontend
    picture_url = data.get("picture")

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

    # If the user is a driver, create a driver record
    if new_user.role == UserRole.DRIVER:
        driver_data = data.get("driverDetails", {})
        new_driver = Driver(
            dob=driver_data.get("dob"),
            gender=driver_data.get("gender"),
            license_number=driver_data.get("licenseNumber"),
            accident_record=driver_data.get("accidentRecord"),
            years_of_experience=driver_data.get("experience"),
            user_id=new_user.id,
        )
        db.session.add(new_driver)
        db.session.commit()

    return {"message": "User registered", "token": new_user.generate_token()}, 201

def login_user(data):
    """Handles user login"""
    user = User.query.filter_by(username=data["username"]).first()
    if not user or not user.check_password(data["password"]):
        return {"error": "Invalid credentials"}, 401

    return {"message": "Login successful", "token": user.generate_token()}, 200

def logout_user():
    """Logout the current user by blacklisting their token."""
    jti = get_jwt()["jti"]  # Get the JWT ID (unique identifier for the token)

    # Check if the token is already blacklisted
    if TokenBlacklist.query.filter_by(jti=jti).first():
        return {"message": "Token is already blacklisted"}, 200

    # Add the token to the blacklist
    blacklisted_token = TokenBlacklist(jti=jti)
    db.session.add(blacklisted_token)
    db.session.commit()
    return {"message": "Successfully logged out"}, 200