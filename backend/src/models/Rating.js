// backend/src/models/Rating.js
const db = require('../config/database');

const createRatingTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      username VARCHAR(255) NOT NULL,
      rating INT NOT NULL,
      movie_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  await db.query(query);
};

createRatingTable();

const createRating = async (userId, username, rating, movieId) => {
  const query = `
    INSERT INTO ratings (user_id, username, rating, movie_id)
    VALUES (?, ?, ?, ?);
  `;

  const [result] = await db.query(query, [userId, username, rating, movieId]);
  return result.insertId;
};

const getRatingByUsernameAndMovieId = async (username, movieId) => {
  const query = `
    SELECT * FROM ratings
    WHERE username = ? AND movie_id = ?;
  `;

  const [rows] = await db.query(query, [username, movieId]);
  return rows[0];
};

const getRatingsByUserId = async (userId) => {
  const query = `
    SELECT * FROM ratings
    WHERE user_id = ?;
  `;

  const [rows] = await db.query(query, [userId]);
  return rows;
};

const updateRating = async (userId, movieId, newRating) => {
  const query = `
    UPDATE ratings
    SET rating = ?
    WHERE user_id = ? AND movie_id = ?;
  `;

  await db.query(query, [newRating, userId, movieId]);
};

const deleteRating = async (userId, movieId) => {
  const query = `
    DELETE FROM ratings
    WHERE user_id = ? AND movie_id = ?;
  `;

  await db.query(query, [userId, movieId]);
};

const getRatingsByMovieId = async (movieId) => {
  const query = `
    SELECT * FROM ratings
    WHERE movie_id = ?;
  `;

  const [rows] = await db.query(query, [movieId]);
  return rows;
};

module.exports = {
  createRating,
  getRatingByUsernameAndMovieId,
  updateRating,
  deleteRating,
  getRatingsByMovieId,
  getRatingsByUserId,
};
