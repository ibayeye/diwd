import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailDevice = () => {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `https://server.diwd.cloud/api/v1/getDevice/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDevice(res.data.data);
      } catch (err) {
        setError(err.message || "Gagal mengambil detail perangkat");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return <p className="text-center text-red-600 mt-4">{error}</p>;
  }
  if (!device) {
    return (
      <p className="text-center text-gray-600 mt-4">Data tidak ditemukan</p>
    );
  }

  // pisahkan fields
  const leftFields = [
    { label: "ID Perangkat", value: device.id },
    { label: "Alamat IP", value: device.ip },
    { label: "Titik Lokasi", value: device.location },
    { label: "Status", value: device.status },
  ];
  const rightFields = [
    { label: "Memori Perangkat", value: device.memory },
    { label: "Waktu Deteksi Terjadi", value: device.onSiteTime },
    { label: "Nilai Intensitas Terjadi", value: device.onSiteValue },
    { label: "Delay Korektif", value: device.regCD },
    { label: "Waktu Pencatatan Sistem", value: device.regTime },
    { label: "Intensitas yang Tercatat", value: device.regValue },
  ];

  return (
    <div className="mx-auto max-w-4xl dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Detail Perangkat</h1>
      {/* grid 2 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dark:bg-gray-700">
        {/* kiri */}
        <div className="space-y-4 bg-white p-4 rounded-md shadow-md dark:bg-gray-800 ">
          {leftFields.map((f) => (
            <div key={f.label}>
              <p className="text-sm font-semibold dark:text-white">{f.label}</p>
              <p className="mt-1 text-gray-800 dark:text-white">{f.value}</p>
            </div>
          ))}
        </div>

        {/* kanan */}
        <div className="space-y-4 bg-white p-4 rounded-md shadow-md dark:bg-gray-800">
          {rightFields.map((f) => (
            <div key={f.label}>
              <p className="text-sm font-semibold dark:text-white">{f.label}</p>
              <p className="mt-1 text-gray-800 dark:text-white">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => window.history.back()}
        className="mt-6 inline-block px-4 py-2 bg-blue-600 dark:bg-orange-500 text-white rounded hover:bg-blue-700 transition"
      >
        ← Kembali
      </button>
    </div>
  );
};

export default DetailDevice;
