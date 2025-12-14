const pool = require("../config/db");

class LeaderboardService {
  async incrementScore(userId) {
    const checkQuery = `
      SELECT * FROM leaderboard WHERE user_id = $1
    `;
    const checkResult = await pool.query(checkQuery, [userId]);

    if (checkResult.rowCount === 0) {
      const insertQuery = `
        INSERT INTO leaderboard (user_id, score)
        VALUES ($1, 1)
        RETURNING *
      `;
      const insertResult = await pool.query(insertQuery, [userId]);
      return insertResult.rows[0];
    }

    const updateQuery = `
      UPDATE leaderboard
      SET score = score + 1,
          updated_at = current_timestamp
      WHERE user_id = $1
      RETURNING *
    `;
    const updateResult = await pool.query(updateQuery, [userId]);
    return updateResult.rows[0];
  }

  async getLeaderboard(limit = 10) {
    const query = `
      SELECT lb.*, u.username 
      FROM leaderboard lb
      JOIN users u ON lb.user_id = u.user_id
      ORDER BY score DESC, updated_at DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = LeaderboardService;
