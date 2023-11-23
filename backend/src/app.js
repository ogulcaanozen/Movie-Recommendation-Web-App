// app.js

const express = require('express');
const app = express();
const db = require('./config/database');
const cors = require('cors');
const authRoutes = require('./api/auth/index'); // Make sure the path is correct
const commentRoutes = require('./api/comment');
const ratingRoutes = require('./api/rating');
const recommendationRoutes = require('./api/recommendations');
const Rating = require('./models/Rating'); // Make sure the path is correct


const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/recommendations',recommendationRoutes);


(async () => {
  try {
    // Test the database connection
    await db.query('SELECT 1');
    console.log('Connected to the MySQL database.');

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();
