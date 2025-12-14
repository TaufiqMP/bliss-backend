const express = require("express");
const router = express.Router();
const AnalyticController = require("../controllers/analytic-controller");

router.get("/nasabah", AnalyticController.getTotalNasabah);
router.get("/nasabah/priority", AnalyticController.getHighPriorityCustomer);

module.exports = router;

