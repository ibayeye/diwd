// src/components/PieChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * PieChart
 *
 * Props:
 * - data:      Array objek, misalnya:
 *              [ { name: 'Normal',   value: 65 },
 *                { name: 'Warning',  value: 25 },
 *                { name: 'Critical', value: 10 } ]
 * - title:     (optional) Judul chart
 * - colors:    (optional) Array warna untuk tiap slice; default disediakan di bawah
 */
const DEFAULT_COLORS = [
  "#10B981", // Teal
  "#F59E0B", // Amber
  "#DC2626", // Red
  "#2563EB", // Blue
  "#9333EA", // Purple
];

const DiagramPieChart = ({ data, title, colors = DEFAULT_COLORS }) => {
  return (
    <div className="w-full h-[400px] bg-white rounded-md shadow-md p-4">
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}`, name]} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: "0.875rem" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiagramPieChart;
