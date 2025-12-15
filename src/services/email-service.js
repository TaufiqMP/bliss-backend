const { Resend } = require('resend');
const userService = require('./user-service');
const ExcelJS = require('exceljs');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async (targetEmail) => {
    try {
        // Ambil top 10 leaderboard
        const leaderboardData = await userService.getSales({ limit: 10 });

        // Buat workbook Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Leaderboard Sales');

        worksheet.columns = [
            { header: 'Peringkat', key: 'rank', width: 10 },
            { header: 'ID User', key: 'user_id', width: 10 },
            { header: 'Username', key: 'username', width: 25 },
            { header: 'Email', key: 'email', width: 35 },
            { header: 'Skor Leaderboard', key: 'score', width: 20 },
        ];

        const dataRank = leaderboardData.map((user, index) => ({
            rank: index + 1,
            ...user,
        }));

        worksheet.addRows(dataRank);

        const excelBuffer = await workbook.xlsx.writeBuffer();
        const date = new Date().toISOString().split('T')[0];
        const filename = `leaderboard-${date}.xlsx`;

        // Kirim email ASYNC
        resend.emails.send({
            from: 'Bliss <onboarding@resend.dev>',
            to: targetEmail,
            reply_to: 'yourpersonalemail@gmail.com', // opsional
            subject: 'Ekspor Users Leaderboard',
            text: 'Terlampir hasil dari ekspor leaderboard top 10.',
            attachments: [
                {
                    filename,
                    content: excelBuffer,
                },
            ],
        }).then(() => {
            console.log(`Email berhasil dikirim ke ${targetEmail}`);
        }).catch((err) => {
            console.error(`Email gagal ke ${targetEmail}:`, err);
        });

    } catch (error) {
        console.error('Gagal membuat atau mengirim email:', error);
        // Jangan throw error → controller tetap cepat
    }
};
