import asyncHandler from "../../middleware/asyncHandler.js";
import axios from "axios";

export const getDataML = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/hello');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getDataSet = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/describe-dataset');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getCleanDataSet = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/clean-dataset');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getHourlyErrorTrend = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/hourly-error-trend');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getTopHourlyError = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/top-hourly-errors');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getDailyStatusTrend = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/daily-status-trend');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getTopDailyError = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/top-daily-errors');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getWeeklyStatusTrend = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/weekly-status-trend');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getTopWeeklyError = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/top-weekly-errors');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getMonthlyStatusTrend = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/monthly-status-trend');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getTopMothlyError = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/top-monthly-errors');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getStatusDistribution = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/status-distribution');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getTopErrorPerStatus = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/top-errors-per-status');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getSavedCleanedDataSet = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/save-cleaned-dataset');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getSelectedDataset = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/selected-dataset');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})

export const getSmoteDistribution = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/smote-distribution');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})
export const getTrainModels = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/train-models');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})
export const getLoadSvmModel = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/load-svm-models');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})
export const getEvaluateModels = asyncHandler(async (req, res) => {
    const response = await axios.get('http://ml-service:5001/api/evaluate-models');
    const data = response.data

    res.status(200).json({
        status: "success",
        data: data
    });
})
export const getPredictStatus = asyncHandler(async (req, res) => {
    try {
        // Ambil data dari request body yang dikirim ke Express
        const requestData = req.body;

        console.log('Data yang diterima Express:', requestData); // Debug

        // Kirim data ke Python endpoint
        const response = await axios.post('http://ml-service:5001/api/predict-status', requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        res.status(200).json({
            status: "success",
            data: data
        });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({
            status: "error",
            message: error.response?.data?.error || error.message
        });
    }
});