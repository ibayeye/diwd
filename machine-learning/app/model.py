# -*- coding: utf-8 -*-

# === IMPORTS ===

# Standard library
import gc
import time
import os
from collections import Counter

# Third-party libraries
import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC, LinearSVC
from imblearn.over_sampling import SMOTE
from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay

# Local module
from app.data import get_selected_df

# Enable garbage collector to manage memory
gc.enable()

# === LABEL DISTRIBUTION FUNCTION ===

def get_smote_distribution():
    df_selected = get_selected_df()

    # TF-IDF hanya untuk Error Message
    vectorizer = TfidfVectorizer(max_features=100)
    X_tfidf = vectorizer.fit_transform(df_selected["Error Message"]).toarray()
    df_tfidf = pd.DataFrame(X_tfidf, columns=vectorizer.get_feature_names_out())

    # Gabungkan dengan semua fitur numerik lainnya
    additional_features = df_selected[[
        "Message Type", "Error Code", "Frequency",
        "Hour", "Day", "Month", "Year"
    ]].reset_index(drop=True)

    df_transformed = pd.concat([additional_features, df_tfidf.reset_index(drop=True)], axis=1)
    df_transformed["Status"] = df_selected["Status"].values

    # Split dan SMOTE
    X = df_transformed.drop(columns=["Status"])
    y = df_transformed["Status"]

    x_train, _, y_train, _ = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    before = dict(Counter(y_train))

    smote = SMOTE(random_state=42)
    _, y_train_balanced = smote.fit_resample(x_train, y_train)
    after = dict(Counter(y_train_balanced))

    return {"before_smote": before, "after_smote": after}


# === TRAIN MODEL FUNCTION ===

def train_models():
    """
    Melatih model SVM dengan kernel linear, RBF, polynomial, dan sigmoid.
    Menyimpan model dan vectorizer ke folder khusus.
    
    Returns:
        tuple: (models dict, vectorizer object, X_test, y_test)
    """
    start = time.time()

    models_dir = "app/svm-models"
    vectorizer_dir = "app/vectorizers"
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(vectorizer_dir, exist_ok=True)

    df = get_selected_df()

    vectorizer = TfidfVectorizer(max_features=100)
    X_tfidf = vectorizer.fit_transform(df["Error Message"]).toarray()
    df_tfidf = pd.DataFrame(X_tfidf, columns=vectorizer.get_feature_names_out())

    df_combined = pd.concat(
    [
        df_tfidf.reset_index(drop=True),
        df[["Message Type", "Error Code", "Frequency", "Hour", "Day", "Month", "Year"]].reset_index(drop=True),
        df[["Status"]].reset_index(drop=True)
    ],
    axis=1
    )

    joblib.dump(vectorizer, os.path.join(vectorizer_dir, "vectorizer.pkl"))

    X = df_combined.drop(columns=["Status"])
    y = df_combined["Status"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )

    smote = SMOTE(random_state=42)
    X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

    models = {}

    # Latih LinearSVC
    print("\nMelatih LinearSVC...")
    linear_model = LinearSVC(random_state=42, max_iter=10000)
    linear_model.fit(X_train_balanced, y_train_balanced)
    joblib.dump(linear_model, os.path.join(models_dir, "model_linear_svc.pkl"))
    models["linear"] = linear_model
    print("LinearSVC selesai dilatih.")

    # Latih SVC kernel RBF (subset)
    print("\nMelatih SVC kernel RBF...")
    subset_rbf = df_combined.sample(n=10000, random_state=42)
    X_rbf = subset_rbf.drop(columns=["Status"])
    y_rbf = subset_rbf["Status"]
    X_train_rbf, _, y_train_rbf, _ = train_test_split(
        X_rbf, y_rbf, test_size=0.3, random_state=42, stratify=y_rbf
    )
    rbf_model = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)
    rbf_model.fit(X_train_rbf, y_train_rbf)
    joblib.dump(rbf_model, os.path.join(models_dir, "model_rbf_svc.pkl"))
    models["rbf"] = rbf_model
    print("SVC kernel RBF selesai dilatih.")

    # Latih SVC kernel Polynomial (subset)
    print("\nMelatih SVC kernel Polynomial...")
    subset_poly = df_combined.sample(n=10000, random_state=1)
    X_poly = subset_poly.drop(columns=["Status"])
    y_poly = subset_poly["Status"]
    X_train_poly, _, y_train_poly, _ = train_test_split(
        X_poly, y_poly, test_size=0.3, random_state=42, stratify=y_poly
    )
    poly_model = SVC(kernel='poly', degree=3, C=1.0, gamma='scale', random_state=42)
    poly_model.fit(X_train_poly, y_train_poly)
    joblib.dump(poly_model, os.path.join(models_dir, "model_poly_svc.pkl"))
    models["poly"] = poly_model
    print("SVC kernel Polynomial selesai dilatih.")

    # Latih SVC kernel Sigmoid (subset)
    print("\nMelatih SVC kernel Sigmoid...")
    subset_sigmoid = df_combined.sample(n=10000, random_state=2)
    X_sigmoid = subset_sigmoid.drop(columns=["Status"])
    y_sigmoid = subset_sigmoid["Status"]
    X_train_sigmoid, _, y_train_sigmoid, _ = train_test_split(
        X_sigmoid, y_sigmoid, test_size=0.3, random_state=42, stratify=y_sigmoid
    )
    sigmoid_model = SVC(kernel='sigmoid', C=1.0, gamma='scale', random_state=42)
    sigmoid_model.fit(X_train_sigmoid, y_train_sigmoid)
    joblib.dump(sigmoid_model, os.path.join(models_dir, "model_sigmoid_svc.pkl"))
    models["sigmoid"] = sigmoid_model
    print("SVC kernel Sigmoid selesai dilatih.")

    end = time.time()
    print(f"\nPelatihan selesai dalam {round(end - start, 2)} detik")

    return models, vectorizer, X_test, y_test

