// src/components/WeeklyStatusTrend.jsx
import axios from "axios";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import DiagramLineChart from "./format_diagram/DiagramLineChart";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const WeeklyStatusTrend = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getWeeklyStatusTrend"
        );
        const res = response.data.data || [];

        const formatted = res.map((item) => {
          const date = new Date(item.Week);

          const formattedDate = isSmallScreen
            ? date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
              }) // contoh: 5 Jul
            : date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              }); // contoh: Sab, 5 Juli

          return {
            ...item,
            Week: formattedDate,
          };
        });

        setData(formatted);
      } catch (err) {
        console.error("Gagal mengambil data weekly status trend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSmallScreen]);

  useImperativeHandle(ref, () => ({
    getData: () => data,
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
    <div className="h-[25rem] sm:h-[30rem] md:h-[34rem] overflow-auto">
      <div className="min-w-[700px] sm:min-w-full">
        <DiagramLineChart
          data={data}
          xKey="Week"
          lineKeys={["Critical", "Warning", "Low"]}
          title="Tren Status Error Berdasarkan Minggu"
          xAxisProps={{
            interval: isSmallScreen ? "preserveStartEnd" : 0,
            angle: isSmallScreen ? -15 : 0,
            textAnchor: isSmallScreen ? "end" : "middle",
            label: {
              value: "Minggu",
              position: "bottom",
            },
          }}
        />
      </div>
    </div>
  );
});

export default WeeklyStatusTrend;
