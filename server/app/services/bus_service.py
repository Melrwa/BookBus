from server.app.models import Bus
from server.app import db
from server.app.schemas.bus_schema import bus_schema, buses_schema
from marshmallow import ValidationError
from werkzeug.utils import secure_filename
import os

def get_bus_by_id_service(bus_id):
    """Get a bus by its ID and serialize using BusSchema."""
    bus = Bus.query.get(bus_id)
    if not bus:
        return None
    return bus_schema.dump(bus)

def get_all_buses_service(company_id=None):
    """Get all buses, optionally filtered by company_id."""
    query = Bus.query
    if company_id:
        query = query.filter_by(company_id=company_id)
    buses = query.all()
    return buses_schema.dump(buses)

def add_bus_service(data):
    """Add a new bus."""
    try:
        # Deserialize the input data into a Bus instance
        bus = bus_schema.load(data, session=db.session)
    except ValidationError as err:
        raise ValueError(err.messages)

    # Set seats_available to capacity if not provided
    if "seats_available" not in data:
        bus.seats_available = bus.capacity

    # Add the bus to the database
    db.session.add(bus)
    db.session.commit()

    # Serialize the bus into a dictionary
    return bus_schema.dump(bus)

def update_bus_service(bus_id, data):
    """Update an existing bus."""
    bus = Bus.query.get(bus_id)
    if not bus:
        return None

    try:
        # Deserialize the input data into a Bus instance
        updated_bus = bus_schema.load(data, partial=True, instance=bus, session=db.session)
    except ValidationError as err:
        raise ValueError(err.messages)

    # If capacity is updated and seats_available is not provided, set seats_available to the new capacity
    if "capacity" in data and "seats_available" not in data:
        updated_bus.seats_available = updated_bus.capacity

    # Commit the changes to the database
    db.session.commit()

    # Serialize the updated bus into a dictionary
    return bus_schema.dump(updated_bus)

def delete_bus_service(bus_id):
    """Delete a bus."""
    bus = Bus.query.get(bus_id)
    if not bus:
        return False

    db.session.delete(bus)
    db.session.commit()
    return True

def upload_bus_image(file):
    """Upload a bus image and return the file path."""
    if not file:
        return None

    # Ensure the uploads directory exists
    upload_folder = "uploads/buses"
    os.makedirs(upload_folder, exist_ok=True)

    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    return file_path