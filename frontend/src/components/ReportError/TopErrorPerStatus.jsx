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

const TopErrorPerStatus = forwardRef((props, ref) => {
  const [errorData, setErrorData] = useState([]);
  const [lineKeys, setLineKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchError = async () => {
    try {
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/getTopErrorPerStatus"
      );

      const res = response.data.data || [];

      // Ambil semua Error Message unik untuk bar
      const uniqueLabels = Array.from(
        new Set(res.map((item) => item["Error Message"]))
      );
      setLineKeys(uniqueLabels);

      // Grouping data berdasarkan Status Label
      const grouped = {};

      res.forEach((item) => {
        const errorMsg = item["Error Message"];
        const status = item["Status Label"];
        const count = item["Count"];

        if (!grouped[status]) {
          grouped[status] = { "Status Label": status };
        }

        grouped[status][errorMsg] = count;
      });

      const formattedData = Object.values(grouped);
      setErrorData(formattedData);
    } catch (error) {
      console.error("Error fetching error data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchError();
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => errorData,
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
    <DiagramBarChart
      data={errorData}
      xAxisKey="Status Label"
      valueKeys={lineKeys}
      xAxisProps={{
        interval: 0,
        textAnchor: "end",
        tickMargin: 12,
        label: {
          value: "Status Label",
          position: "bottom",
        },
      }}
    />
  );
});

export default TopErrorPerStatus;
