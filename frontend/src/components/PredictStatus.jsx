import React, { useEffect, useState } from 'react';

const PredictStatus = () => {
  const [statusLabel, setStatusLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/getPredictStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "error_message": "econnrefused 504 error",
            "hour": 12,
            "day": 12,
            "month": 6,
            "year": 2025,
            "message_type": 1,
            "error_code": 504,
            "frequency": 9
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
    <div>
      <h1>Predict Status</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <p>Status Label: <strong>{statusLabel}</strong></p>
      )}
    </div>
  );
};

export default PredictStatus;
