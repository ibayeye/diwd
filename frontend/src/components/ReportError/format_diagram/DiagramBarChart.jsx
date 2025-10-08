// src/components/DiagramBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * DiagramBarChart
 *
 * Props:
 * - data:        Array objek pivoted, misalnya:
 *                [ { categoryKey: 'A', valueKey1: 120, valueKey2:  80 }, … ]
 * - xAxisKey:    String nama properti kategori (dipetakan ke sumbu X).
 * - valueKeys:   Array string nama properti yang diplot sebagai bar (bisa 1 atau lebih).
 * - title:       (optional) Judul chart.
 * - colors:      (optional) Array warna untuk tiap bar; gunakan default jika tidak disediakan.
 */

const DEFAULT_COLORS = [
  "#4F46E5",
  "#16A34A",
  "#D97706",
  "#DC2626",
  "#2563EB",
  "#9333EA",
  "#D946EF",
  "#F59E0B",
  "#059669",
  "#8B5CF6",
  "#EF4444",
  "#10B981",
];

const DiagramBarChart = ({
  data,
  xAxisKey,
  valueKeys,
  title,
  colors = DEFAULT_COLORS,
  xAxisLabel,
  xAxisProps,
}) => {
  // Deteksi dark mode
  const isDarkMode = document.documentElement.classList.contains("dark");
  const textColor = isDarkMode ? "#ffffff" : "#374151";
  const tooltipBg = isDarkMode ? "#1F2937" : "#ffffff";
  const tooltipTextColor = isDarkMode ? "#ffffff" : "#000000";

  return (
    <div className="w-full h-[30rem] dark:text-white font-Poppins">
      {title && (
        <h2 className="font-Poppins text-2xl mb-4 text-center dark:text-white">
          {title}
        </h2>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            type="category"
            tick={{ fontSize: 12, fill: textColor }}
            label={{
              value: xAxisLabel,
              position: "center",
              offset: 0,
              fill: textColor,
              fontSize: 14,
            }}
            {...xAxisProps}
          />
          <YAxis
            type="number"
            tick={{ fontSize: 12, fill: textColor }}
            tickCount={7}
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
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            contentStyle={{
              backgroundColor: tooltipBg,
              color: tooltipTextColor,
              borderRadius: 4,
              fontSize: "0.875rem",
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="left"
            wrapperStyle={{
              fontSize: "0.875rem",
              color: textColor,
              paddingTop: 25,
            }}
          />
          {valueKeys.map((key, idx) => (
            <Bar
              key={key}
              dataKey={key}
              name={key}
              fill={colors[idx % colors.length]}
              barSize={30}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiagramBarChart;