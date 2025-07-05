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

const RawWeeklyStatusDiagram = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://server.diwd.cloud/api/v1/getWeeklyStatusTrend"
        );
        const res = response.data.data || [];

        const formatted = res.map((item) => ({
          ...item,
          Week: new Date(item.Week).toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric",
            month: "long",
            // tahun bisa dihilangkan kalau semua data di tahun yang sama
          }),
        }));

        setData(formatted);
      } catch (err) {
        console.error("Gagal mengambil data weekly status trend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => data,
  }));

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

  return (
    <DiagramLineChart
      data={data}
      xKey="Week"
      lineKeys={["Critical", "Warning", "Low"]}
      title="Trend Status Error per Minggu"
      xAxisProps={{
        interval: 0,
        angle: 0,
        textAnchor: "end",
        label: {
          value: "Minggu",
          position: "bottom",
        },
      }}
    />
  );
});

export default RawWeeklyStatusDiagram;
