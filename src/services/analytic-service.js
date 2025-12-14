const pool = require("../config/db");

exports.getTotalNasabah = async () => {
    const query = {
        text: 'SELECT COUNT(*) FROM nasabah',
    }
    const result = await pool.query(query);
    return result.rows[0].count;
}

exports.getHighPriorityCustomer = async () => {
    const query = 'SELECT COUNT(*) FROM nasabah WHERE prediction_score > 0,5'
    const result = await pool.query(query)
    return result.rows[0].count
}