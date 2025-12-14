const nodemailer = require('nodemailer');

const userService = require('./user-service');
const ExcelJS = require('exceljs');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

exports.sendEmail = async (targetEmail) => {
    try {
        const leaderboardData = await userService.getSales();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Leaderboard Sales');
        const dataRank = leaderboardData.map((user, index) => ({
            rank: index + 1,
            ...user,
        }));
        worksheet.columns = [
            { header: 'Peringkat', key: 'rank', width: 10 },
            { header: 'ID User', key: 'user_id', width: 10 },
            { header: 'Username', key: 'username', width: 25 },
            { header: 'Email', key: 'email', width: 35 },
            { header: 'Skor Leaderboard', key: 'score', width: 20 },
        ];

        worksheet.addRows(dataRank);
        const excelBuffer = await workbook.xlsx.writeBuffer();
        const date = new Date().toISOString().split('T')[0];
        const filename = `leaderboard-${date}.xlsx`;

        const message = {
            from: `"Bliss" <${process.env.GMAIL_USER}>`,
            to: targetEmail,
            subject: 'Ekspor Users Leaderboard',
            text: 'Terlampir hasil dari ekspor leaderboard.',
            attachments: [{
                filename: filename,
                content: excelBuffer,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },],
        };
        await transporter.sendMail(message);
        console.log(`Email sent successfully to ${targetEmail}`);
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Could not send leaderboard email.");
    }
}
