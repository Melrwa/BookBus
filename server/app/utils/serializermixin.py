from sqlalchemy.ext.declarative import declared_attr
from flask.json import jsonify
from datetime import datetime

class SerializerMixin:
    """Mixin to serialize SQLAlchemy models into JSON."""
    
    @declared_attr
    def serialize_rules(cls):
        """Define which fields to include or exclude (default: all)."""
        return ()

    def to_dict(self):
        """Convert model instance to a dictionary, applying serialization rules."""
        serialized = {}
        for column in self.__table__.columns:
            column_name = column.name
            if column_name in self.serialize_rules:
                continue  # Skip fields in serialize_rules

            value = getattr(self, column_name)

            # Convert datetime objects to string
            if isinstance(value, datetime):
                value = value.isoformat()

            serialized[column_name] = value

        return serialized

    def to_json(self):
        """Convert model instance to a JSON response."""
        return jsonify(self.to_dict())