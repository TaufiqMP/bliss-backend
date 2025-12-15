const emailService = require('../../services/email-service');
const userService = require('../../services/user-service');

exports.sendLeaderboardEmail = async (req, res) => {
    try {
        const { user_id } = req.user;
        const user = await userService.getUserById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }
        console.log("user", user.email)
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
        throw error;
    }
};
