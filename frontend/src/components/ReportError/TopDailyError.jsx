// src/components/TopDailyError.jsx
import axios from "axios";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import DiagramBarChart from "./format_diagram/DiagramBarChart";
import { Label } from "recharts";
import Lottie from "lottie-react";
import Load from "./load.json";

const TopDailyError = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [errorKeys, setErrorKeys] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getTopDailyError"
        );
        const raw = response.data.data || [];

        // Map raw data: format date and rename fields
        const mapped = raw.map((item) => {
          const dateObj = new Date(item.Date);
          const dateKey = dateObj.toISOString().slice(0, 10);
          const formattedDate = dateObj.toLocaleDateString("id-ID", {
            weekday: "long",
            month: "numeric",
            year: "numeric",
          });
          return {
            dateKey,
            Date: formattedDate,
            errorMessage: item["Error Message"],
            count: item.Count,
          };
        });

        // Unique dates and error messages
        const uniqueDates = Array.from(
          new Set(mapped.map((i) => i.dateKey))
        ).sort();
        const uniqueErrors = Array.from(
          new Set(mapped.map((i) => i.errorMessage))
        );

        setErrorKeys(uniqueErrors);

        // Initialize pivot map
        const mapByDate = {};
        uniqueDates.forEach((dateKey) => {
          // find formatted Date once per dateKey
          const { Date: formatted } = mapped.find((i) => i.dateKey === dateKey);
          mapByDate[dateKey] = { Date: formatted };
          uniqueErrors.forEach((err) => {
            mapByDate[dateKey][err] = 0;
          });
        });

        // Fill counts
        mapped.forEach(({ dateKey, errorMessage, count }) => {
          mapByDate[dateKey][errorMessage] = count;
        });

        // Build final array
        const pivoted = uniqueDates.map((dateKey) => mapByDate[dateKey]);
        setChartData(pivoted);
      } catch (err) {
        console.error("Gagal ambil TopDailyError:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => chartData,
  }));

  if (loading) {
    return (
      <div className="">
        <Lottie animationData={Load} className="w-32 h-32 mx-auto" />
      </div>
    );
  }

  return (
    <div className="h-[30rem]">
      <DiagramBarChart
        data={chartData}
        xAxisKey="Date"
        valueKeys={errorKeys}
        title="Top Error per Hari"
        xAxisProps={{
          interval: 0,
          angle: -0,
          textAnchor: "end",
          label: {
            value: "Hari",
            position: "bottom", // bisa "insideBottom" atau "bottom"
          },
        }}
      />
    </div>
  );
});

export default TopDailyError;
