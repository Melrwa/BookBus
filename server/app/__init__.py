# from flask import Flask
# from flask_cors import CORS
# from server.app.config import config
# from server.app.extensions import db, migrate, bcrypt, jwt, cors, api, swagger
# # from server.app.routes.auth_routes import auth_bp  # Import existing auth routes
# from server.app.routes.user_routes import user_bp  # Import new user routes
# from .models import db
# from server.app.routes.auth_routes import SignupResource, LoginResource, MeResource


# def create_app(config_name="default"):
#     """Flask application factory."""
#     app = Flask(__name__)
#     app.config.from_object(config[config_name]) # Load configuration

#     # Initialize extensions
#     db.init_app(app)
#     migrate.init_app(app, db)
#     bcrypt.init_app(app)
#     jwt.init_app(app)
#     cors.init_app(app)
#     api.init_app(app)
#     swagger.init_app(app)

#     # Register resources
#     with app.app_context():
#         db.create_all()  # Creates tables if they don't exist


#     app.register_blueprint(user_bp)


#        # Register Auth Routes
#     api.add_resource(SignupResource, "/auth/signup")
#     api.add_resource(LoginResource, "/auth/login")
#     api.add_resource(MeResource, "/auth/me")


#     return app



from flask import Flask
from flask_cors import CORS
from server.app.config import config
from server.app.extensions import db, migrate, bcrypt, jwt, cors, api, swagger
from server.app.routes.auth_routes import auth_bp  # Import auth routes
# from server.app.routes.user_routes import user_bp  # Import user routes
from server.app.routes.auth_routes import SignupResource, LoginResource, MeResource
# from server.app.routes.user_resources import UserResource  # Import other resources

def create_app(config_name="default"):
    """Flask application factory."""
    app = Flask(__name__)
    app.config.from_object(config[config_name])  # Load configuration

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    swagger.init_app(app)
    api.init_app(app)

    # Register Blueprints for OpenAPI documentation
    app.register_blueprint(auth_bp, url_prefix="/auth")
    # app.register_blueprint(user_bp, url_prefix="/users")

    # Register Flask-RESTful API Resources
   
    api.add_resource(SignupResource, "/auth/signup")
    api.add_resource(LoginResource, "/auth/login")
    api.add_resource(MeResource, "/auth/me")
    # api.add_resource(UserResource, "/users/<int:user_id>")  # Example

    # Create database tables within app context
    with app.app_context():
        db.create_all()

    return app

