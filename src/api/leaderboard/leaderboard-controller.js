const LeaderboardService = require("../../services/leaderboard-service");
const leaderboardService = new LeaderboardService();

exports.increment = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await leaderboardService.incrementScore(userId);

    res.json({
      status: "success",
      message: "Score incremented",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await leaderboardService.getLeaderboard();

    res.json({
      status: "success",
      data: leaderboard,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
