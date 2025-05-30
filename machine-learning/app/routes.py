from app import app
from flask import jsonify, request
from app.data import (
    load_dataset, 
    clean_dataset, 
    hourly_error_trend,
    top_hourly_error_messages,
    daily_status_trend,
    top_daily_error_messages,
    weekly_status_trend,
    top_weekly_error_messages,
    monthly_status_trend,
    top_monthly_error_messages,
    error_status_distribution,
    top_error_messages_per_status
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

@app.route('/api/daily-status-trend', methods=['GET'])
def daily_status_trend_api():
    result = daily_status_trend()
    return jsonify(result)

@app.route('/api/top-daily-errors', methods=['GET'])
def top_daily_errors_api():
    top_n = request.args.get('top_n', default=3, type=int)
    result = top_daily_error_messages(top_n)
    return jsonify(result)

@app.route('/api/weekly-status-trend', methods=['GET'])
def weekly_status_trend_api():
    result = weekly_status_trend()
    return jsonify(result)

@app.route('/api/top-weekly-errors', methods=['GET'])
def top_weekly_errors_api():
    top_n = request.args.get('top_n', default=3, type=int)
    result = top_weekly_error_messages(top_n)
    return jsonify(result)

@app.route('/api/monthly-status-trend', methods=['GET'])
def monthly_status_trend_api():
    return jsonify(monthly_status_trend())

@app.route('/api/top-monthly-errors', methods=['GET'])
def top_monthly_errors_api():
    top_n = request.args.get('top_n', default=3, type=int)
    return jsonify(top_monthly_error_messages(top_n))

@app.route('/api/status-distribution', methods=['GET'])
def status_distribution_api():
    return jsonify(error_status_distribution())

@app.route('/api/top-errors-per-status', methods=['GET'])
def top_errors_per_status_api():
    top_n = request.args.get('top_n', default=5, type=int)
    return jsonify(top_error_messages_per_status(top_n))
