import axios from "axios";
import React, { useEffect, useState } from "react";
import DiagramLineChart from "./format_diagram/DiagramLineChart";

const RawWeeklyStatusDiagram = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/getWeeklyStatusTrend"
        );
        const res = response.data.data || [];

        const formatted = res.map((item) => ({
        ...item,
        Date: new Date(item.Date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          // tahun bisa dihilangkan kalau semua data di tahun yang sama
        }),
      }));

        setData(formatted);
      } catch (err) {
        console.error("Gagal mengambil data weekly status trend:", err);
      } 
      
      finally {
        setLoading(false);
      }
    };

    fetchData();
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
      data={data}
      xKey="Week"
      lineKeys={["Critical", "Low", "Warning"]}
      title="Trend Status Error per Minggu"
      xAxisLabel="Minggu"
      xAxisProps={{
        interval: 0,
        angle: -20,
        textAnchor: "end",
      }}
    />
  );
};

export default RawWeeklyStatusDiagram;
