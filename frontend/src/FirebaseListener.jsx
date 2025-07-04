import React, { useEffect, useRef } from "react";
import axios from "axios";
import { database, ref, onValue } from "./firebase.jsx";

function FirebaseListener() {
  const lastProcessedData = useRef({});
  const lastAllDataSnapshot = useRef(null);

  useEffect(() => {
    const dbRef = ref(database, "/");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // console.log("Data Firebase:", data);

        const dataString = JSON.stringify(data);
        const prevDataString = JSON.stringify(lastAllDataSnapshot.current);
        const allDataChanged = dataString !== prevDataString;

        if (allDataChanged) {
          axios
            .post("https://server.diwd.cloud/api/v1/all-device", data)
            .then((res) =>
              console.log("Semua data Firebase dikirim ke server:", res.data)
            )
            .catch((err) =>
              console.error("Gagal mengirim semua data ke server:", err)
            );

          lastAllDataSnapshot.current = data; // ✅ simpan snapshot terakhir
        }

        Object.entries(data).forEach(([deviceId, deviceData]) => {
          const previousData = lastProcessedData.current[deviceId];
          const isNewDevice = !previousData;

          const valueChanged =
            previousData && previousData.regValue !== deviceData.regValue;

          const statusChanged =
            previousData && previousData.status !== deviceData.status;

          // Kirim jika baru atau regValue berubah
          if ((isNewDevice && deviceData.regValue !== "0 MMI , 0 gal") || (valueChanged && deviceData.regValue !== "0,0")) {
            axios.post("https://server.diwd.cloud/api/v1/earthquake-realtime", {
              device_id: deviceId,
              ...deviceData,
            });
          }

          // Kirim jika status berubah dan bukan "0,0"
          if ((isNewDevice && deviceData.status !== "0,0")  || (statusChanged && deviceData.status !== "0,0")) {
            axios.post("https://server.diwd.cloud/api/v1/error-realtime", {
              device_id: deviceId,
              ...deviceData,
            });
          }

          // Simpan data terakhir di memori
          lastProcessedData.current[deviceId] = deviceData;
        });
      }
    });

    return () => unsubscribe();
  }, []); // ✅ kosong, cukup dijalankan sekali saat mount

  return null;
}

export default FirebaseListener;
