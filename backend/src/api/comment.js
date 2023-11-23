const express = require('express');
const router = express.Router();
const { createComment, findCommentsByMovieId } = require('../models/Comment');

router.get("/:movieID", async (req, res) => {
  try {
    const comments = await findCommentsByMovieId(req.params.movieID);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_id, username, movie_id, comment } = req.body;

    const newCommentId = await createComment(user_id, username, movie_id, comment);
    const newComment = {
      id: newCommentId,
      user_id,
      username,
      movie_id,
      comment,
    };

    res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
