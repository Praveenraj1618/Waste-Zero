// middleware/socketAuth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function (socket, next) {
  try {
    const token = socket.handshake?.auth?.token || socket.handshake?.query?.token || socket.handshake?.headers?.['x-auth-token'];
    if (!token) return next(new Error('No token provided'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    console.error('Socket auth failed', err.message);
    next(new Error('Authentication error'));
  }
};
