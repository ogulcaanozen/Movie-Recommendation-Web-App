// backend/src/api/ratings/index.js
const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

// GET: Get rating by username and movie ID
router.get('/:username/:movieID', async (req, res) => {
  try {
    const rating = await Rating.getRatingByUsernameAndMovieId(req.params.username, req.params.movieID);
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const ratings = await Rating.getRatingsByUserId(id);
    res.json(ratings);
  } catch (error) {
    console.error(error); // Log the error details for debugging.
    res.status(500).json({ error: 'An error occurred while fetching ratings.', details: error.message });
  }
});


// POST: Create a new rating
router.post('/', async (req, res) => {
  try {
    const { user_id, username, rating, movie_id } = req.body;
    const newRating = await Rating.createRating(user_id, username, rating, movie_id);
    res.status(201).json({ message: 'Rating created successfully', rating_id: newRating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE: Delete a rating by user ID and movie ID
router.delete('/', async (req, res) => {
  try {
    const { user_id, movie_id } = req.body;
    await Rating.deleteRating(user_id, movie_id);
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT: Update a rating by user ID and movie ID
router.put('/', async (req, res) => {
  try {
    const { user_id, movie_id, new_rating } = req.body;
    await Rating.updateRating(user_id, movie_id, new_rating);
    res.status(200).json({ message: 'Rating updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
