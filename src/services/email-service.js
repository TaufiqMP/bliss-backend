const nodemailer = require('nodemailer');
const userService = require('./user-service');
const ExcelJS = require('exceljs');

async function generateExcelBuffer(leaderboardData) {
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

    // generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
    logger: true, // debug logs
    debug: true,
    connectionTimeout: 10000, // 10s timeout
});

exports.sendEmail = async (targetEmail) => {
    try {
        // Ambil data leaderboard
        const leaderboardData = await userService.getSales();
        if (!leaderboardData || !Array.isArray(leaderboardData)) {
            throw new Error("Leaderboard data kosong atau tidak valid");
        }

        // Generate Excel buffer
        const excelBuffer = await generateExcelBuffer(leaderboardData);
        console.log("Excel buffer generated:", excelBuffer.byteLength, "bytes");

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
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }],
        };

        const info = await transporter.sendMail(message);
        console.log(`Email sent successfully to ${targetEmail}`);
        console.log("MessageId:", info.messageId);

        return info;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Could not send leaderboard email.");
    }
};