def load_svm_models():
    """
    Memuat model-model SVM dari file dan menyiapkan data uji.
    """
    models_dir = "app/svm-models"
    vectorizer_path = "app/vectorizers/vectorizer.pkl"

    if not os.path.exists(vectorizer_path):
        raise FileNotFoundError("Vectorizer belum tersedia. Harap latih model terlebih dahulu.")

    vectorizer = joblib.load(vectorizer_path)

    df = get_selected_df()

    # TF-IDF untuk Error Message
    X_tfidf = vectorizer.transform(df["Error Message"]).toarray()
    df_tfidf = pd.DataFrame(X_tfidf, columns=vectorizer.get_feature_names_out())

    # Tambahkan fitur numerik lainnya
    df_combined = pd.concat(
        [
            df_tfidf.reset_index(drop=True),
            df[["Message Type", "Error Code", "Frequency", "Hour", "Day", "Month", "Year"]].reset_index(drop=True),
            df[["Status"]].reset_index(drop=True)
        ],
        axis=1
    )

    X = df_combined.drop(columns=["Status"])
    y = df_combined["Status"]

    _, X_test, _, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

    model_paths = {
        "linear": os.path.join(models_dir, "model_linear_svc.pkl"),
        "rbf": os.path.join(models_dir, "model_rbf_svc.pkl"),
        "poly": os.path.join(models_dir, "model_poly_svc.pkl"),
        "sigmoid": os.path.join(models_dir, "model_sigmoid_svc.pkl"),
    }

    models = {}
    for kernel, path in model_paths.items():
        if os.path.exists(path):
            models[kernel] = joblib.load(path)
        else:
            raise FileNotFoundError(f"Model {kernel} tidak ditemukan. Harap latih terlebih dahulu.")

    return models, X_test, y_test

# === MODEL EVALUATION FUNCTION ===

def evaluate_models(models: dict, X_test, y_test, show_plot=True):
    """
    Mengevaluasi performa model SVM pada data uji dan menampilkan laporan klasifikasi 
    serta confusion matrix untuk masing-masing kernel.

    Args:
        models (dict): Dictionary model SVM yang sudah dilatih.
        X_test: Fitur data uji.
        y_test: Label data uji.
        show_plot (bool): Menampilkan plot confusion matrix jika True.
    
    Returns:
        dict: Hasil evaluasi untuk tiap kernel dalam format {kernel: classification_report_dict}
    """
    evaluation_results = {}
    label_names = ["Low", "Warning", "Critical"]

    for kernel, model in models.items():
        print(f"\n🔍 Evaluasi untuk kernel: {kernel.upper()}")

        y_pred = model.predict(X_test)
        report_dict = classification_report(y_test, y_pred, digits=4, target_names=label_names, output_dict=True)

        # Tampilkan classification report
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, digits=4, target_names=label_names))

        # Tampilkan confusion matrix
        if show_plot:
            cm = confusion_matrix(y_test, y_pred)
            disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=label_names)
            disp.plot(cmap=plt.cm.Blues)
            plt.title(f"Confusion Matrix - {kernel.upper()} Kernel")
            plt.tight_layout()
            plt.show()

        evaluation_results[kernel] = report_dict

    return evaluation_results

# === PREDICTION FUNCTION ===

def predict_status(error_message, hour, day, month, year, message_type=None, error_code=None, frequency=None):
    """
    Memprediksi status berdasarkan error_message dan fitur numerik lainnya.
    
    Returns:
        dict: {status_code, status_label}
    """
    vectorizer_path = "app/vectorizers/vectorizer.pkl"
    model_path = "app/svm-models/model_linear_svc.pkl"  # default pakai LinearSVC

    if not os.path.exists(vectorizer_path) or not os.path.exists(model_path):
        raise FileNotFoundError("Model atau vectorizer tidak ditemukan. Pastikan sudah dilakukan pelatihan.")

    # Load model dan vectorizer
    vectorizer = joblib.load(vectorizer_path)
    model = joblib.load(model_path)

    # Default handling
    message_type = message_type or 0
    error_code = error_code or 0
    frequency = frequency or 0

    # Gabungkan fitur numerik dengan hasil TF-IDF
    X_tfidf = vectorizer.transform([error_message]).toarray()
    df_tfidf = pd.DataFrame(X_tfidf, columns=vectorizer.get_feature_names_out())

    # Gabung fitur numerik
    df_numeric = pd.DataFrame([{
        "Message Type": message_type,
        "Error Code": error_code,
        "Frequency": frequency,
        "Hour": hour,
        "Day": day,
        "Month": month,
        "Year": year
    }])

    df_input = pd.concat([df_tfidf, df_numeric], axis=1)

    # Urutkan kolom agar sesuai dengan urutan fitur saat pelatihan
    ordered_columns = list(vectorizer.get_feature_names_out()) + [
        "Message Type", "Error Code", "Frequency", "Hour", "Day", "Month", "Year"
    ]
    df_input = df_input[ordered_columns]

    # Prediksi status menggunakan model
    pred_code = model.predict(df_input)[0]
    label_map = {0: "Low", 1: "Warning", 2: "Critical"}
    
    return {"status_code": int(pred_code), "status_label": label_map[pred_code]}
