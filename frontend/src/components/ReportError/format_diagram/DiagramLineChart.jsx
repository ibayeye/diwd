// src/components/LineChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * DiagramLineChart
 *
 * Props:
 * - data:       Array objek yang akan diplot, misalnya:
 *               [ { xKey: '2025-06-01', yKey1: 120, yKey2:  80 }, … ]
 * - xKey:       String nama properti di objek yang jadi sumbu X (kategori), misalnya "Date"
 * - lineKeys:   Array string nama properti yang diplot sebagai garis, misalnya ["Warning", "Low"]
 * - title:      (optional) Judul chart di atas grafik
 * - colors:     (optional) Array warna untuk tiap garis; default disediakan di bawah
 */

const DEFAULT_COLORS = [
  "#DC2626", // Red
  "#FFC107",
  "#16A34A", // Green
  "#2563EB", // Blue
  "#4F46E5", // Indigo
  "#9333EA", // Purple
  "#D97706", // Amber
];

const DiagramLineChart = ({
  data,
  xKey,
  lineKeys,
  title,
  colors = DEFAULT_COLORS,
  xAxisProps = {},
  xAxisLabel,
}) => {
  const isDarkMode = document.documentElement.classList.contains("dark");
  const textColor = isDarkMode ? "#ffffff" : "#374151";
  const tooltipBg = isDarkMode ? "#1F2937" : "#ffffff";
  const tooltipTextColor = isDarkMode ? "#ffffff" : "#000000";

  return (
    <div className="w-full h-[30rem] dark:text-white">
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-center dark:text-white">
          {title}
        </h2>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: textColor }}
            label={{
              value: xAxisLabel,
              position: "bottom",
              offset: -10,
              fill: textColor,
              fontSize: 14,
            }}
            {...xAxisProps}
          />
          <YAxis
            tick={{ fontSize: 12, fill: textColor }}
            label={{
              value: "Jumlah Error",
              angle: -90,
              position: "insideLeft",
              fill: textColor,
              fontSize: 14,
            }}
          />
          <Tooltip
            formatter={(value, name) => [value, name]}
            cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 2 }}
            contentStyle={{
              backgroundColor: tooltipBg,
              color: tooltipTextColor,
              borderRadius: 4,
              fontSize: "0.875rem",
            }}
          />
          <Legend
            verticalAlign="top"
            align="left"
            height={36}
            wrapperStyle={{
              fontSize: "0.875rem",
              paddingLeft: "25px",
              color: textColor,
            }}
          />
          {lineKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiagramLineChart;