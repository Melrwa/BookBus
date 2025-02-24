from server.app.models import Bus
from server.app import db
from server.app.schemas.bus_schema import bus_schema, buses_schema  # Import the BusSchema
from marshmallow import ValidationError

def get_bus_by_id_service(bus_id):
    """Get a bus by its ID and serialize using BusSchema."""
    bus = Bus.query.get(bus_id)
    if not bus:
        return None
    return bus_schema.dump(bus)  # Serialize the bus

def get_all_buses_service():
    """Get all buses and serialize using BusSchema."""
    buses = Bus.query.all()
    return buses_schema.dump(buses)  # Serialize multiple buses

def add_bus_service(data):
    """Add a new bus."""
    print(f"Adding bus with data: {data}")  # Debug print
    
    try:
        # Deserialize the input data into a Bus instance
        bus = bus_schema.load(data, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # Set seats_available to capacity if not provided
    if "seats_available" not in data:
        bus.seats_available = bus.capacity

    # Add the bus to the database
    db.session.add(bus)
    db.session.commit()

    # Serialize the bus into a dictionary
    serialized_bus = bus_schema.dump(bus)
    print(f"Serialized bus: {serialized_bus}")  # Debug print

    return serialized_bus



def update_bus_service(bus_id, data):
    """Update an existing bus."""
    print(f"Updating bus {bus_id} with data: {data}")  # Debug print
    
    bus = Bus.query.get(bus_id)
    if not bus:
        return None

    try:
        # Deserialize the input data into a Bus instance
        updated_bus = bus_schema.load(data, partial=True, instance=bus, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # If capacity is updated and seats_available is not provided, set seats_available to the new capacity
    if "capacity" in data and "seats_available" not in data:
        updated_bus.seats_available = updated_bus.capacity

    # Commit the changes to the database
    db.session.commit()

    # Serialize the updated bus into a dictionary
    serialized_bus = bus_schema.dump(updated_bus)
    print(f"Serialized bus: {serialized_bus}")  # Debug print

    return serialized_bus


def delete_bus_service(bus_id):
    """Delete a bus."""
    bus = Bus.query.get(bus_id)
    if not bus:
        return False

    db.session.delete(bus)
    db.session.commit()
    return True