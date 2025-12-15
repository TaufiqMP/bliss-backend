const emailService = require('../../services/email-service');
const userService = require('../../services/user-service');

exports.sendLeaderboardEmail = async (req, res) => {
    try {
        const { user_id } = req.user;
        console.log(req.user.email)
        const { data } = await userService.getUserById(user_id);
        console.log("user", data.user.email)
        await emailService.sendEmail(data.user.email);

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
