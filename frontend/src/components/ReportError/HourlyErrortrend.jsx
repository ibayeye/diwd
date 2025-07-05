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
  const [hourlyErrorTrend, setHourlyErrorTrend] = useState([]); // akan menjadi array [{ hour, count }, …]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHourlyErrortrend = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getHourlyErrorTrend"
        );

        const rawObj = response.data.data || {};

        // c) transform: Object.entries(rawObj) => [ ["0",8344], ["1",6285], … ]
        const arr = Object.entries(rawObj)
          .map(([hourString, count]) => {
            return {
              hour: Number(hourString),
              count: Number(count),
            };
          })
          // d) urutkan berdasarkan hour ascending (0,1,2,…,23)
          .sort((a, b) => a.hour - b.hour);

        setHourlyErrorTrend(arr);
      } catch (err) {
        console.error("Gagal mengambil data HourlyErrortrendError:", err);
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
    <LineChart
      data={hourlyErrorTrend}
      xKey="hour"
      lineKeys={["count"]}
      title="Hourly Error Trend"
      xAxisProps={{
        label: {
          value: "Jam",
          positition: "bottom",
        },
      }}
    />
  );
});

export default HourlyErrortrend;
