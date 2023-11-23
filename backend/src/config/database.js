// config/database.js

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', // Replace with your MySQL host
  user: 'root', // Replace with your MySQL username
  password: 'Darkman106', // Replace with your MySQL password
  database: 'movierecommendation', // Add this line with your desired database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
