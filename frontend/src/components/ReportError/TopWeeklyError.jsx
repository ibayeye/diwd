import axios from "axios";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import DiagramBarChart from "./format_diagram/DiagramBarChart";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const TopWeeklyError = forwardRef((props, ref) => {
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
          res.map((item) => new Date(item.Week).toISOString().slice(0, 10))
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
      // console.log("getTopWeeklyError", res);
    } catch (error) {
      console.error("gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorDaily();
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => chartData,
  }));

  if (loading) {
    return (
      <div className="w-32 h-32 mx-auto">
        {/* Light mode animation */}
        <div className="block dark:hidden">
          <Lottie animationData={Load} className="w-full h-full" />
        </div>
        {/* Dark mode animation */}
        <div className="hidden dark:block">
          <Lottie animationData={LoadDark} className="w-full h-full" />
        </div>
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
});

export default TopWeeklyError;
