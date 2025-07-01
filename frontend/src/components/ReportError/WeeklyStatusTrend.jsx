import axios from "axios";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import DiagramLineChart from "./format_diagram/DiagramLineChart";

const RawWeeklyStatusDiagram = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getWeeklyStatusTrend"
        );
        const res = response.data.data || [];

        const formatted = res.map((item) => ({
          ...item,
          Week: new Date(item.Week).toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric",
            month: "long",
            // tahun bisa dihilangkan kalau semua data di tahun yang sama
          }),
        }));

        setData(formatted);
      } catch (err) {
        console.error("Gagal mengambil data weekly status trend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useImperativeHandle(ref, () => ({
      getData: () => data,
    }));

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
      lineKeys={["Critical", "Warning", "Low"]}
      title="Trend Status Error per Minggu"
      xAxisProps={{
        interval: 0,
        angle: 0,
        textAnchor: "end",
        label: {
          value: "Minggu",
          position: "bottom",
        },
      }}
    />
  );
});

export default RawWeeklyStatusDiagram;
