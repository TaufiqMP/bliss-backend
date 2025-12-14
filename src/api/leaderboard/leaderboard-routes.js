const express = require("express");
const router = express.Router();

const leaderboardController = require("./leaderboard-controller");
const { validateIncrement } = require("./leaderboard-validator");
const authUser = require("../../middleware/auth");

router.post("/:userId/increment", authUser, validateIncrement, leaderboardController.increment);
router.get("/", leaderboardController.getLeaderboard);

module.exports = router;
