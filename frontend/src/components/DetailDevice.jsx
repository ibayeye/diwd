import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const DetailDevice = () => {
  const { id } = useParams();
  const location = useLocation();
  const [detail, setDetail] = useState(location.state?.detail || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // jika nggak lewat state, fetch ulang dari server
    if (!detail) {
      const fetchDetail = async () => {
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.get(
            `http://localhost:5000/api/v1/getDevice/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDetail(data.data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchDetail();
    }
  }, [id, detail]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!detail) return <p>Loading detail...</p>;

  return (
    <div>
      <h2>Detail Device {id}</h2>
      <p>Alamat: {detail.alamat}</p>
      <p>Status: {detail.status}</p>
      {/* render field lain sesuai struktur response */}
    </div>
  );
};

export default DetailDevice;
