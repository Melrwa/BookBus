from datetime import datetime
from server.app.models import Schedule
from server.app import db
from server.app.schemas.schedule_schema import schedule_schema, schedules_schema  # Import the schemas

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
    try:
        # Validate and deserialize input data
        schedule_data = schedule_schema.load(data)
    except ValidationError as err:
        raise ValueError(err.messages)

    # Create the schedule instance
    schedule = Schedule(**schedule_data)
    db.session.add(schedule)
    db.session.commit()
    return schedule_schema.dump(schedule)  # Serialize the newly created schedule

def update_schedule_service(schedule_id, data):
    """Update an existing schedule."""
    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return None

    try:
        # Validate and deserialize input data (allow partial updates)
        schedule_data = schedule_schema.load(data, partial=True)
    except ValidationError as err:
        raise ValueError(err.messages)

    # Update the schedule instance
    for key, value in schedule_data.items():
        setattr(schedule, key, value)

    db.session.commit()
    return schedule_schema.dump(schedule)  # Serialize the updated schedule

def delete_schedule_service(schedule_id):
    """Delete a schedule."""
    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return False

    db.session.delete(schedule)
    db.session.commit()
    return True

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
    except Exception as e:
        # Handle any errors (e.g., invalid date format)
        print(f"Error searching schedules: {e}")
        return []