from app import app
from flask import jsonify, request
from app.data import (
    load_dataset, 
    clean_dataset, 
    hourly_error_trend,
    top_hourly_error_messages
   )

import json

@app.route('/')
def home():
    return 'Welcome to my Flask API!'

@app.route('/api/hello', methods=['GET'])
def hello_api():
    return jsonify({'message': 'Hello from the API!'})

@app.route('/api/describe-dataset', methods=['GET'])
def describe_dataset_api():
    result = load_dataset()
    return jsonify(result)

@app.route('/api/clean-dataset', methods=['GET'])
def clean_dataset_api():
    result = clean_dataset()
    return jsonify(result)

@app.route('/api/hourly-error-trend', methods=['GET'])
def hourly_error_trend_api():
    result = hourly_error_trend()
    return jsonify(result)

@app.route('/api/top-hourly-errors', methods=['GET'])
def top_hourly_errors_api():
    top_n = request.args.get('top_n', default=5, type=int)
    result = top_hourly_error_messages(top_n)
    return jsonify(result)
