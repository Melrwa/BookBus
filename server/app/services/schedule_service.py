from datetime import datetime
from server.app.models import Schedule
from server.app import db
from server.app.schemas.schedule_schema import schedule_schema, schedules_schema  # Import the schemas
from marshmallow import ValidationError

def get_schedule_by_id_service(schedule_id):
    """Get a schedule by its ID and serialize using ScheduleSchema."""
    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return None
    return schedule_schema.dump(schedule)  # Serialize the schedule

def get_all_schedules_service():
    """Get all schedules and serialize using ScheduleSchema."""
    schedules = Schedule.query.all()
    return schedules_schema.dump(schedules)  # Serialize multiple schedules

def add_schedule_service(data):
    """Add a new schedule."""
    print(f"Adding schedule with data: {data}")  # Debug print
    
    try:
        # Deserialize the input data into a Schedule instance
        schedule = schedule_schema.load(data, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # Add the schedule to the database
    db.session.add(schedule)
    db.session.commit()

    # Serialize the schedule into a dictionary
    serialized_schedule = schedule_schema.dump(schedule)
    print(f"Serialized schedule: {serialized_schedule}")  # Debug print

    return serialized_schedule

def update_schedule_service(schedule_id, data):
    """Update an existing schedule."""
    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return None

    try:
        # Deserialize the input data into a Schedule instance
        updated_schedule = schedule_schema.load(data, partial=True, instance=schedule, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # Commit the changes to the database
    db.session.commit()

    # Serialize the updated schedule into a dictionary
    return schedule_schema.dump(updated_schedule)

def delete_schedule_service(schedule_id):
    """Delete a schedule."""
    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return False

    db.session.delete(schedule)
    db.session.commit()
    return True

# New function to search schedules by origin, destination, and date

def search_schedules_service(origin, destination, date):
    """Search schedules by origin, destination, and date."""
    try:
        # Convert the date string to a datetime object
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        
        # Query schedules that match the origin, destination, and date
        schedules = Schedule.query.filter(
            Schedule.origin == origin,
            Schedule.destination == destination,
            db.func.date(Schedule.departure_time) == date_obj
        ).all()
        
        return schedules_schema.dump(schedules)  # Serialize the results
    except ValueError as e:
        # Handle invalid date format
        print(f"Invalid date format: {e}")
        return {"error": "Invalid date format. Use YYYY-MM-DD."}, 400
    except Exception as e:
        # Handle other errors (e.g., database issues)
        print(f"Error searching schedules: {e}")
        return {"error": "Internal server error."}, 500
