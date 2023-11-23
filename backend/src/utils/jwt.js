// backend/src/utils/jwt.js
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  console.log('User object:', user); // Add this line
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, "JKASDjkHJjkhHkjk", { expiresIn: '12h' });
};

// backend/src/utils/jwt.js

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  console.log('authHeader:', authHeader);
  console.log('token:', token);

  if (!token) {
    console.log('No token found');
    req.authenticated = false;
    return next();
  }

  jwt.verify(token, "JKASDjkHJjkhHkjk", (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      req.authenticated = false;
    } else {
      req.authenticated = true;
      req.user = decoded;
    }
    next();
  });
}




module.exports = {
  createToken,
  verifyToken,
};
