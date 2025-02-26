from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Float, Enum
from sqlalchemy.orm import relationship
from server.app.extensions import db
Base = db.Model

class User(Base):
    __tablename__ = 'users'
    id = db.Column(Integer, primary_key=True, nullable=False)
    fullname = db.Column(String, nullable=False)
    username = db.Column(String, nullable=False)
    email = db.Column(String, nullable=False)
    phone_number = db.Column(String, nullable=False)
    password_hash = db.Column(String, nullable=False)
    picture = db.Column(String)
    role = db.Column(Enum, nullable=False)
    company_id = db.Column(Integer)

class Booking(Base):
    __tablename__ = 'bookings'
    id = db.Column(Integer, primary_key=True, nullable=False)
    user_id = db.Column(Integer, nullable=False)
    bus_id = db.Column(Integer, nullable=False)
    schedule_id = db.Column(Integer, nullable=False)
    seat_numbers = db.Column(String, nullable=False)
    origin = db.Column(String, nullable=False)
    destination = db.Column(String, nullable=False)
    departure_time = db.Column(DateTime, nullable=False)
    arrival_time = db.Column(DateTime, nullable=False)
    travel_time = db.Column(Interval)
    amount_paid = db.Column(Float, nullable=False)
    is_vip = db.Column(Boolean)

class Bus(Base):
    __tablename__ = 'buses'
    id = db.Column(Integer, primary_key=True, nullable=False)
    bus_number = db.Column(String, nullable=False)
    capacity = db.Column(Integer, nullable=False)
    seats_available = db.Column(Integer)
    image_url = db.Column(String)
    route = db.Column(String, nullable=False)
    company_id = db.Column(Integer, nullable=False)
    created_at = db.Column(DateTime)
    updated_at = db.Column(DateTime)

class Schedule(Base):
    __tablename__ = 'schedules'
    id = db.Column(Integer, primary_key=True, nullable=False)
    departure_time = db.Column(DateTime, nullable=False)
    arrival_time = db.Column(DateTime, nullable=False)
    origin = db.Column(String, nullable=False)
    destination = db.Column(String, nullable=False)
    vip_price = db.Column(Float, nullable=False)
    business_price = db.Column(Float, nullable=False)
    bus_id = db.Column(Integer, nullable=False)
    created_at = db.Column(DateTime)
    updated_at = db.Column(DateTime)

class BookingReview(Base):
    __tablename__ = 'booking_reviews'
    id = db.Column(Integer, primary_key=True, nullable=False)
    booking_id = db.Column(Integer, nullable=False)
    review = db.Column(Text, nullable=False)
    alert = db.Column(Boolean)
    created_at = db.Column(DateTime)

class Company(Base):
    __tablename__ = 'companies'
    id = db.Column(Integer, primary_key=True, nullable=False)
    name = db.Column(String, nullable=False)
    created_at = db.Column(DateTime)
    updated_at = db.Column(DateTime)

class Transaction(Base):
    __tablename__ = 'transactions'
    id = db.Column(Integer, primary_key=True, nullable=False)
    user_id = db.Column(Integer, nullable=False)
    schedule_id = db.Column(Integer, nullable=False)
    bus_id = db.Column(Integer, nullable=False)
    company_id = db.Column(Integer, nullable=False)
    total_amount = db.Column(Float)
    timestamp = db.Column(DateTime)

class Driver(Base):
    __tablename__ = 'drivers'
    id = db.Column(Integer, primary_key=True, nullable=False)
    name = db.Column(String, nullable=False)
    dob = db.Column(Date, nullable=False)
    gender = db.Column(String, nullable=False)
    license_number = db.Column(String, nullable=False)
    accident_record = db.Column(Integer)
    years_of_experience = db.Column(Integer)
    user_id = db.Column(Integer)
    bus_id = db.Column(Integer)

