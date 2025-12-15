const emailService = require('../../services/email-service');
const userService = require('../../services/user-service');

exports.sendLeaderboardEmail = async (req, res) => {
    try {
        const { user_id } = req.user;
        const user = await userService.getUserById(user_id);
        console.log("user", user)
        await emailService.sendEmail(user.email);

        res.status(200).json({
            message: "Email leaderboard berhasil dikirim."
        });
    } catch (error) {
        console.error("Controller error:", error.message);
        res.status(500).json({
            message: "Gagal mengirim email.",
            error: error.message
        });
    }
};
