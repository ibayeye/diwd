import axios from "axios";
import List from "../components/List";
import { useEffect, useState } from "react";
import TableWrapper from "../components/TableWrapper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



const DeviceReport = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const fetchDevice = async () => {
    try {
      const response = await axios.get(
        "https://server.diwd.cloud/api/v1/getDevice",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response?.data?.data;
      // console.log("list",data);

      if (!Array.isArray(data)) throw new Error("Format data tidak valid");

      setDevices(data);
    } catch (error) {
      console.error(error);
      setError(error.message || "Gagal mengambil data perangkat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, []);

  const handleDelet = async (id) => {
    const valid = window.confirm("Anda Akan Menghapus Pengguna ini?");
    if (!valid) return;

    try {
      await axios.delete(`https://server.diwd.cloud/api/v1/getDevice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Pengguna Berhasil Dihapus");
      fetchDevice();
    } catch (error) {
      console.error("Gagal menghapus:", error.response || error);
      toast.error("Gagal menghapus pengguna");
    }
  };

  const columns = [
    { key: "deviceId", label: "Id" },
    { key: "alamat", label: "Lokasi" },
    {
      key: "status",
      label: "Status",
      render: (value) => <span className={value === "0,0" ? "text-green-500 font-semibold" : "text-yellow-500 font-semibold"}>
    {value === "0,0" ? "Aman" : "Bermasalah"}
  </span>,
    },
  ];

  const handleDetail = (id) => {
     navigate(`/dasboard/device/detail/${id}`);
  };

  return (
    <div>
      <p className="text-2xl font-Inter font-bold my-3">Daftar Perangkat</p>
      <TableWrapper
        columns={columns}
        data={devices}
        loading={loading}
        error={error}
        onEdit={handleDetail}
        onDelete={handleDelet}
        ItemsPage={10}
        pageType="perangkat"
      />
    </div>
  );
};

export default DeviceReport;
