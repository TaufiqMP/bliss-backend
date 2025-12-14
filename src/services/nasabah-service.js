const pool = require("../config/db");

exports.getAll = async () => {
  const result = await pool.query(`SELECT * FROM nasabah`);
  return result.rows;
};

exports.getSpecificSales = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM nasabah WHERE assigned_to = $1`,
    [user_id]
  );
  return result.rows;
};

exports.getById = async (id) => {

  const result = await pool.query(`SELECT * FROM nasabah WHERE id = $1`, [id]);

  if (result.rowCount === 0) throw new Error("Nasabah not found");

  return result.rows[0];
};

exports.update = async (id, data) => {
  const { status, first_name, last_name, phone_number, email, job } = data;

  const result = await pool.query(
    `
    UPDATE nasabah
    SET 
      status = COALESCE($1, status),
      first_name = COALESCE($2, first_name),
      last_name = COALESCE($3, last_name),
      phone_number = COALESCE($4, phone_number),
      email = COALESCE($5, email),
      job = COALESCE($6, job)
    WHERE id = $7
    RETURNING *;
  `,
    [status, first_name, last_name, phone_number, email, job, id]
  );

  if (result.rowCount === 0) throw new Error("Nasabah not found");

  return result.rows[0];
};

exports.deleteNasabah = async (id) => {
  const result = await pool.query(`DELETE FROM nasabah WHERE id = $1`, [id]);

  if (result.rowCount === 0) throw new Error("Nasabah not found");

  return true;
};

exports.countOpenByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS open_count
     FROM nasabah
     WHERE assigned_to = $1 AND status = 'OPEN'`,
    [user_id]
  );
  return parseInt(result.rows[0].open_count, 10);
};

exports.countClosedByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS closed_count
     FROM nasabah
     WHERE assigned_to = $1 AND status IN ('CLOSED APPROVED', 'CLOSED REJECTED')`,
    [user_id]
  );

  return parseInt(result.rows[0].closed_count, 10);
};

exports.countOpen = async () => {
  const result = await pool.query(
    `SELECT COUNT(*) AS open_count
     FROM nasabah
     WHERE status = 'OPEN'`,
  );
  return parseInt(result.rows[0].open_count, 10);
};

exports.countClosed = async () => {
  const result = await pool.query(
    `SELECT COUNT(*) AS closed_count
     FROM nasabah
     WHERE status IN ('CLOSED APPROVED', 'CLOSED REJECTED')`,
  );

  return parseInt(result.rows[0].closed_count, 10);
};

