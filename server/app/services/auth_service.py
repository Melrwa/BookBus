
from server.app import db
from server.app.models import User, UserRole, TokenBlacklist, Company
import re
from flask import jsonify, make_response
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies

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
        company_id=data.get("company_id"),  # Optional company_id
    )

    db.session.add(new_user)
    db.session.commit()

    # If the user is a driver, create a driver record
    if new_user.role == UserRole.DRIVER:
        driver_data = data.get("driverDetails", {})
        if 'name' not in driver_data:
            driver_data['name'] = data['fullname']  # Use the user's fullname as the driver's name
        
        # Validate and convert years_of_experience to an integer
        years_of_experience = driver_data.get("experience")
        if years_of_experience is not None:
            try:
                years_of_experience = int(years_of_experience)
            except (ValueError, TypeError):
                return {"error": "Years of experience must be a valid integer."}, 400
        
        # Ensure years_of_experience is not negative
        if years_of_experience is not None and years_of_experience < 0:
            return {"error": "Years of experience cannot be negative."}, 400
        
        new_driver = Driver(
            name=driver_data['name'], 
            dob=driver_data.get("dob"),
            gender=driver_data.get("gender"),
            license_number=driver_data.get("licenseNumber"),
            accident_record=driver_data.get("accidentRecord"),
            years_of_experience=years_of_experience,  # Pass the validated value
            user_id=new_user.id,
        )
        db.session.add(new_driver)
        db.session.commit()

    # Generate tokens for the newly registered user
    access_token = create_access_token(identity=str(new_user.id))  # Convert to string
    refresh_token = create_refresh_token(identity=str(new_user.id))  # Convert to string

 # Create a response object
    response = make_response(jsonify({
        "message": "User registered successfully",
        "role": new_user.role.value,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "company_id": new_user.company_id,  # Include company_id in the response
            "company_name": new_user.company.name if new_user.company else None,  # Include company_name if available
        }
    }), 201)

    # Set the tokens in HTTP-only cookies
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    return response
   
def login_user(data):
    user = User.query.filter_by(username=data["username"]).first()
    if not user or not user.check_password(data["password"]):
        return {"error": "Invalid credentials"}, 401

    print("User company_id:", user.company_id)  # Debugging
    print("User company:", user.company)  # Debugging

    # Create access and refresh tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    # Create a response object
    response = make_response(jsonify({
        "message": "Login successful",
        "role": user.role.value,
        "user": {
            "id": user.id,
            "username": user.username,
            "company_id": user.company_id,  # Include company_id in the response
            "company_name": user.company.name if user.company else None,  # Include company_name if available
        }
    }), 200)

    # Set the tokens in HTTP-only cookies
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    return response


def logout_user():
    """Logout the current user by blacklisting their token."""
    jti = get_jwt()["jti"]  # Get the JWT ID (unique identifier for the token)

    # Check if the token is already blacklisted
    if TokenBlacklist.query.filter_by(jti=jti).first():
        print("Token already blacklisted:", jti)  # Debugging
        return {"message": "Token is already blacklisted"}, 200

    # Add the token to the blacklist
    blacklisted_token = TokenBlacklist(jti=jti)
    db.session.add(blacklisted_token)
    db.session.commit()

    # Create a response object
    response = make_response(jsonify({"message": "Successfully logged out"}), 200)

    # Clear the JWT cookies
    unset_jwt_cookies(response)

    print("Token blacklisted successfully:", jti)  # Debugging
    return response

def refresh_token():
    """Refresh the current user's access token."""
    current_user_id = get_jwt_identity()  # Use get_jwt_identity() instead of get_jwt()["sub"]
    access_token = create_access_token(identity=str(current_user_id))

    # Create a response object
    response = make_response(jsonify({"message": "Token refreshed successfully"}), 200)

    # Set the new access token in an HTTP-only cookie
    set_access_cookies(response, access_token)

    return response

def check_session():
    """Check if the user's session is still valid."""
    user_id = get_jwt_identity()  # Use get_jwt_identity() instead of get_jwt()["sub"]
    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404
    return {"id": user.id, "role": user.role.value}, 200

def me_service():
    """Get details of the currently logged-in user."""
    try:
        # Debugging: Print the JWT identity and claims
        user_id = get_jwt_identity()
        jwt_data = get_jwt()
        print("User ID from token:", user_id)
        print("Type of User ID:", type(user_id))  # Debugging
        print("JWT Data:", jwt_data)

        # Fetch the user from the database
        user = User.query.get(int(user_id))  # Convert back to integer for database query
        if not user:
            return {"error": "User not found"}, 404

        # Fetch company details if company_id exists
        company_name = None
        if user.company_id:
            company = Company.query.get(user.company_id)
            if company:
                company_name = company.name

        # Prepare the response
        response_data = {
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "email": user.email,
            "role": user.role.value,
            "picture": user.picture,
            "company_id": user.company_id,  # Return company_id (can be null)
            "company_name": company_name,  # Return company_name (can be null)
        }

        # If the user is a driver, include driver-specific details
        if user.role == UserRole.DRIVER and user.driver:
            response_data["driver_details"] = {
                "name": user.driver.name,
                "dob": user.driver.dob,
                "gender": user.driver.gender,
                "license_number": user.driver.license_number,
                "accident_record": user.driver.accident_record,
                "years_of_experience": user.driver.years_of_experience,
            }

        return response_data, 200
    except Exception as e:
        print("Error in me_service:", e)  # Debugging
        return {"error": "Invalid token"}, 401