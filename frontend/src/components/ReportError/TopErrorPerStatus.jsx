import axios from "axios";
import React, { useEffect, useState } from "react";

const TopErrorPerStatus = () => {
  const [errorData, setErrorData] = useState([]);

  const fetchError = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getTopErrorPerStatus"
      );
      setErrorData(response.data.data); // pastikan ambil array-nya langsung
      console.log(response.data.data);
      
    } catch (error) {
      console.error("Error fetching error data:", error);
    }
  };

  useEffect(() => {
    fetchError();
  }, []);

  return (
    <div className="p-2">
      <div className="h-96 overflow-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">pesan error</th>
              <th className="py-2 px-4 border-b">pesan masuk</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {errorData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{item["Error Message"]}</td>
                <td className="py-2 px-4 border-b">{item["Count"]}</td>
                <td className="py-2 px-4 border-b">{item["Status Label"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopErrorPerStatus;
