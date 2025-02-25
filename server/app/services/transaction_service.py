# server/app/services/transaction_service.py
from server.app.models import Transaction
from server.app import db
from server.app.schemas.transaction_schema import transaction_schema, transactions_schema
from sqlalchemy import desc
from marshmallow import ValidationError



def create_transaction_service(data):
    """Create a new transaction."""
    print(f"Creating transaction with data: {data}")  # Debug print
    
    try:
        # Deserialize the input data into a Transaction instance
        transaction = transaction_schema.load(data, session=db.session)
    except ValidationError as err:
        print(f"Validation error: {err.messages}")  # Debug print
        raise ValueError(err.messages)

    # Add the transaction to the database
    db.session.add(transaction)
    db.session.commit()

    # Serialize the transaction into a dictionary
    serialized_transaction = transaction_schema.dump(transaction)
    print(f"Serialized transaction: {serialized_transaction}")  # Debug print

    return serialized_transaction


def get_transaction_by_id_service(transaction_id):
    """Get a transaction by its ID and serialize using TransactionSchema."""
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return None
    return transaction_schema.dump(transaction)  # Serialize the transaction

def get_all_transactions_service(page=1, per_page=10):
    """Get all transactions with pagination and serialize using TransactionSchema."""
    transactions = Transaction.query.order_by(desc(Transaction.timestamp)).paginate(page=page, per_page=per_page, error_out=False)
    return {
        "transactions": transactions_schema.dump(transactions.items),
        "total_pages": transactions.pages,
        "current_page": transactions.page,
        "total_items": transactions.total
    }

def delete_transaction_service(transaction_id):
    """Delete a transaction."""
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return False

    db.session.delete(transaction)
    db.session.commit()
    return True