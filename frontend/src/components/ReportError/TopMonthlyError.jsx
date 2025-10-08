// src/components/TopMonthlyError.jsx
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

const TopMonthlyError = forwardRef((props, ref) => {
  const [topMonthlyError, setTopMonthlyError] = useState([]);
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

  const fetchErrorMonthly = async () => {
    try {
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/getTopMothlyError"
      );

      const res = response.data.data || [];

      const mapped = res.map((item) => {
        const dateObj = new Date(item.Month);
        const monthKey = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
        const formattedMonth = dateObj.toLocaleDateString("id-ID", {
          month: isSmallScreen ? "numeric" : "short",
          year: "numeric",
        });

        return {
          monthKey,
          Month: formattedMonth,
          errorMessage: item["Simplified Message"],
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
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorMonthly();
  }, [isSmallScreen]);

  useImperativeHandle(ref, () => ({
    getData: () => topMonthlyError,
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
    <div className="h-[25rem] overflow-x-auto">
      <div className="min-w-[700px] sm:min-w-full">
        <DiagramBarChart
          data={topMonthlyError}
          xAxisKey="Month"
          valueKeys={errorKeys}
          title="Error Dominan Berdasarkan Bulan"
          xAxisProps={{
            interval: 0,
            angle: 0,
            textAnchor: "middle",
            label: {
              value: "Bulan",
              position: "bottom",
              offset: 15,
            },
          }}
        />
      </div>
    </div>
  );
});

export default TopMonthlyError;