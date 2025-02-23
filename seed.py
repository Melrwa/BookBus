# from server.app import create_app
# from server.app.models import db, User, UserRole

# app = create_app()

# def seed_data():
#     with app.app_context():
#         users = [
#             User(fullname="Melki Orwa", username="melkiorwa", email="melki@gmail.com",
#                  phone_number="0794068340", password="melki123", role=UserRole.ADMIN),

#             User(fullname="Brian Mkala", username="brian", email="brian@gmail.com",
#                  phone_number="0987654331", password="brian123", role=UserRole.DRIVER),

#             User(fullname="Shirleen Chebet", username="shirleen", email="shirleen@gmail.com",
#                  phone_number="1112223343", password="shirleen123",
#                  picture="https://example.com/alice.jpg", role=UserRole.USER)
#         ]

#         db.session.bulk_save_objects(users)
#         db.session.commit()
#         print("Database seeded successfully!")

# if __name__ == "__main__":
#     seed_data()

from server.app import create_app
from server.app.extensions import db
from server.app.models import (
    User, Driver, Bus, Schedule, Booking, Transaction, Company, UserRole
)
from datetime import datetime, timedelta

def seed_data():
    # Create the Flask app and initialize the database
    app = create_app()
    with app.app_context():
        # Drop all tables and recreate them (optional, use with caution!)
        db.drop_all()
        db.create_all()

        # Create sample companies
        company1 = Company(name="Express Travelers")
        company2 = Company(name="Swift Movers")
        db.session.add_all([company1, company2])
        db.session.commit()

        # Create sample buses
        bus1 = Bus(
            bus_number="BUS001",
            capacity=50,
            route="Nairobi - Mombasa",
            company_id=company1.id
        )
        bus2 = Bus(
            bus_number="BUS002",
            capacity=40,
            route="Nairobi - Kisumu",
            company_id=company2.id
        )
        db.session.add_all([bus1, bus2])
        db.session.commit()

        # Create sample schedules
        schedule1 = Schedule(
            departure_time=datetime(2025, 3, 1, 8, 0),
            arrival_time=datetime(2025, 3, 1, 14, 0),
            origin="Nairobi",
            destination="Mombasa",
            vip_price=1500.0,
            business_price=1000.0,
            bus_id=bus1.id
        )
        schedule2 = Schedule(
            departure_time=datetime(2025, 3, 1, 10, 0),
            arrival_time=datetime(2025, 3, 1, 16, 0),
            origin="Nairobi",
            destination="Kisumu",
            vip_price=1200.0,
            business_price=800.0,
            bus_id=bus2.id
        )
        db.session.add_all([schedule1, schedule2])
        db.session.commit()

        # Create sample users
        user1 = User(
            fullname="John Doe",
            username="johndoe",
            email="johndoe@example.com",
            phone_number="1234567890",
            password="password123",
            role=UserRole.USER
        )
        user2 = User(
            fullname="Jane Smith",
            username="janesmith",
            email="janesmith@example.com",
            phone_number="0987654321",
            password="password123",
            role=UserRole.DRIVER,
            picture="https://example.com/janesmith.jpg"  # Picture is required for drivers
        )
        user3 = User(
            fullname="Mike Johnson",
            username="mikejohnson",
            email="mikejohnson@example.com",
            phone_number="1122334455",
            password="password123",
            role=UserRole.DRIVER,
            picture="https://example.com/mikejohnson.jpg"  # Picture is required for drivers
        )
        db.session.add_all([user1, user2, user3])
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
        db.session.add_all([driver1, driver2])
        db.session.commit()

        # Create sample bookings
        booking1 = Booking(
            user_id=user1.id,
            bus_id=bus1.id,
            schedule_id=schedule1.id,
            origin="Nairobi",
            destination="Mombasa",
            departure_time=schedule1.departure_time,
            arrival_time=schedule1.arrival_time,
            amount_paid=1500.0
        )
        booking2 = Booking(
            user_id=user2.id,
            bus_id=bus2.id,
            schedule_id=schedule2.id,
            origin="Nairobi",
            destination="Kisumu",
            departure_time=schedule2.departure_time,
            arrival_time=schedule2.arrival_time,
            amount_paid=1200.0
        )
        db.session.add_all([booking1, booking2])
        db.session.commit()

        # Create sample transactions
        transaction1 = Transaction(
            user_id=user1.id,
            schedule_id=schedule1.id,
            bus_id=bus1.id,
            company_id=company1.id,
            total_amount=1500.0
        )
        transaction2 = Transaction(
            user_id=user2.id,
            schedule_id=schedule2.id,
            bus_id=bus2.id,
            company_id=company2.id,
            total_amount=1200.0
        )
        db.session.add_all([transaction1, transaction2])
        db.session.commit()

        print("Seed data created successfully!")

if __name__ == "__main__":
    seed_data()