from datetime import timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")

    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Avoids SQLAlchemy warning

    # CORS Settings
    CORS_HEADERS = "Content-Type"
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "https://book-bus-58nb.vercel.app/,http://localhost:5001,http://localhost:3000").split(",")  # List of allowed origins
    CORS_METHODS = os.getenv("CORS_METHODS", "GET,POST,PUT,DELETE,OPTIONS").split(",")  # Allowed HTTP methods
    CORS_ALLOW_HEADERS = os.getenv("CORS_ALLOW_HEADERS", "Content-Type,Authorization").split(",")  # Allowed headers

    # JWT Settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Access token expiration time
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  # Refresh token expiration time
    JWT_BLACKLIST_ENABLED = True  # Enable token blacklisting
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]  # Check both access and refresh tokens
    # JWT Cookie Settings
    JWT_TOKEN_LOCATION = ["cookies", "headers"]  # Store tokens in cookies and headers
    JWT_COOKIE_SECURE = True  # Set to True in production (HTTPS only)
    JWT_COOKIE_CSRF_PROTECT = False  # Set to True if using CSRF protection
    JWT_ACCESS_COOKIE_NAME = 'access_token'
    JWT_REFRESH_COOKIE_NAME = 'refresh_token'
    JWT_COOKIE_SAMESITE = 'None'  # Prevents cookies from being sent in cross-site requests

    # Debug Mode
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    # Pagination Settings
    PAGINATION_PER_PAGE = int(os.getenv("PAGINATION_PER_PAGE", 10))  # Default items per page
    PAGINATION_MAX_PER_PAGE = int(os.getenv("PAGINATION_MAX_PER_PAGE", 100))  # Max items per page

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
    CLOUDINARY_UPLOAD_PRESET = os.getenv("CLOUDINARY_UPLOAD_PRESET")

    # Backend URL
    NEXT_PUBLIC_BACKEND_URL = os.getenv("NEXT_PUBLIC_BACKEND_URL")

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    # Use local database for development
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    # Use Render database for production
    SQLALCHEMY_DATABASE_URI = os.getenv("RENDER_DATABASE_URL")
    
    # SSL Configuration for Render PostgreSQL
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {
            "sslmode": "require",  # Require SSL for secure connections
        }
    }

# Dictionary to select the configuration based on ENV
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}