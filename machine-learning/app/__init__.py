from flask import Flask
from flask_cors import CORS

# Membuat objek Flask
app = Flask(__name__)

# Mengaktifkan CORS agar API bisa diakses dari domain lain (frontend, dll)
CORS(app)

# Import rute agar Flask tahu semua endpoint
from app import routes
