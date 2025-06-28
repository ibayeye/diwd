// src/components/DailyStatusTrend.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import DiagramLineChart from "./format_diagram/DiagramLineChart";
const DailyStatusTrend = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <DiagramLineChart
      data={dailyData}
      xKey="Date"
      lineKeys={["Critical", "Warning",  "Low"]}
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
};

export default DailyStatusTrend;
