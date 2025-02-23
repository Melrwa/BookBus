from server.app.models import User, UserRole
from server.app import db
def get_user_by_id_service(user_id):
    """Get a user by their ID."""
    return User.query.get(user_id)

def get_all_users_service():
    """Get all users."""
    return User.query.all()


def delete_user_service(user_id):
    """Delete a user."""
    user = User.query.get(user_id)
    if not user:
        return False

    db.session.delete(user)
    db.session.commit()
    return True

def promote_to_admin_service(user_id, company_id=None):
    """Promote a user to admin and optionally attach them to a company."""
    user = User.query.get(user_id)
    if not user:
        return None

    # Use the UserRole enum
    user.role = UserRole.ADMIN  # Correct way to assign an enum value
    if company_id:
        user.company_id = company_id

    db.session.commit()
    return user.to_dict()