import React, { useEffect, useState } from "react";
import axios from "axios";
import { database, ref, onValue } from "./firebase.jsx";

function FirebaseListener() {
  const [lastProcessedData, setLastProcessedData] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, "/"); // root path untuk mengakses semua data

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        console.log("Data Firebase:", data);

        // Loop melalui semua entri ID alat (57B0000004AL230004, 57B0000004AL230005, dll)
        Object.entries(data).forEach(([deviceId, deviceData]) => {
          // Cek apakah ini adalah entri baru
          const isNewDevice =
            !lastProcessedData || !lastProcessedData[deviceId];

          // Cek apakah onSiteValue telah berubah
          const valueChanged =
            !isNewDevice &&
            lastProcessedData[deviceId] &&
            lastProcessedData[deviceId].onSiteValue !== deviceData.onSiteValue;

          // Jika alat baru atau nilai onSiteValue berubah, kirim ke backend
          if (isNewDevice || valueChanged) {
            console.log(
              `onSiteValue berubah untuk alat ${deviceId}:`,
              deviceData.onSiteValue
            );

            // Kirim data ke backend saat onSiteValue berubah
            axios
              .post("http://localhost:5000/api/v1/device-realtime", {
                deviceId: deviceId,
                ...deviceData,
              })
              .then((res) =>
                console.log(
                  `Data untuk alat ${deviceId} terkirim ke server:`,
                  res.data
                )
              )
              .catch((err) =>
                console.error(
                  `Gagal mengirim data alat ${deviceId} ke server:`,
                  err
                )
              );
          }

          // Tetap cek status gempa
          if (deviceData.status === "gempa") {
            console.log(`Status gempa terdeteksi untuk alat ${deviceId}`);
            axios
              .post("http://localhost:5000/api/v1/device-realtime", {
                deviceId: deviceId,
                ...deviceData,
              })
              .then((res) =>
                console.log(
                  `Data gempa untuk alat ${deviceId} terkirim ke server:`,
                  res.data
                )
              )
              .catch((err) =>
                console.error(
                  `Gagal mengirim data gempa untuk alat ${deviceId}:`,
                  err
                )
              );
          }
        });

        // Perbarui data terakhir yang diproses
        setLastProcessedData(data);
      }
    });

    return () => unsubscribe();
  }, [lastProcessedData]);

  return (
    <div>
      <h1>Realtime Monitoring Gempa</h1>
    </div>
  );
}

export default FirebaseListener;
