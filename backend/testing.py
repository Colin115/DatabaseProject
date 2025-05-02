from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Replace these with your actual MySQL credentials and DB name
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Arc-151912@localhost/sys'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

with app.app_context():
    try:
        db.engine.execute("SELECT 1")  # Raw SQL just to check connectivity
        print("✅ Successfully connected to the database.")
    except Exception as e:
        print("❌ Failed to connect to the database:", e)
