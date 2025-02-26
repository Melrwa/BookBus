# generate_schema.py
from sqlalchemy_schemadisplay import create_schema_graph
from server.app import create_app  # Import your Flask app factory
from server.app.extensions import db  # Import your SQLAlchemy instance

# Create the Flask app
app = create_app()

# Create an application context
with app.app_context():
    # Create the schema graph using the existing metadata and engine
    graph = create_schema_graph(metadata=db.metadata, engine=db.engine)

    # Save the diagram as an image
    graph.write_png('schema.png')
    print("Schema diagram generated as 'schema.png'")