# server/app/schemas/transaction_schema.py
from marshmallow import Schema, fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.app.models import Transaction

class TransactionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Transaction
        include_fk = True  # Include foreign keys in the schema
        load_instance = True  # Automatically create Transaction instances when loading

    # Custom validations
    total_amount = fields.Float(required=True, validate=validate.Range(min=0))
    timestamp = fields.DateTime(required=False)

# Initialize the schema
transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)  # For serializing multiple transactions