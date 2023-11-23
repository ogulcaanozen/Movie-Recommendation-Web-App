// backend/src/models/User.js

const db = require('../config/database');
const bcrypt = require('bcryptjs');

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;

  await db.query(query);
};

createUserTable();

const createUser = async (email, username, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const query = `
    INSERT INTO users (email, username, password)
    VALUES (?, ?, ?);
  `;

  const [result] = await db.query(query, [email, username, hashedPassword]);
  return result.insertId;
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE email = ?;
  `;

  const [rows] = await db.query(query, [email]);
  return rows[0];
};

const findUserByUsername = async (username) => {
  const query = `
    SELECT * FROM users
    WHERE username = ?;
  `;

  const [rows] = await db.query(query, [username]);
  return rows[0];
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  comparePassword,
};
