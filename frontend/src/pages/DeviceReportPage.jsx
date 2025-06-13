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
const DeviceReportPage = () => {
  // activeTab menentukan period yang dipilih: hourly | daily | weekly | monthly
  const [activeTab, setActiveTab] = useState("hourly");
  // viewType menentukan apakah “top” atau “all” untuk tiap period
  const [viewType, setViewType] = useState("top");

  const renderPeriodToggle = () => {
    // Label untuk masing-masing period
    // let topLabel, allLabel;
    // switch (activeTab) {
    //   case "hourly":
    //     topLabel = "Top Error Per Jam";
    //     allLabel = "Semua Error Per Jam";
    //     break;
    //   case "daily":
    //     topLabel = "Top Error Harian";
    //     allLabel = "Semua Error Harian";
    //     break;
    //   case "weekly":
    //     topLabel = "Top Error Mingguan";
    //     allLabel = "Semua Error Mingguan";
    //     break;
    //   case "monthly":
    //     topLabel = "Top Error Bulanan";
    //     allLabel = "Semua Error Bulanan";
    //     break;
    //   default:
    //     topLabel = "Top";
    //     allLabel = "All";
    // }

    return (
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewType("top")}
          className={`px-3 py-1 rounded ${
            viewType === "top" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Top Error
        </button>
        <button
          onClick={() => setViewType("all")}
          className={`px-3 py-1 rounded ${
            viewType === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Semua Error
        </button>
      </div>
    );
  };

  const renderActiveTab = () => {
    // Pastikan selalu render sub-toggle “Top” vs “All” untuk setiap period
    // Kemudian render komponen yang sesuai berdasarkan activeTab & viewType
    switch (activeTab) {
      case "hourly":
        return (
          <div>
            {renderPeriodToggle()}
            {viewType === "top" ? <TopHourlyError /> : <HourlyErrortrend />}
          </div>
        );

      case "daily":
        return (
          <div>
            {renderPeriodToggle()}
            {viewType === "top" ? <TopDailyError /> : <DailyStatusTrend />}
          </div>
        );

      case "weekly":
        return (
          <div>
            {renderPeriodToggle()}
            {viewType === "top" ? <TopWeeklyError /> : <WeeklyStatusTrend />}
          </div>
        );

      case "monthly":
        return (
          <div>
            {renderPeriodToggle()}
            {viewType === "top" ? <TopMonthlyError /> : <MonthlyStatusTrend />}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* ▶️ Bar Tab Utama */}
      <div className="-4">
        <div className="flex gap-2 mb-4 justify-end">
          <button
            onClick={() => {
              setActiveTab("hourly");
              setViewType("top");
            }}
            className={`px-4 py-2 rounded ${
              activeTab === "hourly" ? "bg-blue-500 text-white" : "bg-blue-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            60 D
          </button>
          <button
            onClick={() => {
              setActiveTab("daily");
              setViewType("top");
            }}
            className={`px-4 py-2 rounded ${
              activeTab === "daily" ? "bg-blue-600 text-white" : "bg-blue-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            24
          </button>
          <button
            onClick={() => {
              setActiveTab("weekly");
              setViewType("top");
            }}
            className={`px-4 py-2 rounded ${
              activeTab === "weekly" ? "bg-blue-600 text-white" : "bg-blue-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            7 x 24
          </button>
          <button
            onClick={() => {
              setActiveTab("monthly");
              setViewType("top");
            }}
            className={`px-4 py-2 rounded ${
              activeTab === "monthly" ? "bg-blue-600 text-white" : "bg-blue-200"
            } hover:bg-blue-500 hover:text-white`}
          >
            30 x 24
          </button>
        </div>

        {/* ▶️ Konten Sesuai Tab + Sub-Toggle */}
        <div className="mt-4 w-full h-full">{renderActiveTab()}</div>
      </div>
      <div className="grid grid-cols-2 gap-4 ">
        <div className="bg-white shadow-md p-2 rounded-md">
          Top Error Report
          <div className="h-auto mt-2">
            <TopErrorPerStatus />
          </div>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          Depth - This Month
          <div className="bg-slate-200 h-96 mt-4"></div>
        </div>
      </div>
      <button className="bg-black text-white rounded-md mt-4 px-4 py-2">
        Export
      </button>
    </div>
  );
};

export default DeviceReportPage;
