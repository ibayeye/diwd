import axios from "axios";
import React, { useEffect, useState } from "react";
import DiagramBarChart from "./format_diagram/DiagramBarChart";

const TopWeeklyError = () => {
  const [chartData, setChartData] = useState([]);
  const [errorKeys, setErrorKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchErrorDaily = async () => {
    try {
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/getTopWeeklyError"
      );

      const res = response.data.data || [];

      const uniqueWeeks = Array.from(
      new Set(
        res.map(item =>
          new Date(item.Week).toISOString().slice(0, 10)
        )
      )
    ).sort();

      const uniqueErrors = Array.from(
        new Set(res.map((item) => item["Error Message"]))
      );

      setErrorKeys(uniqueErrors);

      const mapByWeek = {};
      uniqueWeeks.forEach((week) => {
        mapByWeek[week] = { Week: week };
        uniqueErrors.forEach((err) => {
          mapByWeek[week][err] = 0;
        });
      });

      // 4) isi count
      res.forEach(({ Week: resWeek, "Error Message": err, Count }) => {
        const key = new Date(resWeek).toISOString().slice(0, 10);
        if (mapByWeek[key]) {
          mapByWeek[key][err] = Count;
        }
      });

      // 5) bentuk array terurut
      const pivoted = uniqueWeeks.map((week) => mapByWeek[week]);
      setChartData(pivoted);
      console.log("getTopWeeklyError", res);
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
        <div
          className="animate-spin rounded-full h-12 w-12
                     border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="h-96 overflow-auto">
      <DiagramBarChart
        data={chartData}
        xAxisKey="Week"
        valueKeys={errorKeys}
        title="Top Error Per Minggu"
      />
    </div>
  );
};

export default TopWeeklyError;
