from server.app import create_app
from server.app.extensions import db

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
