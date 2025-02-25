from datetime import timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS Settings
    CORS_HEADERS = "Content-Type"

    # JWT Settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Access token expiration time
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  # Refresh token expiration time
    JWT_BLACKLIST_ENABLED = True  # Enable token blacklisting
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]  # Check both access and refresh tokens

    # Debug Mode
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"


     # Pagination Settings
    PAGINATION_PER_PAGE = int(os.getenv("PAGINATION_PER_PAGE", 10))  # Default items per page
    PAGINATION_MAX_PER_PAGE = int(os.getenv("PAGINATION_MAX_PER_PAGE", 100))  # Max items per page

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False

# Dictionary to select the configuration based on ENV
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}