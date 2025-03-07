import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import Flask app and extensions
from server.app import create_app
from server.app.extensions import db
from server.app.models import (
    User, Driver, Bus, Schedule, Booking, Transaction, Company, UserRole, BookingReview
)

# Import the ProductionConfig from server.app.config
from server.app.config import ProductionConfig

def seed_data():
    # Create the Flask app and initialize the database
    app = create_app()

    # Set the environment to production
    app.config.from_object(ProductionConfig)

    with app.app_context():
        # Drop all tables and recreate them (optional, use with caution!)
        db.drop_all()
        db.create_all()


        # Create sample companies with license_number and location
        company1 = Company(
            name="Express Travelers",
            license_number="LIC001",  # Unique license number
            location="Nairobi"  # Company location
        )
        company2 = Company(
            name="Swift Movers",
            license_number="LIC002",  # Unique license number
            location="Mombasa"  # Company location
        )
        company3 = Company(
            name="Express Travelers 2",
            license_number="LIC003",  # Unique license number
            location="Nairobi"  # Company location
        )
        company4 = Company(
            name="Swift Movers 2",
            license_number="LIC004",  # Unique license number
            location="Mombasa"  # Company location
        )
        db.session.add_all([company1, company2, company3, company4])
        db.session.commit()

        # Create sample users
        user1 = User(
            fullname="Jack Mah",
            username="johndoe",
            email="johndoe@example.com",
            phone_number="1234567890",
            password="password123",
            role=UserRole.USER
        )
        user4 = User(
            fullname="Melki Orwa",
            username="melki",
            email="melki@gmail.com",
            phone_number="0794068340",
            password="Password123",
            role=UserRole.ADMIN,
            company_id=company1.id  # Attach admin to company1
        )
        user2 = User(
            fullname="Jane Smith",
            username="janesmith",
            email="janesmith@example.com",
            phone_number="0987654321",
            password="password123",
            role=UserRole.DRIVER,
            picture="https://res.cloudinary.com/dmnytetf0/image/upload/v1741321300/school-bus-driver-5050_bgjikb.jpg"  # Picture is required for drivers
        )
        user3 = User(
            fullname="Mike Johnson",
            username="mikejohnson",
            email="mikejohnson@example.com",
            phone_number="1122334455",
            password="password123",
            role=UserRole.DRIVER,
            picture="https://res.cloudinary.com/dmnytetf0/image/upload/v1741321300/15411569_101024-wabc-tuchman-mta-hero-530am_teuuzu.jpg"  # Picture is required for drivers
        )
        user5 = User(
            fullname="Admin Two",
            username="admin2",
            email="admin2@example.com",
            phone_number="1122334456",
            password="password123",
            role=UserRole.ADMIN,
            company_id=company2.id  # Attach admin to company2
        )
        user6 = User(
            fullname="John Doe 2",
            username="johndoe2",
            email="johndoe2@example.com",
            phone_number="1234567891",
            password="password123",
            role=UserRole.USER
        )
        user7 = User(
            fullname="Melki Orwa 2",
            username="melki2",
            email="melki2@gmail.com",
            phone_number="0794068341",
            password="Password123",
            role=UserRole.ADMIN,
            company_id=company3.id  # Attach admin to company3
        )
        user8 = User(
            fullname="John Smith 2",
            username="John smith2",
            email="janesmith2@example.com",
            phone_number="0987654322",
            password="password123",
            role=UserRole.DRIVER,
            picture="https://res.cloudinary.com/dmnytetf0/image/upload/v1741321300/Coach_20USA_20Jobs_cj2bjb.jpg"  # Picture is required for drivers
        )
        user9 = User(
            fullname="Mike Johnson 2",
            username="mikejohnson2",
            email="mikejohnson2@example.com",
            phone_number="1122338456",
            password="password123",
            role=UserRole.DRIVER,
            picture="https://res.cloudinary.com/dmnytetf0/image/upload/v1741321300/Driver_Dave_Marshall_The_Friendly_Bus_Driver_rtlvsw.jpg"  # Picture is required for drivers
        )
        user10 = User(
            fullname="Admin Two 2",
            username="admin22",
            email="admin22@example.com",
            phone_number="1122334457",
            password="password123",
            role=UserRole.ADMIN,
            company_id=company4.id  # Attach admin to company4
        )
        db.session.add_all([user1, user2, user3, user4, user5, user6, user7, user8, user9, user10])
        db.session.commit()

        # Create sample buses
        bus1 = Bus(
            bus_number="BUS001",
            capacity=50,
            seats_available=50,  # Initialize seats_available to capacity
            route="Nairobi - Mombasa",
            company_id=company1.id
        )
        bus2 = Bus(
            bus_number="BUS002",
            capacity=40,
            seats_available=40,  # Initialize seats_available to capacity
            route="Nairobi - Kisumu",
            company_id=company2.id
        )
        bus3 = Bus(
            bus_number="BUS003",
            capacity=50,
            seats_available=50,  # Initialize seats_available to capacity
            route="Nairobi - Mombasa",
            company_id=company3.id
        )
        bus4 = Bus(
            bus_number="BUS004",
            capacity=40,
            seats_available=40,  # Initialize seats_available to capacity
            route="Nairobi - Kisumu",
            company_id=company4.id
        )
        db.session.add_all([bus1, bus2, bus3, bus4])
        db.session.commit()

        # Create sample schedules
        schedule1 = Schedule(
            departure_time=datetime(2025, 3, 7, 8, 0),
            arrival_time=datetime(2025, 3, 7, 14, 0),
            origin="Nairobi",
            destination="Mombasa",
            vip_price=1500.0,
            business_price=1000.0,
            bus_id=bus1.id
        )
        schedule2 = Schedule(
            departure_time=datetime(2025, 3, 7, 10, 0),
            arrival_time=datetime(2025, 3, 7, 16, 0),
            origin="Nairobi",
            destination="Kisumu",
            vip_price=1200.0,
            business_price=800.0,
            bus_id=bus2.id
        )
        schedule3 = Schedule(
            departure_time=datetime(2025, 3, 8, 8, 0),
            arrival_time=datetime(2025, 3, 8, 14, 0),
            origin="Nairobi",
            destination="Mombasa",
            vip_price=1500.0,
            business_price=1000.0,
            bus_id=bus3.id
        )
        schedule4 = Schedule(
            departure_time=datetime(2025, 3, 9, 10, 0),
            arrival_time=datetime(2025, 3, 9, 16, 0),
            origin="Nairobi",
            destination="Kisumu",
            vip_price=1200.0,
            business_price=800.0,
            bus_id=bus4.id
        )
        db.session.add_all([schedule1, schedule2, schedule3, schedule4])
        db.session.commit()
        
        # Create sample drivers
        driver1 = Driver(
            name="Jane Smith",
            dob=datetime(1990, 8, 20),
            gender="Female",
            license_number="DRV001",
            accident_record=1,
            years_of_experience=5,
            user_id=user2.id,  # Linked to user2, who is a driver with a picture
            bus_id=bus1.id
        )
        driver2 = Driver(
            name="Mike Johnson",
            dob=datetime(1985, 5, 15),
            gender="Male",
            license_number="DRV002",
            accident_record=0,
            years_of_experience=10,
            user_id=user3.id,  # Linked to user3, who is a driver with a picture
            bus_id=bus2.id
        )
        driver3 = Driver(
            name="Jane Smith 2",
            dob=datetime(1990, 8, 21),
            gender="Female",
            license_number="DRV003",
            accident_record=1,
            years_of_experience=5,
            user_id=user8.id,  # Linked to user8, who is a driver with a picture
            bus_id=bus3.id
        )
        driver4 = Driver(
            name="Mike Johnson 2",
            dob=datetime(1985, 5, 16),
            gender="Male",
            license_number="DRV004",
            accident_record=0,
            years_of_experience=10,
            user_id=user9.id,  # Linked to user9, who is a driver with a picture
            bus_id=bus4.id
        )
        db.session.add_all([driver1, driver2, driver3, driver4])
        db.session.commit()

        # Create sample bookings
        booking1 = Booking(
            user_id=user1.id,
            bus_id=bus1.id,
            schedule_id=schedule1.id,
            seat_numbers="1,2,3",  # User booked 3 seats
            origin="Nairobi",
            destination="Mombasa",
            departure_time=schedule1.departure_time,
            arrival_time=schedule1.arrival_time,
            amount_paid=4500.0,  # 3 seats * VIP price (1500.0)
            is_vip=True
        )
        booking1.update_seats_available()  # Update seats_available in the bus

        booking2 = Booking(
            user_id=user2.id,
            bus_id=bus2.id,
            schedule_id=schedule2.id,
            seat_numbers="4",  # User booked 1 seat
            origin="Nairobi",
            destination="Kisumu",
            departure_time=schedule2.departure_time,
            arrival_time=schedule2.arrival_time,
            amount_paid=800.0,  # 1 seat * Business price (800.0)
            is_vip=False
        )
        booking2.update_seats_available()  # Update seats_available in the bus

        booking3 = Booking(
            user_id=user6.id,
            bus_id=bus3.id,
            schedule_id=schedule3.id,
            seat_numbers="1,2,3",  # User booked 3 seats
            origin="Nairobi",
            destination="Mombasa",
            departure_time=schedule3.departure_time,
            arrival_time=schedule3.arrival_time,
            amount_paid=4500.0,  # 3 seats * VIP price (1500.0)
            is_vip=True
        )
        booking3.update_seats_available()  # Update seats_available in the bus

        booking4 = Booking(
            user_id=user7.id,
            bus_id=bus4.id,
            schedule_id=schedule4.id,
            seat_numbers="4",  # User booked 1 seat
            origin="Nairobi",
            destination="Kisumu",
            departure_time=schedule4.departure_time,
            arrival_time=schedule4.arrival_time,
            amount_paid=800.0,  # 1 seat * Business price (800.0)
            is_vip=False
        )
        booking4.update_seats_available()  # Update seats_available in the bus
        db.session.add_all([booking1, booking2, booking3, booking4])
        db.session.commit()

        # Create sample transactions
        transaction1 = Transaction(
            user_id=user1.id,
            schedule_id=schedule1.id,
            bus_id=bus1.id,
            company_id=company1.id,
            total_amount=4500.0
        )
        transaction2 = Transaction(
            user_id=user2.id,
            schedule_id=schedule2.id,
            bus_id=bus2.id,
            company_id=company2.id,
            total_amount=800.0
        )
        transaction3 = Transaction(
            user_id=user6.id,
            schedule_id=schedule3.id,
            bus_id=bus3.id,
            company_id=company3.id,
            total_amount=4500.0
        )
        transaction4 = Transaction(
            user_id=user7.id,
            schedule_id=schedule4.id,
            bus_id=bus4.id,
            company_id=company4.id,
            total_amount=800.0
        )
        db.session.add_all([transaction1, transaction2, transaction3, transaction4])
        db.session.commit()

        # Create sample booking reviews
        review1 = BookingReview(
            booking_id=booking1.id,
            review="Great service! The seats were comfortable.",
            alert=False
        )
        review2 = BookingReview(
            booking_id=booking2.id,
            review="The bus was late, and the seats were uncomfortable.",
            alert=True
        )
        review3 = BookingReview(
            booking_id=booking3.id,
            review="Great service! The seats were comfortable.",
            alert=False
        )
        review4 = BookingReview(
            booking_id=booking4.id,
            review="The bus was late, and the seats were uncomfortable.",
            alert=True
        )
        db.session.add_all([review1, review2, review3, review4])
        db.session.commit()

        print("Seed data created successfully!")

if __name__ == "__main__":
    seed_data()