from flask import Flask
from flask_cors import CORS
from server.app.config import config
from server.app.extensions import db, migrate, bcrypt, jwt, cors, api, swagger
# from server.app.routes.auth_routes import auth_bp  # Import existing auth routes
# from server.app.routes.user_routes import user_bp  # Import new user routes

def create_app(config_name="default"):
    """Flask application factory."""
    app = Flask(__name__)
    app.config.from_object(config[config_name]) # Load configuration

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    api.init_app(app)
    swagger.init_app(app)

    # Register resources

    return app
