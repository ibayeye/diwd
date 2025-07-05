import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { HiOutlineCheckCircle } from 'react-icons/hi';

const PredictStatus = () => {
  const [statusLabel, setStatusLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://server.diwd.cloud/api/v1/getPredictStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error_message: "econnrefused 504 error",
            hour: 12,
            day: 12,
            month: 6,
            year: 2025,
            message_type: 1,
            error_code: 504,
            frequency: 9
          })
        });

        const result = await response.json();
        if (result.status === 'success') {
          setStatusLabel(result.data.status_label);
        } else {
          setError('Failed to get status');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">Predict Status</h2>

      {loading ? (
        <div className="flex justify-center items-center space-x-2 text-blue-600">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-sm font-medium">Fetching prediction...</span>
        </div>
      ) : error ? (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <MdErrorOutline className="text-xl" />
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3 bg-yellow-50 border border-yellow-200 dark:bg-yellow-400 dark:border-none p-4 rounded-md">
          <HiOutlineCheckCircle className="text-yellow-500 dark:text-gray-700 text-2xl" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-700">Predicted Status:</p>
            <p className="text-lg font-semibold text-yellow-500 dark:text-gray-700">{statusLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictStatus;
