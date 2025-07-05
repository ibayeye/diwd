import axios from "axios";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import LineChart from "./format_diagram/DiagramLineChart";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const HourlyErrortrend = forwardRef((props, ref) => {
  const [hourlyErrorTrend, setHourlyErrorTrend] = useState([]);
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
    const fetchHourlyErrortrend = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getHourlyErrorTrend"
        );

        const rawObj = response.data.data || {};

        const arr = Object.entries(rawObj)
          .map(([hourString, count]) => ({
            hour: Number(hourString),
            count: Number(count),
          }))
          .sort((a, b) => a.hour - b.hour);

        setHourlyErrorTrend(arr);
      } catch (err) {
        console.error("Gagal mengambil data HourlyErrortrend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyErrortrend();
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => hourlyErrorTrend,
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
        <LineChart
          data={hourlyErrorTrend}
          xKey="hour"
          lineKeys={["count"]}
          title="Hourly Error Trend"
          xAxisProps={{
            interval: 0,
            angle: 0,
            textAnchor: isSmallScreen ? "end" : "middle",
            label: {
              value: "Jam",
              position: "bottom",
              offset: 10,
            },
          }}
        />
      </div>
    </div>
  );
});

export default HourlyErrortrend;
