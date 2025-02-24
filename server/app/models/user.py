from datetime import timedelta
from enum import Enum
from sqlalchemy.orm import validates
from server.app.extensions import db, bcrypt
from flask_jwt_extended import create_access_token

class UserRole(Enum):
    ADMIN = "admin"
    DRIVER = "driver"
    USER = "user"

class User(db.Model):
    """User model with authentication."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    picture = db.Column(db.String(255), nullable=True)  # Cloudinary image URL
    role = db.Column(db.Enum(UserRole), default=UserRole.USER, nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=True)

    # Relationships
    bookings = db.relationship('Booking', back_populates='user', cascade='all, delete')
    transactions = db.relationship('Transaction', back_populates='user', cascade='all, delete')
    driver = db.relationship('Driver', back_populates='user', uselist=False)  # One-to-one relationship
    company = db.relationship('Company', back_populates='admins')

    def __init__(self, fullname, username, email, phone_number, password, picture=None, role="user", company_id=None):
        """Create instance of User."""
        self.fullname = fullname
        self.username = username
        self.email = email
        self.phone_number = phone_number
        self.password = password  # Calls setter to hash password
        self.picture = picture
        self.role = UserRole(role)  # Ensure role is converted to UserRole enum
        self.company_id = company_id

    @property
    def password(self):
        """Prevent password from being accessed directly."""
        raise AttributeError("Password is not readable!")

    @password.setter
    def password(self, plaintext_password):
        """Hashes password before saving."""
        if len(plaintext_password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        self.password_hash = bcrypt.generate_password_hash(plaintext_password).decode("utf-8")

    def check_password(self, password):
        """Check hashed password against plaintext password."""
        return bcrypt.check_password_hash(self.password_hash, password)

    @validates("email")
    def validate_email(self, key, email):
        """Ensure email is properly formatted."""
        if "@" not in email or "." not in email:
            raise ValueError("Invalid email format.")
        return email

    @validates("phone_number")
    def validate_phone_number(self, key, phone_number):
        """Ensure phone number is valid."""
        if not phone_number.isdigit() or len(phone_number) < 10:
            raise ValueError("Invalid phone number.")
        return phone_number

    @validates("picture")
    def validate_picture(self, key, picture):
        """Ensure drivers have a picture."""
        if self.role == UserRole.DRIVER and not picture:
            raise ValueError("Drivers must have a picture.")
        return picture

    def generate_token(self):
        """Generates JWT token for the user."""
        return create_access_token(identity=str(self.id), expires_delta=timedelta(days=1))