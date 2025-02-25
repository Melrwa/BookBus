# server/app/routes/transaction_routes.py
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from server.app.models import UserRole, User
from server.app.services.transaction_service import (
    create_transaction_service,
    get_transaction_by_id_service,
    get_all_transactions_service,
    delete_transaction_service
)

# Define the Blueprint
transaction_bp = Blueprint("transaction", __name__, url_prefix="/transactions")

# Initialize Api with the Blueprint
api = Api(transaction_bp)

def check_admin_permission():
    """Check if the current user is an admin."""
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)
    
    if not current_user:
        return {"error": "User not found"}, 404
    
    if current_user.role != UserRole.ADMIN:
        return {"error": "Unauthorized. Only admins can perform this action."}, 403
    
    return None

class TransactionResource(Resource):
    @swag_from({
        'tags': ['transactions'],
        'description': 'Get a transaction by ID',
        'parameters': [
            {
                'name': 'transaction_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the transaction to retrieve'
            }
        ],
        'responses': {
            '200': {
                'description': 'Transaction details retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'schedule_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'},
                        'company_id': {'type': 'integer'},
                        'total_amount': {'type': 'number'},
                        'timestamp': {'type': 'string', 'format': 'date-time'}
                    }
                }
            },
            '404': {
                'description': 'Transaction not found'
            }
        }
    })
    @jwt_required()
    def get(self, transaction_id):
        """Get a transaction by ID."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        transaction = get_transaction_by_id_service(transaction_id)
        if not transaction:
            return {"error": "Transaction not found"}, 404
        return transaction, 200  # Already serialized by the service

    @swag_from({
        'tags': ['transactions'],
        'description': 'Delete a transaction by ID',
        'parameters': [
            {
                'name': 'transaction_id',
                'in': 'path',
                'type': 'integer',
                'required': True,
                'description': 'ID of the transaction to delete'
            }
        ],
        'responses': {
            '200': {
                'description': 'Transaction deleted successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'message': {'type': 'string'}
                    }
                }
            },
            '404': {
                'description': 'Transaction not found'
            }
        }
    })
    @jwt_required()
    def delete(self, transaction_id):
        """Delete a transaction by ID."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        # Proceed with deleting the transaction
        success = delete_transaction_service(transaction_id)
        if not success:
            return {"error": "Transaction not found"}, 404
        return {"message": "Transaction deleted successfully"}, 200

class TransactionListResource(Resource):
    @swag_from({
        'tags': ['transactions'],
        'description': 'Get all transactions with pagination',
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
                'description': 'List of transactions retrieved successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'transactions': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'id': {'type': 'integer'},
                                    'user_id': {'type': 'integer'},
                                    'schedule_id': {'type': 'integer'},
                                    'bus_id': {'type': 'integer'},
                                    'company_id': {'type': 'integer'},
                                    'total_amount': {'type': 'number'},
                                    'timestamp': {'type': 'string', 'format': 'date-time'}
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
        """Get all transactions with pagination."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        transactions = get_all_transactions_service(page=page, per_page=per_page)
        return transactions, 200

    @swag_from({
        'tags': ['transactions'],
        'description': 'Create a new transaction',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': True,
                'schema': {
                    'type': 'object',
                    'properties': {
                        'user_id': {'type': 'integer'},
                        'schedule_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'},
                        'company_id': {'type': 'integer'},
                        'total_amount': {'type': 'number'}
                    }
                }
            }
        ],
        'responses': {
            '201': {
                'description': 'Transaction created successfully',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'user_id': {'type': 'integer'},
                        'schedule_id': {'type': 'integer'},
                        'bus_id': {'type': 'integer'},
                        'company_id': {'type': 'integer'},
                        'total_amount': {'type': 'number'},
                        'timestamp': {'type': 'string', 'format': 'date-time'}
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
        """Create a new transaction."""
        # Check if the user is an admin
        admin_check = check_admin_permission()
        if admin_check:
            return admin_check

        data = request.get_json()
        try:
            transaction = create_transaction_service(data)
        except ValueError as err:
            return {"error": str(err)}, 400
        return transaction, 201

# Register Resources
# api.add_resource(TransactionResource, "/<int:transaction_id>")
# api.add_resource(TransactionListResource, "/")