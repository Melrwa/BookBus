# server/app/routes/company_routes.py
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from server.app.models import UserRole, User
from server.app.services.company_services import (
    add_company_service,
    get_company_by_id_service,
    get_all_companies_service,
    delete_company_service
)

# Define the Blueprint
company_bp = Blueprint("company", __name__, url_prefix="/companies")

# Initialize Api with the Blueprint
api = Api(company_bp)

class CompanyResource(Resource):
    @swag_from({
        'tags': ['companies'],
        'description': 'Get a company by ID',
        'parameters': [
            {
                'name': 'company_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the company to retrieve'
            }
        ],
        'responses': {
            '200': {
                'description': 'Company details retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'created_at': {'type': 'string', 'format': 'date-time'},
                        'updated_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            },
            '404': {
                'description': 'Company not found'
            }
        }
    })
    @jwt_required()
    def get(self, company_id):
        """Get a company by ID."""
        company = get_company_by_id_service(company_id)
        if not company:
            return {"error": "Company not found"}, 404
        return company, 200  # Already serialized by the service

    @swag_from({
        'tags': ['companies'],
        'description': 'Delete a company by ID',
        'parameters': [
            {
                'name': 'company_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the company to delete'
            }
        ],
        'responses': {
            '200': {
                'description': 'Company deleted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'Company not found'
            }
        }
    })
    @jwt_required()
    def delete(self, company_id):
        """Delete a company by ID."""
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        
        # Proceed with deleting the company
        success = delete_company_service(company_id, user_id)
        if not success:
            return {"error": "Company not found or unauthorized"}, 404
        return {"message": "Company deleted successfully"}, 200

class CompanyListResource(Resource):
    @swag_from({
        'tags': ['companies'],
        'description': 'Get all companies with pagination',
        'parameters': [
            {
                'name': 'page',
                'in': 'query',
                'type': 'integer',
                'required': False,
                'description': 'Page number (default: 1)'
            },
            {
                'name': 'per_page',
                'in': 'query',
                'type': 'integer',
                'required': False,
                'description': 'Number of items per page (default: 10)'
            }
        ],
        'responses': {
            '200': {
                'description': 'List of companies retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'companies': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'id': {'type': 'integer'},
                                    'name': {'type': 'string'},
                                    'created_at': {'type': 'string', 'format': 'date-time'},
                                    'updated_at': {'type': 'string', 'format': 'date-time'}
                                }
                            }
                        },
                        'total_pages': {'type': 'integer'},
                        'current_page': {'type': 'integer'},
                        'total_items': {'type': 'integer'}
                    }
                }
            }
        }
    })
    @jwt_required()
    def get(self):
        """Get all companies with pagination."""
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        companies = get_all_companies_service(page=page, per_page=per_page)
        return companies, 200

    @swag_from({
        'tags': ['companies'],
        'description': 'Add a new company',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string'}
                    }
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'Company created successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'created_at': {'type': 'string', 'format': 'date-time'},
                        'updated_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            },
            '400': {
                'description': 'Validation error'
            }
        }
    })
    
    @jwt_required()
    def post(self):
        """Add a new company."""
        # Get the identity from the JWT token
        user_id = get_jwt_identity()
        
        data = request.get_json()
        try:
            company = add_company_service(data, user_id)
        except ValueError as err:
            return {"error": str(err)}, 400
        return company, 201


