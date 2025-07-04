import axios from "axios";
import { useEffect, useState } from "react";
import TableWrapper from "../components/TableWrapper";
import TableReport from "../components/TableReport";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EarthquakePage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchDevice = async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      // Sisipkan query params jika from/to ada
      let url = "https://server.diwd.cloud/api/v1/getDevice";
      if (from && to) {
        url += `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response?.data?.data;
      if (!Array.isArray(data)) throw new Error("Format data tidak valid");
      setDevices(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengambil data perangkat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, []);

  const handleFilter = () => {
    if (!dateFrom || !dateTo) {
      toast.warn("Silakan pilih kedua tanggal (dari dan sampai).");
      return;
    }
    fetchDevice(dateFrom, dateTo);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Anda akan menghapus perangkat ini?")) return;
    try {
      await axios.delete(`https://server.diwd.cloud/api/v1/getDevice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Perangkat berhasil dihapus");
      fetchDevice(dateFrom, dateTo);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus perangkat");
    }
  };

  const handleDetail = (id) => {
    navigate(`/dasboard/device/detail/${id}`);
  };

  const columns = [
    { key: "deviceId", label: "Id" },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span
          className={
            v === "0,0"
              ? "text-green-500 font-semibold"
              : "text-yellow-500 font-semibold"
          }
        >
          {v === "0,0" ? "Aman" : "Bermasalah"}
        </span>
      ),
    },
    { key: "memory", label: "Memori" },
    { key: "onSiteTime", label: "onSiteTime" },
    { key: "onSiteValue", label: "onSiteValue" },
    { key: "regValue", label: "regValue" },
  ];

  const exportToCSV = (data, filename = "rekap_perangkat.csv") => {
    if (!data.length) return toast.warn("Tidak ada data untuk diexport");

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((field) => {
            const cell =
              row[field] !== null && row[field] !== undefined ? row[field] : "";
            return `"${String(cell).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dark:bg-gray-700 dark:text-white">
      <p className="text-2xl font-Inter font-bold my-3">Rekap Alat</p>

      <div className="flex items-center  space-x-3 mb-4">
        <div>
          <label className="block text-sm">Dari:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border dark:bg-gray-700 rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm">Sampai:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border dark:bg-gray-700 rounded-md px-2 py-1"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-600 dark:bg-orange-500 text-white rounded-md px-4 py-2 mt-6"
        >
          Filter
        </button>
      </div>

      <TableReport
        columns={columns}
        data={devices}
        loading={loading}
        error={error}
        onEdit={handleDetail}
        onDelete={handleDelete}
        ItemsPage={10}
        pageType="perangkat"
      />

      <div className="flex justify-end w-full text-sm py-4">
        <button
          className="border border-blue-600 dark:border-orange-500 dark:text-white rounded-md px-4 py-2"
          onClick={() => exportToCSV(devices)}
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default EarthquakePage;
