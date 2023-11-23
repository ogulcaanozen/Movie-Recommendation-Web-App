// backend/src/models/Comment.js
const db = require('../config/database');


const createCommentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      username VARCHAR(255) NOT NULL,
      movie_id INT NOT NULL,
      comment TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  await db.query(query);
};

createCommentTable();

const createComment = async (user_id, username, movie_id, comment) => {
  try {
    const query = `
      INSERT INTO comments (user_id, username, movie_id, comment)
      VALUES (?, ?, ?, ?);
    `;

    const [result] = await db.query(query, [user_id, username, movie_id, comment]);
    return result.insertId;
  } catch (error) {
    console.error("Error in createComment:", error);
    throw error;
  }
};


const findCommentsByMovieId = async (movie_id) => {
  const query = `
    SELECT * FROM comments
    WHERE movie_id = ?;
  `;

  const [rows] = await db.query(query, [movie_id]);
  return rows;
};

module.exports = {
  createComment,
  findCommentsByMovieId,
};
