import axios from "axios";
import React, { useEffect, useState } from "react";
import DiagramBarChart from "./format_diagram/DiagramBarChart";

const TopMonthlyError = () => {
  const [topMonthlyError, setTopMonthlyError] = useState([]);
  const [errorKeys, setErrorKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchErrorMonthly = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getTopMothlyError"
      );

      const res = response.data.data || [];

      const mapped = res.map((item) => {
        const dateObj = new Date(item.Month);
        const monthKey = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`; // contoh: "2025-6"
        const formattedMonth = dateObj.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        }); // contoh: "Juni 2025"

        return {
          monthKey,
          Month: formattedMonth,
          errorMessage: item["Error Message"],
          count: item.Count,
        };
      });

      const uniqueMonths = Array.from(
        new Set(mapped.map((i) => i.monthKey))
      ).sort((a, b) => {
        const dateA = new Date(a.split("-")[0], a.split("-")[1] - 1);
        const dateB = new Date(b.split("-")[0], b.split("-")[1] - 1);
        return dateA - dateB;
      });

      const uniqueErrors = Array.from(
        new Set(mapped.map((i) => i.errorMessage))
      );

      setErrorKeys(uniqueErrors);

      const mapByMonth = {};
      uniqueMonths.forEach((monthKey) => {
        const { Month: formatted } = mapped.find(
          (i) => i.monthKey === monthKey
        );
        mapByMonth[monthKey] = { Month: formatted };
        uniqueErrors.forEach((err) => {
          mapByMonth[monthKey][err] = 0;
        });
      });

      mapped.forEach(({ monthKey, errorMessage, count }) => {
        mapByMonth[monthKey][errorMessage] = count;
      });

      const pivoted = uniqueMonths.map((monthKey) => mapByMonth[monthKey]);
      setTopMonthlyError(pivoted);

      console.log("getTopMonthlyError", res);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorMonthly();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-[35rem] ">
      <DiagramBarChart
        data={topMonthlyError}
        xAxisKey="Month"
        valueKeys={errorKeys}
        title="Top Error Per Bulan"
        xAxisProps={{
          interval: 0,
          angle: -15,
          textAnchor: "end",
          label: {
            value: "Bulan",
            position: "bottom", // bisa "insideBottom" atau "bottom"
            offset: 15, // geser 15px ke bawah
          },
        }}
      />
    </div>
  );
};

export default TopMonthlyError;
