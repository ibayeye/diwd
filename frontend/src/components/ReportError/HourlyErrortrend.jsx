import axios from "axios";
import React, { useEffect, useState } from "react";
import LineChart from "./format_diagram/DiagramLineChart";

const HourlyErrortrend = () => {
  const [hourlyErrorTrend, setHourlyErrorTrend] = useState([]); // akan menjadi array [{ hour, count }, …]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHourlyErrortrend = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/getHourlyErrorTrend"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
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
        label:{
          value: "Jam",
          positition: "bottom"
        }
      }}
    />
  );
};

export default HourlyErrortrend;
