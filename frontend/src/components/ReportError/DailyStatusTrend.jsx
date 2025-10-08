import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import axios from "axios";
import DiagramLineChart from "./format_diagram/DiagramLineChart";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const DailyStatusTrend = forwardRef((props, ref) => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              weekday: "long",
              day: "numeric",
              month: "numeric",
            })
          : date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
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
  }, [isSmallScreen]);

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
    <div className="h-[25rem] sm:h-[30rem] md:h-[34rem] overflow-x-auto">
      <div className="min-w-[700px] sm:min-w-full">
        <DiagramLineChart
          data={dailyData}
          xKey="Date"
          lineKeys={["Critical", "Warning", "Low"]}
          title="Tren Status Error Berdasarkan Hari"
          xAxisProps={{
            interval: isSmallScreen ? "preserveStartEnd" : 0,
            textAnchor: "middle",
            angle: isSmallScreen ? -15 : 0,
            label: {
              value: "Hari",
              position: "bottom",
            },
          }}
        />
      </div>
    </div>
  );
});

export default DailyStatusTrend;
