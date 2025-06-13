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
 * LineChart
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
  "#4F46E5", // Indigo
  "#16A34A", // Green
  "#D97706", // Amber
  "#DC2626", // Red
  "#2563EB", // Blue
  "#9333EA", // Purple
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
  return (
    <div className="w-full h-[30rem]">
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: "#374151" }}
            label={{
              value: xAxisLabel,
              position: "bottom",
              offset: -10,
              fill: "#374151",
              fontSize: 14,
            }}
            {...xAxisProps}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#374151" }}
            label={{
              value: "Jumlah Error",
              angle: -90,
              position: "insideLeft",
              fill: "#374151",
              fontSize: 14,
            }}
          />
          <Tooltip
            formatter={(value, name) => [value, name]}
            cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 2 }}
            contentStyle={{ borderRadius: 4, fontSize: "0.875rem" }}
          />
          <Legend
            verticalAlign="top"
            align="left"
            height={36}
            wrapperStyle={{ fontSize: "0.875rem", paddingLeft: "25px" }}
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
