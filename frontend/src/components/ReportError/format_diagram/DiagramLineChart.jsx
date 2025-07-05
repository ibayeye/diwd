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

const DEFAULT_COLORS = [
  "#DC2626",
  "#FFC107",
  "#16A34A",
  "#2563EB",
  "#4F46E5",
  "#9333EA",
  "#D97706",
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

  const isSmallScreen = window.innerWidth < 640;
  const axisFontSize = isSmallScreen ? 10 : 12;
  const labelFontSize = isSmallScreen ? 12 : 14;

  return (
    <div className="w-full h-[24rem] sm:h-[28rem] md:h-[30rem] dark:text-white">
      {title && (
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center dark:text-white">
          {title}
        </h2>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 40, right: 20, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: axisFontSize, fill: textColor }}
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -10,
              fill: textColor,
              fontSize: labelFontSize,
            }}
            {...xAxisProps}
          />
          <YAxis
            tick={{ fontSize: axisFontSize, fill: textColor }}
            label={{
              value: "Jumlah Error",
              angle: -90,
              position: "insideLeft",
              fill: textColor,
              fontSize: labelFontSize,
            }}
          />
          <Tooltip
            formatter={(value, name) => [value, name]}
            cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 2 }}
            contentStyle={{
              backgroundColor: tooltipBg,
              color: tooltipTextColor,
              borderRadius: 4,
              fontSize: "0.75rem",
            }}
          />
          
          <Legend
            verticalAlign="top"
            align="left"
            wrapperStyle={{
              fontSize: "0.75rem",
              color: textColor,
              paddingBottom: 10,
              textAlign: "left",
              whiteSpace: "normal",
              lineHeight: 1.5,
              maxWidth: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "left",
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
              dot={{ r: isSmallScreen ? 2 : 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiagramLineChart;