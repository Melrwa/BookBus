from server.app.models import Bus
from server.app import db
from server.app.schemas.bus_schema import bus_schema, buses_schema  # Import the BusSchema

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
    try:
        # Validate and deserialize input data
        bus_data = bus_schema.load(data)
    except ValidationError as err:
        raise ValueError(err.messages)

    # Create the bus instance
    bus = Bus(**bus_data)
    db.session.add(bus)
    db.session.commit()
    return bus_schema.dump(bus)  # Serialize the newly created bus

def update_bus_service(bus_id, data):
    """Update an existing bus."""
    bus = Bus.query.get(bus_id)
    if not bus:
        return None

    try:
        # Validate and deserialize input data (allow partial updates)
        bus_data = bus_schema.load(data, partial=True)
    except ValidationError as err:
        raise ValueError(err.messages)

    # Update the bus instance
    for key, value in bus_data.items():
        setattr(bus, key, value)

    db.session.commit()
    return bus_schema.dump(bus)  # Serialize the updated bus

def delete_bus_service(bus_id):
    """Delete a bus."""
    bus = Bus.query.get(bus_id)
    if not bus:
        return False

    db.session.delete(bus)
    db.session.commit()
    return True