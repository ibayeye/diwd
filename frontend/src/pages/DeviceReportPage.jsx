import axios from "axios";
import { useEffect, useState } from "react";

import TopErrorPerStatus from "../components/ReportError/TopErrorPerStatus";
import TopHourlyError from "../components/ReportError/TopHourlyError";
import HourlyErrortrend from "../components/ReportError/HourlyErrortrend";
import TopDailyError from "../components/ReportError/TopDailyError";
import DailyStatusTrend from "../components/ReportError/DailyStatusTrend";
import TopWeeklyError from "../components/ReportError/TopWeeklyError";
import WeeklyStatusTrend from "../components/ReportError/WeeklyStatusTrend";
import TopMonthlyError from "../components/ReportError/TopMonthlyError";
import MonthlyStatusTrend from "../components/ReportError/MonthlyStatusTrend";
import PredictStatus from "../components/PredictStatus";
import Lottie from "lottie-react";
import Load from "../components/ReportError/load.json";
import LoadDark from "../components/ReportError/load_dark.json";

const DeviceReportPage = () => {
  const [activeTab, setActiveTab] = useState("hourly");
  const [viewType, setViewType] = useState("top");
  const [topHourly, setTopHourly] = useState([]);
  const [allHourly, setAllHourly] = useState([]);
  const [topDaily, setTopDaily] = useState([]);
  const [allDaily, setAllDaily] = useState([]);
  const [topWeekly, setTopWeekly] = useState([]);
  const [allWeekly, setAllWeekly] = useState([]);
  const [topMonthly, setTopMonthly] = useState([]);
  const [allMonthly, setAllMonthly] = useState([]);
  const [topErrorPerStatus, setTopErrorPerStatus] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const normalize = (resp) => {
          if (Array.isArray(resp.data)) {
            return resp.data;
          }
          if (Array.isArray(resp.data?.data)) {
            return resp.data.data;
          }
          console.warn("Unexpected shape:", resp);
          return [];
        };

        const [
          respTh,
          respAh,
          respTd,
          respAd,
          respTw,
          respAw,
          respTm,
          respAm,
          respTes,
        ] = await Promise.all([
          axios.get("https://server.diwd.cloud/api/v1/getTopHourlyError"),
          axios.get("https://server.diwd.cloud/api/v1/getHourlyErrorTrend"),
          axios.get("https://server.diwd.cloud/api/v1/getTopDailyError"),
          axios.get("https://server.diwd.cloud/api/v1/getDailyStatusTrend"),
          axios.get("https://server.diwd.cloud/api/v1/getTopWeeklyError"),
          axios.get("https://server.diwd.cloud/api/v1/getWeeklyStatusTrend"),
          axios.get("https://server.diwd.cloud/api/v1/getTopMothlyError"),
          axios.get("https://server.diwd.cloud/api/v1/getMonthlyStatusTrend"),
          axios.get("https://server.diwd.cloud/api/v1/getTopErrorPerStatus"),
        ]);

        // console.log("raw topHourly:", respTh);
        // console.log("raw allHourly:", respAh);

        setTopHourly(normalize(respTh));
        setAllHourly(normalize(respAh));
        setTopDaily(normalize(respTd));
        setAllDaily(normalize(respAd));
        setTopWeekly(normalize(respTw));
        setAllWeekly(normalize(respAw));
        setTopMonthly(normalize(respTm));
        setAllMonthly(normalize(respAm));
        setTopErrorPerStatus(normalize(respTes));
      } catch (err) {
        console.error("Gagal fetch semua data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const exportToCSV = (data, filename = "export.csv") => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((r) =>
      Object.values(r)
        .map((v) => `"${v}"`)
        .join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportAll = () => {
    const allData = [
      ...topHourly.map((r) => ({ section: "TopHourly", ...r })),
      ...allHourly.map((r) => ({ section: "AllHourly", ...r })),
      ...topDaily.map((r) => ({ section: "TopDaily", ...r })),
      ...allDaily.map((r) => ({ section: "AllDaily", ...r })),
      ...topWeekly.map((r) => ({ section: "TopWeekly", ...r })),
      ...allWeekly.map((r) => ({ section: "AllWeekly", ...r })),
      ...topMonthly.map((r) => ({ section: "TopMonthly", ...r })),
      ...allMonthly.map((r) => ({ section: "AllMonthly", ...r })),
      ...topErrorPerStatus.map((r) => ({ section: "TopErrorPerStatus", ...r })),
    ];

    if (allData.length) {
      exportToCSV(allData, "all-error-report.csv");
    } else {
      alert("Tidak ada data untuk diekspor.");
    }
  };

  const renderPeriodToggle = () => (
    <div className="flex gap-2 mb-4 text-xs md:text-sm">
      <button
        onClick={() => setViewType("top")}
        className={`px-3 py-1 rounded ${
          viewType === "top"
            ? "bg-blue-600 dark:bg-orange-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Top Error
      </button>
      <button
        onClick={() => setViewType("all")}
        className={`px-3 py-1 rounded ${
          viewType === "all"
            ? "bg-blue-600 dark:bg-orange-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Semua Error
      </button>
    </div>
  );

  const renderActiveTab = () => {
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

    switch (activeTab) {
      case "hourly":
        return (
          <div>
            {renderPeriodToggle()}
            {viewType === "top" ? (
              <TopHourlyError data={topHourly} loading={loading} />
            ) : (
              <HourlyErrortrend data={allHourly} loading={loading} />
            )}
          </div>
        );
      case "daily":
        return (
          <div>
            {renderPeriodToggle()}
            {viewType === "top" ? (
              <TopDailyError data={topDaily} loading={loading} />
            ) : (
              <DailyStatusTrend data={allDaily} loading={loading} />
            )}
          </div>
        );
      case "weekly":
        return (
          <div>
            {renderPeriodToggle()}
            {viewType === "top" ? (
              <TopWeeklyError data={topWeekly} loading={loading} />
            ) : (
              <WeeklyStatusTrend data={allWeekly} loading={loading} />
            )}
          </div>
        );
      case "monthly":
        return (
          <div>
            {renderPeriodToggle()}
            {viewType === "top" ? (
              <TopMonthlyError data={topMonthly} loading={loading} />
            ) : (
              <MonthlyStatusTrend data={allMonthly} loading={loading} />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="p-4 space-y-6 bg-white dark:bg-gray-800 font-Poppins shadow-md rounded-lg">
        <div className="flex gap-2 mb-4 justify-end text-xs md:text-sm">
          {[
            { label: "Jam", value: "hourly" },
            { label: "Hari", value: "daily" },
            { label: "Minggu", value: "weekly" },
            { label: "Bulan", value: "monthly" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setViewType("top");
              }}
              className={`px-4 py-2 rounded ${
                activeTab === tab.value
                  ? "bg-blue-600 dark:bg-orange-500 text-white"
                  : "bg-blue-200 dark:bg-white dark:text-gray-700"
              } hover:bg-blue-500 hover:text-white`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {renderActiveTab()}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10 dark:text-white">
          <TopErrorPerStatus data={topErrorPerStatus} loading={loading} />
          <div>
            <div className="mb-2 font-semibold">Status Perangkat</div>
            <PredictStatus />
          </div>
        </div>
      </div>
      <div className="flex justify-end w-full text-sm py-6">
        <button
          onClick={handleExportAll}
          className="border border-blue-600 dark:border-orange-500 dark:text-white rounded-md px-4 py-2"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default DeviceReportPage;
