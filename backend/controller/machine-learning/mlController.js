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