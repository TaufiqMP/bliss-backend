const { Resend } = require('resend');
const userService = require('./user-service');
const ExcelJS = require('exceljs');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async (targetEmail) => {
    try {
        const leaderboardData = await userService.getSales();

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

        await resend.emails.send({
            from: 'Bliss <onboarding@resend.dev>',
            to: targetEmail,
            subject: 'Ekspor Users Leaderboard',
            text: 'Terlampir hasil dari ekspor leaderboard.',
            attachments: [
                {
                    filename: filename,
                    content: excelBuffer,
                },
            ],
        });

        console.log(`Email berhasil dikirim ke ${targetEmail}`);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Could not send leaderboard email.');
    }
};
