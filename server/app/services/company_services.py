# server/app/services/company_service.py
from server.app.models import Company, User, UserRole
from server.app import db
from server.app.schemas.company_schema import company_schema, companies_schema
from marshmallow import ValidationError



def add_company_service(data, user_id):
    """Add a new company and promote the user to ADMIN."""
    print(f"Adding company with data: {data}")  # Debug print
    
    # Fetch the user who is creating the company
    user = User.query.get(user_id)
    if not user:
        raise ValueError("User not found")

    # Check if the user is already an admin or has a company
    if user.role != UserRole.USER or user.company_id is not None:
        raise ValueError("Only regular users without a company can add a company")

    try:
        # Deserialize the input data into a Company instance
        company = company_schema.load(data, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # Promote the user to ADMIN and link them to the company
    user.role = UserRole.ADMIN
    user.company_id = company.id  # Set the user's company_id to the new company's ID

    # Add the company to the database
    db.session.add(company)
    db.session.commit()

    # Serialize the company into a dictionary
    serialized_company = company_schema.dump(company)
    print(f"Serialized company: {serialized_company}")  # Debug print

    return serialized_company



def get_company_by_id_service(company_id):
    """Get a company by its ID and serialize using CompanySchema."""
    company = Company.query.get(company_id)
    if not company:
        return None
    return company_schema.dump(company)  # Serialize the company

def get_all_companies_service(page=1, per_page=10):
    """Get all companies with pagination and serialize using CompanySchema."""
    companies = Company.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "companies": companies_schema.dump(companies.items),
        "total_pages": companies.pages,
        "current_page": companies.page,
        "total_items": companies.total
    }

def delete_company_service(company_id, user_id):
    """Delete a company if the user is its admin."""
    company = Company.query.get(company_id)
    if not company:
        return False

    # Fetch the user
    user = User.query.get(user_id)
    if not user or user.company_id != company.id or user.role != UserRole.ADMIN:
        return False

    # Delete the company
    db.session.delete(company)
    db.session.commit()
    return True