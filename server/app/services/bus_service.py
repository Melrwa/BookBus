from server.app.models import Bus, Company, UserRole
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

def get_all_buses_service(page=1, per_page=10):
    """Get all buses with pagination."""
    query = Bus.query
    
    # Paginate the query
    buses = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Return the paginated results
    return {
        "buses": buses_schema.dump(buses.items),
        "total_pages": buses.pages,
        "current_page": buses.page,
        "total_buses": buses.total
    }

def add_bus_service(data, current_user):
    """
    Add a new bus to the database.
    """
    try:
        # Extract data
        bus_number = data.get("bus_number")
        capacity = data.get("capacity")
        route = data.get("route")
        image_url = data.get("image_url")
        company_id = data.get("company_id")  # Get company_id from the data

        # Validate data
        if not bus_number or not capacity or not route:
            raise ValueError("Missing required fields")

        # Create a new bus
        new_bus = Bus(
            bus_number=bus_number,
            capacity=capacity,
            route=route,
            image_url=image_url,
            company_id=company_id  # Associate the bus with the company
        )

        # Save to the database
        db.session.add(new_bus)
        db.session.commit()

        return {
            "id": new_bus.id,
            "bus_number": new_bus.bus_number,
            "capacity": new_bus.capacity,
            "route": new_bus.route,
            "image_url": new_bus.image_url,
            "company_id": new_bus.company_id
        }
    except Exception as e:
        db.session.rollback()
        raise e
    
def update_bus_service(bus_id, data, current_user, image_file=None):
    """Update an existing bus with optional image upload."""
    # Check if the current user is authorized (admin or driver)
    if current_user.role not in [UserRole.ADMIN, UserRole.DRIVER]:
        raise ValueError("Unauthorized. Only admins and drivers can update buses.")

    bus = Bus.query.get(bus_id)
    if not bus:
        return None

    try:
        # Handle image upload
        if image_file:
            # Save the file to a folder (e.g., "uploads/buses")
            upload_folder = "uploads/buses"
            os.makedirs(upload_folder, exist_ok=True)
            filename = secure_filename(image_file.filename)
            file_path = os.path.join(upload_folder, filename)
            image_file.save(file_path)
            data["image_url"] = f"/{file_path}"  # Store the file path or URL

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

def delete_bus_service(bus_id, current_user):
    """Delete a bus."""
    # Check if the current user is authorized (admin or driver)
    if current_user.role not in [UserRole.ADMIN, UserRole.DRIVER]:
        raise ValueError("Unauthorized. Only admins and drivers can delete buses.")

    bus = Bus.query.get(bus_id)
    if not bus:
        return False

    db.session.delete(bus)
    db.session.commit()
    return True