from server.app import create_app

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        app.run(debug=True)

print(f"DB Bindings: {app.extensions.get('sqlalchemy')}")
