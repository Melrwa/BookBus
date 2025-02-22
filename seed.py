from server.app import create_app
from server.app.models import db, User, UserRole

app = create_app()

def seed_data():
    with app.app_context():
        users = [
            User(fullname="Melki Orwa", username="melkiorwa", email="melki@gmail.com",
                 phone_number="0794068340", password="melki123", role=UserRole.ADMIN),

            User(fullname="Brian Mkala", username="brian", email="brian@gmail.com",
                 phone_number="0987654331", password="brian123", role=UserRole.DRIVER),

            User(fullname="Shirleen Chebet", username="shirleen", email="shirleen@gmail.com",
                 phone_number="1112223343", password="shirleen123",
                 picture="https://example.com/alice.jpg", role=UserRole.USER)
        ]

        db.session.bulk_save_objects(users)
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
