import React, { useEffect, useRef } from "react";
import axios from "axios";
import { database, ref, onValue } from "./firebase.jsx";

function FirebaseListener() {
  const lastProcessedData = useRef({}); // ✅ gunakan useRef

  useEffect(() => {
    const dbRef = ref(database, "/");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        console.log("Data Firebase:", data);

        Object.entries(data).forEach(([deviceId, deviceData]) => {
          const previousData = lastProcessedData.current[deviceId];
          const isNewDevice = !previousData;

          const valueChanged =
            previousData && previousData.onSiteValue !== deviceData.onSiteValue;

          if (isNewDevice || valueChanged) {
            console.log(
              `onSiteValue berubah untuk alat ${deviceId}:`,
              deviceData.onSiteValue
            );
            axios
              .post("http://localhost:5000/api/v1/earthquake-realtime", {
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

          const statusChanged =
            previousData && previousData.status !== deviceData.status;

          if (statusChanged && deviceData.status !== "0,0") {
            console.log(
              `Status gempa berubah untuk alat ${deviceId}:`,
              deviceData.status
            );
            axios
              .post("http://localhost:5000/api/v1/error-realtime", {
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

          // ✅ Simpan data terakhir
          lastProcessedData.current[deviceId] = deviceData;
        });
      }
    });

    return () => unsubscribe();
  }, []); // ✅ kosong, cukup dijalankan sekali saat mount

  return null;
}

export default FirebaseListener;
