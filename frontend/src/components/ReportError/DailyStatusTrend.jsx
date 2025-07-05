import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import axios from "axios";
import DiagramLineChart from "./format_diagram/DiagramLineChart";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const DailyStatusTrend = forwardRef((props, ref) => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deteksi apakah layar kecil
  const isSmallScreen = window.innerWidth < 640;

  const fetchErrorDaily = async () => {
    try {
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/getDailyStatusTrend"
      );
      const res = response.data.data || [];

      const formatted = res.map((item) => {
        const date = new Date(item.Date);
        const formattedDate = isSmallScreen
          ? date.toLocaleDateString("id-ID", {
              weekday: "short", // misal "Sen"
              day: "numeric",
              month: "short", // misal "Jul"
            })
          : date.toLocaleDateString("id-ID", {
              weekday: "long", // misal "Senin"
              day: "numeric",
              month: "numeric",
              year: "numeric",
            });

        return {
          ...item,
          Date: formattedDate,
        };
      });

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
        interval: isSmallScreen ? "preserveStartEnd" : 0,
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