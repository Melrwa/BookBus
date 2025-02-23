from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_restful import Api
from flasgger import Swagger
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
cors = CORS()
api = Api()
swagger = Swagger()
jwt = JWTManager()

# Register JWT callbacks
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    """Check if a token is blacklisted."""
    from server.app.models import TokenBlacklist  # Import here to avoid circular imports
    jti = jwt_payload["jti"]  # JWT ID (unique identifier for the token)
    return TokenBlacklist.query.filter_by(jti=jti).first() is not None

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    """Handle expired tokens."""
    return {"message": "Token has expired"}, 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    """Handle invalid tokens."""
    return {"message": "Invalid token"}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    """Handle requests without a token."""
    return {"message": "Missing token"}, 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    """Handle revoked (blacklisted) tokens."""
    return {"message": "Token has been revoked"}, 401