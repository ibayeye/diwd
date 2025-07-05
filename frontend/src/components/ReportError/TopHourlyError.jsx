import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import axios from "axios";
import DiagramBarChart from "./format_diagram/DiagramBarChart";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const TopHourlyErrorChart = forwardRef((props, ref) => {
  const [chartData, setChartData] = useState([]);
  const [errorKeys, setErrorKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTopHourlyError = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getTopHourlyError"
        );
        const dataArr = response.data.data || [];

        const uniqueErrors = Array.from(
          new Set(dataArr.map((item) => item["Error Message"]))
        );
        setErrorKeys(uniqueErrors);

        const mapByHour = {};
        for (let i = 0; i < 24; i++) {
          mapByHour[i] = { Hour: i };
          uniqueErrors.forEach((key) => {
            mapByHour[i][key] = 0;
          });
        }

        dataArr.forEach((item) => {
          const h = item.Hour;
          const msg = item["Error Message"];
          const cnt = item.Count;
          if (mapByHour[h]) {
            mapByHour[h][msg] = cnt;
          }
        });

        const pivoted = Object.values(mapByHour).sort(
          (a, b) => a.Hour - b.Hour
        );
        setChartData(pivoted);
      } catch (err) {
        console.error("Gagal mengambil top hourly error:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopHourlyError();
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
          xAxisKey="Hour"
          valueKeys={errorKeys}
          title="Top Error Per Jam"
          xAxisProps={{
            interval: 0,
            angle: 0,
            textAnchor: isSmallScreen ? "end" : "middle",
            label: {
              value: "Jam",
              position: "bottom",
              offset: 10,
            },
          }}
        />
      </div>
    </div>
  );
});

export default TopHourlyErrorChart;
