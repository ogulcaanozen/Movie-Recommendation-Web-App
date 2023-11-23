// backend/src/routes/auth.js

const express = require('express');
const bodyParser = require('body-parser');
const { createToken, verifyToken } = require('../../utils/jwt');
const User = require('../../models/User');

const router = express.Router();

router.use(bodyParser.json());

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await User.createUser(email, username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      maxAge: 60*60*12*1000,
      sameSite: 'None',
    });

    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/verifyToken', verifyToken, (req, res) => {
  if (req.authenticated) {
    res.status(200).json({ isValid: true, message: 'Token is valid' });
  } else {
    res.status(401).json({ isValid: false, message: 'Invalid token' });
  }
});

module.exports = router;
