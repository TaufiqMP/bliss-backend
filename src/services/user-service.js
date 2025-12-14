const { text } = require("express");
const pool = require("../config/db");

exports.getSales = async () => {
    const query = {
        text: 'SELECT u.user_id, u.username, u.email, u.role_id, u.image_url, l.score FROM users u INNER JOIN leaderboard l ON u.user_id = l.user_id WHERE u.role_id = 2 ORDER BY l.score DESC',
    }
    const result = await pool.query(query);
    return result.rows;
}

exports.getUserById = async (user_id) => {
    const query = {
        text: `
            SELECT 
                u.user_id, 
                u.username, 
                u.email, 
                u.image_url,
                u.role_id,
                u.status,
                u.phone_number, 
                u.address, 
                COALESCE(l.score, 0) AS score
            FROM users u 
            LEFT JOIN leaderboard l 
                ON u.user_id = l.user_id 
            WHERE u.user_id = $1
        `,
        values: [user_id]
    };

    const result = await pool.query(query);
    return result.rows[0];
};


exports.getTopThreeUsers = async () => {
    const query = {
        text: `
            SELECT 
                u.user_id, 
                u.username, 
                u.email, 
                u.image_url,
                u.role_id,
                COALESCE(l.score, 0) AS score
            FROM users u
            LEFT JOIN leaderboard l ON u.user_id = l.user_id
            WHERE u.role_id = 2
            ORDER BY score DESC
            LIMIT 3
        `,
    };

    const result = await pool.query(query);
    return result.rows;
};



exports.putUserById = async (data, user_id) => {
    const keys = Object.keys(data);
    if (keys.length === 0) {
        throw new Error("No data to update");
    }

    const validKeys = keys.filter(key => data[key] !== '' && data[key] !== null && data[key] !== undefined);
    const values = validKeys.map(key => data[key]);

    if (validKeys.length === 0) {
        throw new Error("No valid data to update");
    }

    const setClause = validKeys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const text = `UPDATE users SET ${setClause} WHERE user_id = $${validKeys.length + 1} RETURNING user_id, username, email`;
    values.push(user_id);

    const query = {
        text,
        values
    }
    const result = await pool.query(query);
    return result.rows[0];
}

exports.deleteUserById = async (user_id) => {
    const query = {
        text: 'DELETE FROM users WHERE user_id = $1',
        values: [user_id]
    }
    await pool.query(query);
}

exports.checkNasabahExist = async (user_id) => {
    const query = {
        text: 'SELECT COUNT (*) FROM nasabah WHERE assign_to = $1',
        values: [user_id]
    }
    const result = await pool.query(query);
    return result.rows[0].count;
}

exports.updateScore = async (user_id) => {
    const score = await this.checkNasabahExist(user_id);
    const scoreValues = score * 100;
    const query = {
        text: 'UPDATE leaderboard SET score = $1 WHERE user_id = $2',
        values: [scoreValues, user_id]
    }
    await pool.query(query);
}


exports.updateUserProfile = async ({ userId, username, phone_number, address }) => {
    const sanitize = (v) => (v && v.trim() !== "" ? v : null);

    const query = {
        text: `
            UPDATE users
            SET
                username     = COALESCE($1, username),
                phone_number = COALESCE($2, phone_number),
                address      = COALESCE($3, address)
            WHERE user_id = $4
            RETURNING user_id, username, email, image_url, phone_number, address, role_id, status;
        `,
        values: [
            sanitize(username),
            sanitize(phone_number),
            sanitize(address),
            userId
        ]
    };

    const result = await pool.query(query);
    return result.rows[0];
};

