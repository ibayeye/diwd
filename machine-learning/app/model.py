# -*- coding: utf-8 -*-

# Standard library
import re
from collections import Counter

# Third-party libraries
import numpy as np
import pandas as pd
import seaborn as sns
import gc
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import text
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
from imblearn.over_sampling import SMOTE

#Load Dataset
gc.enable()
data_directory_path = 'csv/'

# Membaca dataset
df_cleaned = pd.read_csv(data_directory_path + 'error_device_cleaned.csv')

"""# 4. Data Selection"""

# Pilih kolom yang dibutuhkan dari df_cleaned
df_selected = df_cleaned[["Timestamp", "Error Message"]].copy()

# Ekstrak informasi waktu dari kolom Timestamp
df_selected["Hour"] = df_selected["Timestamp"].dt.hour   # Jam
df_selected["Day"] = df_selected["Timestamp"].dt.day     # Tanggal
df_selected["Month"] = df_selected["Timestamp"].dt.month # Bulan
df_selected["Year"] = df_selected["Timestamp"].dt.year   # Tahun

"""# 5. Data Transformation"""

# Ubah teks Error Message menjadi fitur TF-IDF dengan maksimal 100 fitur
vectorizer = TfidfVectorizer(max_features=100)
X_tfidf = vectorizer.fit_transform(df_selected["Error Message"]).toarray()

# Buat DataFrame dari hasil TF-IDF
df_tfidf = pd.DataFrame(X_tfidf, columns=vectorizer.get_feature_names_out())

# Gabungkan fitur waktu dengan fitur TF-IDF
df_transformed = pd.concat([df_selected[["Hour", "Day", "Month", "Year"]].reset_index(drop=True),
                            df_tfidf.reset_index(drop=True)], axis=1)

# Tambahkan kolom label Status
df_transformed['Status'] = df_cleaned['Status'].values

# Optimasi tipe data untuk menghemat memori
float_cols = df_transformed.select_dtypes(include=["float64"]).columns
df_transformed[float_cols] = df_transformed[float_cols].astype("float32")

int_cols = df_transformed.select_dtypes(include=["int32", "int64"]).columns
df_transformed[int_cols] = df_transformed[int_cols].apply(pd.to_numeric, downcast="integer")

# Tampilkan info dataset dan 5 baris pertama
print(df_transformed.info())
print(df_transformed.head())

# # Simpan data hasil transformasi ke CSV (opsional)
# df_transformed.to_csv("/content/drive/MyDrive/University/Semester-7/Model/error_device_transformed.csv", index=False)

# Pisahkan fitur dan target
X = df_transformed.drop(columns=["Status"])
y = df_transformed["Status"]

# Lakukan PCA untuk reduksi dimensi ke 2 komponen
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Buat DataFrame hasil PCA dengan label Status
df_pca = pd.DataFrame(X_pca, columns=["PC1", "PC2"])
df_pca["Status"] = y.values

# Visualisasi scatter plot hasil PCA
plt.figure(figsize=(8,6))
sns.scatterplot(data=df_pca, x="PC1", y="PC2", hue="Status", palette="Set1", alpha=0.7)
plt.title("Distribusi Titik Data setelah PCA (TF-IDF + Fitur Waktu)")
plt.xlabel("Principal Component 1")
plt.ylabel("Principal Component 2")
plt.legend(title="Status", labels=["Low (0)", "Warning (1)", "Critical (2)"])
plt.grid(True)
plt.tight_layout()
plt.show()

"""# 7. Split Data"""

# Pisahkan fitur dan label
X = df_transformed.drop(columns=["Status"])
y = df_transformed["Status"]

# Bagi data menjadi training (70%) dan testing (30%) dengan stratifikasi label
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# Tampilkan jumlah data di masing-masing set
print("Jumlah data training:", X_train.shape[0])
print("Jumlah data testing:", X_test.shape[0])

"""# 8. Oversampling"""

# Cek distribusi label pada data training
label_counts = y_train.value_counts().sort_index()
print("Distribusi Label Status (y_train):")
print(label_counts)

# Visualisasi distribusi label sebelum SMOTE
plt.figure(figsize=(6, 4))
sns.barplot(x=label_counts.index, y=label_counts.values, palette="Set2")
plt.xticks([0, 1, 2], ["Low", "Warning", "Critical"])
plt.title("Distribusi Label Status sebelum SMOTE")
plt.xlabel("Label Status")
plt.ylabel("Jumlah")
plt.show()

# Inisialisasi SMOTE untuk oversampling
smote = SMOTE(random_state=42)

# Terapkan SMOTE pada data training untuk menyeimbangkan kelas
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

# Cek distribusi label setelah SMOTE
print("Distribusi Label Setelah SMOTE:", Counter(y_train_balanced))

# Visualisasi distribusi label setelah SMOTE
counter = Counter(y_train_balanced)
labels = ["Low", "Warning", "Critical"]
values = [counter[0], counter[1], counter[2]]

plt.figure(figsize=(6, 4))
sns.barplot(x=labels, y=values, palette="Set2")
plt.title("Distribusi Label Setelah SMOTE")
plt.xlabel("Label Status")
plt.ylabel("Jumlah Sampel")
plt.tight_layout()
plt.show()

# Inisialisasi dan terapkan SMOTE untuk menyeimbangkan data training
smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

# Tampilkan distribusi label setelah SMOTE
print("Distribusi Label Setelah SMOTE:", Counter(y_train_balanced))