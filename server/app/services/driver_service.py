# server/app/services/driver_service.py
from server.app.models import Driver, User, UserRole
from server.app import db
from server.app.schemas.driver_schema import driver_schema, drivers_schema
from marshmallow import ValidationError

def add_driver_service(data):
    """Add a new driver."""
    print(f"Adding driver with data: {data}")  # Debug print
    
    try:
        # Deserialize the input data into a Driver instance
        driver = driver_schema.load(data, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # Add the driver to the database
    db.session.add(driver)
    db.session.commit()

    # Serialize the driver into a dictionary
    serialized_driver = driver_schema.dump(driver)
    print(f"Serialized driver: {serialized_driver}")  # Debug print

    return serialized_driver

def get_driver_by_id_service(driver_id):
    """Get a driver by its ID and serialize using DriverSchema."""
    driver = Driver.query.get(driver_id)
    if not driver:
        return None
    return driver_schema.dump(driver)  # Serialize the driver

def get_all_drivers_service(page=1, per_page=10):
    """Get all drivers with pagination and serialize using DriverSchema."""
    drivers = Driver.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "drivers": drivers_schema.dump(drivers.items),
        "total_pages": drivers.pages,
        "current_page": drivers.page,
        "total_items": drivers.total
    }

def update_driver_service(driver_id, data):
    """Update an existing driver."""
    print(f"Updating driver {driver_id} with data: {data}")  # Debug print
    
    driver = Driver.query.get(driver_id)
    if not driver:
        return None

    try:
        # Deserialize the input data into a Driver instance
        updated_driver = driver_schema.load(data, partial=True, instance=driver, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # Commit the changes to the database
    db.session.commit()

    # Serialize the updated driver into a dictionary
    serialized_driver = driver_schema.dump(updated_driver)
    print(f"Serialized driver: {serialized_driver}")  # Debug print

    return serialized_driver

def delete_driver_service(driver_id):
    """Delete a driver."""
    driver = Driver.query.get(driver_id)
    if not driver:
        return False

    db.session.delete(driver)
    db.session.commit()
    return True




def get_driver_details_service(user_id):
    """Fetch driver details for the authenticated user."""
    current_user = User.query.get(user_id)

    if not current_user:
        raise ValueError("User not found")

    # Check if the user is a driver
    if current_user.role != UserRole.DRIVER:
        raise ValueError("Unauthorized. Only drivers can access this endpoint.")

    # Fetch the driver associated with the user
    driver = Driver.query.filter_by(user_id=user_id).first()
    if not driver:
        raise ValueError("Driver not found")

    # Serialize the driver and include bus details
    driver_data = driver_schema.dump(driver)
    if driver.bus:
        driver_data["bus"] = {
            "id": driver.bus.id,
            "name": driver.bus.name,
            "capacity": driver.bus.capacity,
            "booked": driver.bus.booked_seats,
            "available": driver.bus.available_seats,
            "image": driver.bus.image_url,
        }

    return driver_data