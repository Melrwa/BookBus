import cloudinary.uploader
from server.app import db
from server.app.models import User, UserRole

def register_user(data):
    """Handles user registration and Cloudinary image upload"""
    if User.query.filter_by(username=data["username"]).first():
        return {"error": "Username already taken"}, 400

    if User.query.filter_by(email=data["email"]).first():
        return {"error": "Email already registered"}, 400

    # Handle Cloudinary Image Upload
    picture_url = None
    if "picture" in data:
        upload_result = cloudinary.uploader.upload(data["picture"])
        picture_url = upload_result["secure_url"]

    # Create user
    new_user = User(
        fullname=data["fullname"],
        username=data["username"],
        email=data["email"],
        phone_number=data["phone_number"],
        picture=picture_url,  # Store Cloudinary URL
        role=UserRole.USER,
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return {"message": "User registered", "token": new_user.generate_token()}, 201


def login_user(data):
    """Handles user login"""
    user = User.query.filter_by(username=data["username"]).first()
    if not user or not user.check_password(data["password"]):
        return {"error": "Invalid credentials"}, 401

    return {"message": "Login successful", "token": user.generate_token()}, 200
