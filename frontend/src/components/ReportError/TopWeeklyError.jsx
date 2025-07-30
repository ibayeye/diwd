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
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchErrorDaily = async () => {
    try {
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/getTopWeeklyError"
      );

      const res = response.data.data || [];

      const uniqueWeeks = Array.from(
        new Set(
          res.map((item) =>
            new Date(item.Week).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          )
        )
      ).sort();

      const uniqueErrors = Array.from(
        new Set(res.map((item) => item["Simplified Message"]))
      );

      setErrorKeys(uniqueErrors);

      const mapByWeek = {};
      uniqueWeeks.forEach((week) => {
        mapByWeek[week] = { Week: week };
        uniqueErrors.forEach((err) => {
          mapByWeek[week][err] = 0;
        });
      });

      res.forEach(({ Week: resWeek, "Simplified Message": err, Count }) => {
        const key = new Date(resWeek).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        if (mapByWeek[key]) {
          mapByWeek[key][err] = Count;
        }
      });

      const pivoted = uniqueWeeks.map((week) => mapByWeek[week]);
      setChartData(pivoted);
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
    <div className="h-[25rem] sm:h-[30rem] md:h-[34rem] overflow-x-auto">
      <div className="min-w-[700px] sm:min-w-full">
        <DiagramBarChart
          data={chartData}
          xAxisKey="Week"
          valueKeys={errorKeys}
          title="Error Dominan Berdasarkan Minggu"
          xAxisProps={{
            interval: 0,
            angle: isSmallScreen ? -15 : 0,
            textAnchor: isSmallScreen ? "end" : "middle",
            label: {
              value: "Minggu",
              position: "bottom",
              offset: 10,
            },
          }}
        />
      </div>
    </div>
  );
});

export default TopWeeklyError;
