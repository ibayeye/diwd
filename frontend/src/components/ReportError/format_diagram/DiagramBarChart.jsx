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
  xAxisProps,
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
  xAxisProps
}) => {
  return (
    <div className="w-full h-full rounded-md">
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            type="category"
            tick={{ fontSize: 12, fill: "#374151" }}
            label={{
              value: xAxisLabel,
              position: "center",
              offset: -10,
              fill: "#374151",
              fontSize: 14,
            }}
            {...xAxisProps}
          />
          <YAxis
            type="number"
            tick={{ fontSize: 12, fill: "#374151" }}
            tickCount={7}
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
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            contentStyle={{ borderRadius: 4, fontSize: "0.875rem" }}
          />
          <Legend
            verticalAlign="bottom"
            align="left"
            wrapperStyle={{
              fontSize: "0.875rem",
              paddingTop: 25
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
