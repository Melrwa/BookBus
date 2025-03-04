from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from server.app.config import config
from server.app.extensions import db, migrate, bcrypt, jwt, cors, swagger
from server.app.models import bus, schedule, company, user, transaction, booking, driver, booking_review, tokenblacklist  # Import models
from server.app.routes.auth_routes import auth_bp, SignupResource, LoginResource, MeResource, LogoutResource, CheckSessionResource, RefreshTokenResource, Protected# Import auth resources
from server.app.routes.user_routes import user_bp, UserResource, UserListResource, PromoteUserResource  # Import user resources
from server.app.routes.bus_routes import bus_bp, BusResource, BusListResource  # Import bus routes
from server.app.routes.schedule_routes import schedule_bp, ScheduleResource, ScheduleListResource, SearchSchedulesResource, SchedulesByDateResource  # Import schedule routes
from server.app.routes.transaction_routes import transaction_bp, TransactionResource, TransactionListResource  # Import transaction routes
from server.app.routes.driver_routes import driver_bp, DriverResource, DriverListResource  # Import driver routes
from server.app.routes.company_routes import company_bp, CompanyResource, CompanyListResource  # Import company routes
from server.app.routes.booking_routes import booking_bp, BookingResource, BookingListResource  # Import booking routes
from server.app.routes.booking_review_routes import booking_review_bp, BookingReviewResource, BookingReviewListResource  # Import booking review routes
from server.app.swagger_config import SWAGGER_CONFIG  # Import Swagger config


def create_app(config_name="default"):
    """Flask application factory."""
    app = Flask(__name__)
    app.config.from_object(config[config_name])  # Load configuration
    app.config['SWAGGER'] = SWAGGER_CONFIG
   


      # Initialize CORS
    CORS(
        app,
        origins=app.config["CORS_ORIGINS"],
        methods=app.config["CORS_METHODS"],
        allow_headers=app.config["CORS_ALLOW_HEADERS"],
        supports_credentials=True,  # Allow credentials (e.g., cookies, authorization headers)
    )

# import cloudinary
# import cloudinary.uploader
# from cloudinary.utils import cloudinary_url

# # Configuration       
# cloudinary.config( 
#     cloud_name = "die72tnkj", 
#     api_key = "461186116371867", 
#     api_secret = "QHmu57ad90hULZHeF5-RjahABxk", # Click 'View API Keys' above to copy your API secret
#     secure=True
# )




    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    swagger.init_app(app)

    # Initialize Flask-RESTful API
    api = Api(app)  # Initialize Api with the app


    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp, url_prefix="/users")  # Match the Blueprint prefix
    app.register_blueprint(schedule_bp, url_prefix="/schedules")  # Register schedule Blueprint
    app.register_blueprint(bus_bp, url_prefix="/buses")  # Register bus Blueprint
    app.register_blueprint(transaction_bp, url_prefix="/transactions")  # Register transaction Blueprint
    app.register_blueprint(driver_bp, url_prefix="/drivers")  # Register driver Blueprint
    app.register_blueprint(company_bp, url_prefix="/companies")  # Register company Blueprint
    app.register_blueprint(booking_bp, url_prefix="/bookings") # Register booking Blueprint
    app.register_blueprint(booking_review_bp, url_prefix="/booking_reviews")  # Register booking review Blueprint



    # Register auth API Resources
    api.add_resource(SignupResource, "/auth/signup")
    api.add_resource(LoginResource, "/auth/login")
    api.add_resource(MeResource, "/auth/me")
    api.add_resource(LogoutResource, "/auth/logout")
    api.add_resource(RefreshTokenResource, "/auth/refresh")
    api.add_resource(CheckSessionResource, "/auth/check-session")
    api.add_resource(Protected, "/auth/protected")

    api.add_resource(UserResource, "/users/<int:user_id>")
    api.add_resource(UserListResource, "/users")
    api.add_resource(PromoteUserResource, "/users/<int:user_id>/promote")

    # Register Schedule and Bus Resources
    api.add_resource(ScheduleResource, "/schedules/<int:schedule_id>")
    api.add_resource(ScheduleListResource, "/schedules")
    api.add_resource(SearchSchedulesResource, "/schedules/search")  # Search endpoint
    api.add_resource(SchedulesByDateResource, "/schedules/date")  # Search by date endpoint

    api.add_resource(BusResource, "/buses/<int:bus_id>")
    api.add_resource(BusListResource, "/buses")

    api.add_resource(TransactionResource, "/transactions/<int:transaction_id>")
    api.add_resource(TransactionListResource, "/transactions")

    # Register Driver Resources
    api.add_resource(DriverResource, "/drivers/<int:driver_id>")
    api.add_resource(DriverListResource, "/drivers")

    # Register Company Resources
    api.add_resource(CompanyResource, "/companies/<int:company_id>")
    api.add_resource(CompanyListResource, "/companies")

    # Register  Booking Resources
    api.add_resource(BookingResource, "/bookings/<int:booking_id>")
    api.add_resource(BookingListResource, "/bookings")

    # Register Booking Review Resources
    api.add_resource(BookingReviewResource, "/booking_reviews/<int:review_id>")
    api.add_resource(BookingReviewListResource, "/booking_reviews")


    # Create database tables within app context
    with app.app_context():
        db.create_all()

    return app