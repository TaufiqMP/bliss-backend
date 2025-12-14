const express = require('express');
const authUser = require("../../middleware/auth");
const router = express.Router();
const exportController = require('./export-controller');

router.post('/', authUser, exportController.sendLeaderboardEmail);

module.exports = router;


