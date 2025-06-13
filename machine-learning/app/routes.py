# Standard library
import json
import os
import time
from collections import Counter

# Third-party libraries
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix

# Local modules
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
    top_error_messages_per_status,
    get_cleaned_df,
    get_selected_df
)
from app.model import (
    train_models,
    get_smote_distribution,
    load_svm_models,
    predict_status,
)

# === TEST API ===
@app.route('/')
def home():
    return 'Welcome to my Flask API!'

@app.route('/api/hello', methods=['GET'])
def hello_api():
    return jsonify({'message': 'Hello from the API!'})

# === DATA API ===

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

@app.route('/api/save-cleaned-dataset', methods=['GET'])
def save_cleaned_dataset_api():
    try:
        output_path = request.args.get('path', default='csv/error_device_cleaned.csv')
        get_cleaned_df(save_cleaned=True, output_path=output_path)
        return jsonify({"message": f"Dataset berhasil disimpan di {output_path}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/selected-dataset', methods=['GET'])
def selected_dataset_api():
    try:
        df_selected = get_selected_df()
        sample = df_selected.head(10).to_dict(orient='records')
        return jsonify({"sample_selected_dataset": sample}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# === MODEL API ===

@app.route('/api/smote-distribution', methods=['GET'])
def label_distribution_api():
    result = get_smote_distribution()
    return jsonify(result)

@app.route('/api/train-models', methods=['GET'])
def train_models_api():
    try:
        models, vectorizer, x_test, y_test = train_models()
        return jsonify({"message": "Model SVM dengan kernel linear, rbf, polynomial dan sigmoid berhasil dilatih."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/load-svm-models', methods=['GET'])
def load_svm_models_api():
    try:
        models, X_test, y_test = load_svm_models()
        return jsonify({
            "message": "Model dan vectorizer berhasil dimuat.",
            "jumlah_model": len(models),
            "model_tersedia": list(models.keys()),
            "jumlah_data_uji": len(X_test)
        }), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/api/evaluate-models', methods=['GET'])
def evaluate_models_api():
    try:
        print("Memulai evaluasi model...")
        models, X_test, y_test = load_svm_models()

        results = {}
        for kernel, model in models.items():
            y_pred = model.predict(X_test)
            report = classification_report(y_test, y_pred, output_dict=True)
            cm = confusion_matrix(y_test, y_pred).tolist()
            results[kernel] = {
                "classification_report": report,
                "confusion_matrix": cm
            }

        return jsonify(results), 200

    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan saat evaluasi: {str(e)}"}), 500

@app.route('/api/predict-status', methods=['POST'])
def predict_status_api():
    try:
        data = request.get_json()

        # Ambil input dan beri default jika kosong
        error_message = data.get("error_message", "")
        hour = int(data.get("hour", 0))
        day = int(data.get("day", 1))
        month = int(data.get("month", 1))
        year = int(data.get("year", 2025))
        message_type = int(data.get("message_type", 0))
        error_code = int(data.get("error_code", 0))
        frequency = int(data.get("frequency", 0))

        result = predict_status(
            error_message=error_message,
            hour=hour,
            day=day,
            month=month,
            year=year,
            message_type=message_type,
            error_code=error_code,
            frequency=frequency
        )

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan saat prediksi: {str(e)}"}), 500
