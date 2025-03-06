from server.app.models import Bus, Company
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

def get_all_buses_service(company_id=None, page=1, per_page=10):
    """Get all buses, optionally filtered by company_id, with pagination."""
    query = Bus.query
    if company_id:
        query = query.filter_by(company_id=company_id)
    
    # Paginate the query
    buses = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Return the paginated results
    return {
        "buses": buses_schema.dump(buses.items),
        "total_pages": buses.pages,
        "current_page": buses.page,
        "total_buses": buses.total
    }

def add_bus_service(data, image_file=None):
    """Add a new bus with optional image upload."""
    try:
        # Check if a bus with the same bus_number already exists
        existing_bus = Bus.query.filter_by(bus_number=data["bus_number"]).first()
        if existing_bus:
            raise ValueError(f"A bus with the number {data['bus_number']} already exists.")

        # Validate company_id
        if "company_id" not in data:
            raise ValueError("company_id is required.")
        company = Company.query.get(data["company_id"])
        if not company:
            raise ValueError(f"Company with ID {data['company_id']} does not exist.")

        # Handle image upload
        image_url = None
        if image_file:
            # Save the file to a folder (e.g., "uploads/buses")
            upload_folder = "uploads/buses"
            os.makedirs(upload_folder, exist_ok=True)
            filename = secure_filename(image_file.filename)
            file_path = os.path.join(upload_folder, filename)
            image_file.save(file_path)
            image_url = f"/{file_path}"  # Store the file path or URL

        # Add image_url to the data
        if image_url:
            data["image_url"] = image_url

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

def update_bus_service(bus_id, data, image_file=None):
    """Update an existing bus with optional image upload."""
    bus = Bus.query.get(bus_id)
    if not bus:
        return None

    try:
        # Validate company_id if provided
        if "company_id" in data:
            company = Company.query.get(data["company_id"])
            if not company:
                raise ValueError(f"Company with ID {data['company_id']} does not exist.")

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