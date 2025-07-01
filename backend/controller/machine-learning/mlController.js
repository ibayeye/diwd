import asyncHandler from "../../middleware/asyncHandler.js";
import axios from "axios";

export const getDataML = asyncHandler(async (req, res) => {
  const response = await axios.get("https://ml-diwd-production.up.railway.app/api/hello");
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getDataSet = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/describe-dataset"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getCleanDataSet = asyncHandler(async (req, res) => {
  const response = await axios.get("https://ml-diwd-production.up.railway.app/api/clean-dataset");
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getHourlyErrorTrend = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/hourly-error-trend"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getTopHourlyError = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/top-hourly-errors"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getDailyStatusTrend = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/daily-status-trend"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getTopDailyError = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/top-daily-errors"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getWeeklyStatusTrend = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/weekly-status-trend"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getTopWeeklyError = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/top-weekly-errors"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getMonthlyStatusTrend = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/monthly-status-trend"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getTopMothlyError = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/top-monthly-errors"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getStatusDistribution = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/status-distribution"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getTopErrorPerStatus = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/top-errors-per-status"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getSavedCleanedDataSet = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/save-cleaned-dataset"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getSelectedDataset = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/selected-dataset"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getSmoteDistribution = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/smote-distribution"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});
export const getTrainModels = asyncHandler(async (req, res) => {
  const response = await axios.get("https://ml-diwd-production.up.railway.app/api/train-models");
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});
export const getLoadSvmModel = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/load-svm-models"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});
export const getEvaluateModels = asyncHandler(async (req, res) => {
  const response = await axios.get(
    "https://ml-diwd-production.up.railway.app/api/evaluate-models"
  );
  const data = response.data;

  res.status(200).json({
    status: "success",
    data: data,
  });
});
export const getPredictStatus = asyncHandler(async (req, res) => {
    try {
        // Ambil data dari request body yang dikirim ke Express
        const requestData = req.body;


    // Kirim data ke Python endpoint
    const response = await axios.post(
      "https://ml-diwd-production.up.railway.app/api/predict-status",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      status: "error",
      message: error.response?.data?.error || error.message,
    });
  }
});
