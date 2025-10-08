import axios from "axios";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import DiagramBarChart from "./format_diagram/DiagramBarChart";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const TopDailyError = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [errorKeys, setErrorKeys] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getTopDailyError"
        );
        const raw = response.data.data || [];
        console.log(raw);

        const mapped = raw.map((item) => {
          const dateObj = new Date(item.Date);
          const dateKey = dateObj.toISOString().slice(0, 10);
          const formattedDate = isSmallScreen
            ? dateObj.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })
            : dateObj.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });

          return {
            dateKey,
            Date: formattedDate,
            errorMessage: item["Simplified Message"],
            count: item.Count,
          };
        });

        const uniqueDates = Array.from(
          new Set(mapped.map((i) => i.dateKey))
        ).sort();
        const uniqueErrors = Array.from(
          new Set(mapped.map((i) => i.errorMessage))
        );

        setErrorKeys(uniqueErrors);

        const mapByDate = {};
        uniqueDates.forEach((dateKey) => {
          const { Date: formatted } = mapped.find((i) => i.dateKey === dateKey);
          mapByDate[dateKey] = { Date: formatted };
          uniqueErrors.forEach((err) => {
            mapByDate[dateKey][err] = 0;
          });
        });

        mapped.forEach(({ dateKey, errorMessage, count }) => {
          mapByDate[dateKey][errorMessage] = count;
        });

        const pivoted = uniqueDates.map((dateKey) => mapByDate[dateKey]);
        setChartData(pivoted);
      } catch (err) {
        console.error("Gagal ambil TopDailyError:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSmallScreen]);

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
          xAxisKey="Date"
          valueKeys={errorKeys}
          title="Error Dominan Berdasarkan Hari"
          xAxisProps={{
            interval: isSmallScreen ? "preserveStartEnd" : 0,
            angle: isSmallScreen ? -15 : 0,
            textAnchor: isSmallScreen ? "end" : "middle",
            label: {
              value: "Hari",
              position: "bottom",
            },
          }}
        />
      </div>
    </div>
  );
});

export default TopDailyError;
