import express from "express";
import { getCleanDataSet, getDailyStatusTrend, getDataML, getDataSet, getHourlyErrorTrend, getMonthlyStatusTrend, getStatusDistribution, getTopDailyError, getTopErrorPerStatus, getTopHourlyError, getTopMothlyError, getTopWeeklyError, getWeeklyStatusTrend } from "../../controller/machine-learning/mlController.js";
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

export default router;