// src/components/MonthlyStatusTrend.jsx
import axios from "axios";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import DiagramLineChart from "./format_diagram/DiagramLineChart";
import Lottie from "lottie-react";
import Load from "./load.json";
import LoadDark from "./load_dark.json";

const MonthlyStatusTrend = forwardRef((props, ref) => {
  const [monthlyStatusTrend, setMonthlyStatusTrend] = useState([]);
  const [lineKeys, setLineKeys] = useState([]);
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
        "https://server.diwd.cloud/api/v1/getMonthlyStatusTrend"
      );

      const res = response.data.data || [];

      const uniqueLabels = Array.from(
        new Set(res.map((i) => i["Status Label"]))
      );
      setLineKeys(uniqueLabels);

      const mapByMonth = {};
      res.forEach((item) => {
        const [year, month] = item.Month.split("-").map(Number);
        const monthKey = `${year}-${String(month).padStart(2, "0")}`;
        const date = new Date(year, month - 1);

        const formatted = date.toLocaleDateString("id-ID", {
          month: isSmallScreen ? "numeric" : "short",
          year: "numeric",
        });

        if (!mapByMonth[monthKey]) {
          mapByMonth[monthKey] = { Month: formatted };
          uniqueLabels.forEach((lbl) => {
            mapByMonth[monthKey][lbl] = 0;
          });
        }
        mapByMonth[monthKey][item["Status Label"]] = item.Count;
      });

      const sortedKeys = Object.keys(mapByMonth).sort((a, b) => {
        const [ay, am] = a.split("-").map(Number);
        const [by, bm] = b.split("-").map(Number);
        return new Date(ay, am - 1) - new Date(by, bm - 1);
      });
      const pivoted = sortedKeys.map((k) => mapByMonth[k]);

      setMonthlyStatusTrend(pivoted);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorDaily();
  }, [isSmallScreen]);

  useImperativeHandle(ref, () => ({
    getData: () => monthlyStatusTrend,
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
      <div className="min-w-[700px] sm:min-w-full font-Poppins">
        <DiagramLineChart
          data={monthlyStatusTrend}
          xKey="Month"
          lineKeys={lineKeys}
          title="Tren Status Error Berdasarkan Bulan"
          xAxisProps={{
            interval: 0,
            angle: 0,
            textAnchor: "middle",
            label: {
              value: "Bulan",
              offset: 15,
              position: "bottom",
            },
          }}
        />
      </div>
    </div>
  );
});

export default MonthlyStatusTrend;
