import axios from "axios";
import React, { useEffect, useState } from "react";
import DiagramLineChart from "./format_diagram/DiagramLineChart";

const MonthlyStatusTrend = () => {
  const [monthlyStatusTrend, setMonthlyStatusTrend] = useState([]);
  const [lineKeys, setLineKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchErrorDaily = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getMonthlyStatusTrend"
      );

      const res = response.data.data || [];

      // 1) Dapatkan daftar label unik dan key untuk sorting
      const uniqueLabels = Array.from(
        new Set(res.map((i) => i["Status Label"]))
      );
      setLineKeys(uniqueLabels);

      // 2) Pivot per month
      // Buat map: monthKey -> { Month: formatted, [label]: count }
      const mapByMonth = {};
      res.forEach((item) => {
        // parse month
        const [year, month] = item.Month.split("-").map(Number);
        const monthKey = `${year}-${String(month).padStart(2, "0")}`;
        const formatted = new Date(year, month - 1).toLocaleDateString(
          "id-ID",
          {
            month: "long",
            year: "numeric",
          }
        );
        if (!mapByMonth[monthKey]) {
          mapByMonth[monthKey] = { Month: formatted };
          uniqueLabels.forEach((lbl) => {
            mapByMonth[monthKey][lbl] = 0;
          });
        }
        mapByMonth[monthKey][item["Status Label"]] = item.Count;
      });

      // 3) Sort monthKeys secara kronologis dan bangun array
      const sortedKeys = Object.keys(mapByMonth).sort((a, b) => {
        const [ay, am] = a.split("-").map(Number);
        const [by, bm] = b.split("-").map(Number);
        return new Date(ay, am - 1) - new Date(by, bm - 1);
      });
      const pivoted = sortedKeys.map((k) => mapByMonth[k]);

      setMonthlyStatusTrend(pivoted);
      console.log("MonthlyStatusTrend pivoted:", pivoted);
    } catch (error) {
      console.error("gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorDaily();
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
        data={monthlyStatusTrend}
        xKey="Month"
        lineKeys={lineKeys}
        title="Error per Bulan"
        xAxisProps={{
          interval: 0, // tampilkan semua
          angle: -15, // miring 45° agar muat
          textAnchor: "end", // agar rotasi tidak terpotong
          label: {
            value: "Bulan",
            textAnchor: "end",
            offset: 15,
          },
        }}
      />
  );
};

export default MonthlyStatusTrend;
