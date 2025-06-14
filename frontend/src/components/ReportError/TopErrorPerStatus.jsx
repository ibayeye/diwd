import axios from "axios";
import React, { useEffect, useState } from "react";
import DiagramBarChart from "./format_diagram/DiagramBarChart";

const TopErrorPerStatus = () => {
  const [errorData, setErrorData] = useState([]);
  const [lineKeys, setLineKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchError = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getTopErrorPerStatus"
      );

      const res = response.data.data || [];

      // Ambil semua Error Message unik untuk bar
      const uniqueLabels = Array.from(
        new Set(res.map((item) => item["Error Message"]))
      );
      setLineKeys(uniqueLabels);

      // Grouping data berdasarkan Status Label
      const grouped = {};

      res.forEach((item) => {
        const errorMsg = item["Error Message"];
        const status = item["Status Label"];
        const count = item["Count"];

        if (!grouped[status]) {
          grouped[status] = { "Status Label": status };
        }

        grouped[status][errorMsg] = count;
      });

      const formattedData = Object.values(grouped);
      setErrorData(formattedData);
    } catch (error) {
      console.error("Error fetching error data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchError();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <DiagramBarChart
      data={errorData}
      xAxisKey="Status Label"
      valueKeys={lineKeys}
      xAxisProps={{
        interval: 0,
        textAnchor: "end",
        tickMargin: 12,
        label: {
          value: "Status Label",
          position: "bottom",
        },
      }}
    />
  );
};

export default TopErrorPerStatus;
