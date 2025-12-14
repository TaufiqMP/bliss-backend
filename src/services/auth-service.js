const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { nanoid } = require('nanoid');
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

exports.register = async (email, username, password) => {
  const hashed = await bcrypt.hash(password, 10);
  // const leaderboard_id = `leaderboard-${nanoid(5)}`;
  const query = `
            INSERT INTO users (email, username, password, role_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
  const values = [email, username, hashed, 2];
  const result = await pool.query(query, values);
  const newUser = result.rows[0];
  const leaderboardQuery = `INSERT INTO leaderboard(user_id, score)
                            VALUES ($1, $2)
                            RETURNING *`;
  const LeaderboardValues = [newUser.user_id, 0];
  await pool.query(leaderboardQuery, LeaderboardValues);
  return newUser;
}


exports.login = async (email, password) => {
  const userResult = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (userResult.rowCount === 0) {
    throw new Error("User not found");
  }

  const user = userResult.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const payload = {
    user_id: user.user_id,
    role_id: user.role_id,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await pool.query(
    `INSERT INTO authentications (user_id, refresh_token)
     VALUES ($1, $2)`,
    [user.user_id, refreshToken]
  );

  return {
    accessToken,
    refreshToken,
  };
};

exports.refreshAccessToken = async (refreshToken) => {
  const stored = await pool.query(
    `SELECT * FROM thentications WHERE refresh_token = $1`,
    [refreshToken]
  );

  if (stored.rowCount === 0) {
    throw new Error("Invalid refresh token");
  }

  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const accessToken = generateAccessToken({
    user_id: payload.user_id,
    role_id: payload.role_id,
  });

  return accessToken;
};

exports.logout = async (refreshToken) => {
  await pool.query(
    `DELETE FROM authentications WHERE refresh_token = $1`,
    [refreshToken]
  );

  return true;
};

function name(params) {

}
