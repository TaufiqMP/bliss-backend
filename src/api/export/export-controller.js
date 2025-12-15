const emailService = require('../../services/email-service');
const userService = require('../../services/user-service');

exports.sendLeaderboardEmail = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                message: 'user_id wajib dikirim',
            });
        }

<<<<<<< HEAD
        const user = await userService.getUserById(user_id);

        if (!user) {
            return res.status(404).json({
                message: 'User tidak ditemukan.',
            });
        }

        console.log('Send leaderboard to:', user.email);

        emailService.sendEmail(user.email).catch((err) => {
            console.error('Email send failed:', err);
        });
=======
        await emailService.sendEmail(user.email);
>>>>>>> 8396ff760cf9d0fc3af37e40f5844b7ed5f55f7c

        res.status(200).json({
            message: 'Permintaan pengiriman email leaderboard diproses.',
        });
    } catch (error) {
        console.error('Controller error:', error);

        res.status(500).json({
            message: 'Gagal memproses permintaan.',
        });
    }
};
