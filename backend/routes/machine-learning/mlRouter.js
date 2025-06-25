import express from "express";
import { getCleanDataSet, getDailyStatusTrend, getDataML, getDataSet, getEvaluateModels, getHourlyErrorTrend, getLoadSvmModel, getMonthlyStatusTrend, getPredictStatus, getSavedCleanedDataSet, getSelectedDataset, getSmoteDistribution, getStatusDistribution, getTopDailyError, getTopErrorPerStatus, getTopHourlyError, getTopMothlyError, getTopWeeklyError, getTrainModels, getWeeklyStatusTrend } from "../../controller/machine-learning/mlController.js";
import { internalMiddleware, protectedMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get('/hello', getDataML);
router.get('/getDataSet', getDataSet);
router.get('/getCleanDataSet', getCleanDataSet);
router.get('/getHourlyErrorTrend', getHourlyErrorTrend);
router.get('/getTopHourlyError', getTopHourlyError);
router.get('/getDailyStatusTrend', getDailyStatusTrend);
router.get('/getTopDailyError', getTopDailyError);
router.get('/getWeeklyStatusTrend', getWeeklyStatusTrend);
router.get('/getTopWeeklyError', getTopWeeklyError);
router.get('/getMonthlyStatusTrend', getMonthlyStatusTrend);
router.get('/getTopMothlyError', getTopMothlyError);
router.get('/getTopMothlyError', getTopMothlyError);
router.get('/getStatusDistribution', getStatusDistribution);
router.get('/getTopErrorPerStatus', getTopErrorPerStatus);
router.get('/getSavedCleanedDataSet', getSavedCleanedDataSet);
router.get('/getSelectedDataset', getSelectedDataset);
router.get('/getSmoteDistribution', getSmoteDistribution);
router.get('/getTrainModels', getTrainModels);
router.get('/getLoadSvmModel', getLoadSvmModel);
router.get('/getEvaluateModels', getEvaluateModels);
router.post('/getPredictStatus', getPredictStatus);

export default router;