// src/components/DailyStatusTrend.jsx
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import axios from "axios";
import DiagramLineChart from "./format_diagram/DiagramLineChart";
import { FaSpinner } from "react-icons/fa";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
const DailyStatusTrend = forwardRef((props, ref) => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchErrorDaily = async () => {
    try {
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/getDailyStatusTrend"
      );
      const res = response.data.data || [];

      const formatted = res.map((item) => ({
        ...item,
        Date: new Date(item.Date).toLocaleDateString("id-ID", {
          weekday: "long",
          month: "numeric",
          year: "numeric",
          // tahun bisa dihilangkan kalau semua data di tahun yang sama
        }),
      }));
      setDailyData(formatted);
    } catch (error) {
      console.error("Gagal mengambil daily status trend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorDaily();
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => dailyData,
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
    <DiagramLineChart
      data={dailyData}
      xKey="Date"
      lineKeys={["Critical", "Warning", "Low"]}
      title="Error Harian"
      xAxisProps={{
        interval: 0,
        textAnchor: "end",
        label: {
          value: "Hari",
          position: "bottom",
        },
      }}
    />
  );
});

export default DailyStatusTrend;
