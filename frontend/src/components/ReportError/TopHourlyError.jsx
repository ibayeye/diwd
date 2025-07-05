import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import axios from "axios";
import DiagramBarChart from "./format_diagram/DiagramBarChart";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
const TopHourlyErrorChart = forwardRef((props, ref) => {
  const [chartData, setChartData] = useState([]); // data siap pakai untuk chart
  const [errorKeys, setErrorKeys] = useState([]); // daftar Error Message unik
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Tambahkan state untuk menangani error

  useEffect(() => {
    const fetchTopHourlyError = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getTopHourlyError"
        );
        const dataArr = response.data.data || [];

        // 1) Cari daftar Error Message unik
        const uniqueErrors = Array.from(
          new Set(dataArr.map((item) => item["Error Message"]))
        );
        setErrorKeys(uniqueErrors);

        // 2) Inisialisasi mapByHour untuk semua 24 jam (0-23)
        // Ini memastikan bahwa semua jam memiliki entri, bahkan jika tidak ada data dari API
        const mapByHour = {};
        for (let i = 0; i < 24; i++) {
          mapByHour[i] = { Hour: i };
          uniqueErrors.forEach((key) => {
            mapByHour[i][key] = 0; // Inisialisasi semua error count ke 0 untuk setiap jam
          });
        }

        // 3) Isi nilai count dari data API ke mapByHour
        dataArr.forEach((item) => {
          const h = item.Hour;
          const msg = item["Error Message"];
          const cnt = item.Count;

          // Pastikan jamnya ada di mapByHour (seharusnya selalu ada karena sudah diinisialisasi)
          if (mapByHour[h]) {
            mapByHour[h][msg] = cnt;
          }
        });

        // 4) Ubah menjadi array dan urutkan berdasarkan hour
        const pivoted = Object.values(mapByHour).sort(
          (a, b) => a.hour - b.hour
        );
        setChartData(pivoted);
      } catch (err) {
        console.error("Gagal mengambil top hourly error:", err);
        setError("Gagal memuat data. Silakan coba lagi."); // Set pesan error
      } finally {
        setLoading(false);
      }
    };

    fetchTopHourlyError();
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => chartData,
  }));

  if (loading) {
    return (
      <div className="w-32 h-32 mx-auto">
        <div className="block dark:hidden">
          <Lottie animationData={Load} className="w-full h-full" />
        </div>
        <div className="hidden dark:block">
          <Lottie animationData={LoadDark} className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <DiagramBarChart
      data={chartData}
      xAxisKey="Hour"
      valueKeys={errorKeys}
      title="Top Error Per  jam"
      xAxisProps={{
        interval: 0,
        angle: -0,
        textAnchor: "end",
        label: {
          value: "Jam",
          position: "bottom", // bisa "insideBottom" atau "bottom"
        },
      }}
    />
  );
});

export default TopHourlyErrorChart;
