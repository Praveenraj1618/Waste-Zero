// middleware/socketAuth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function (socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token ||
      socket.handshake.headers?.["x-auth-token"];

    if (!token) return next(new Error("No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded.user;

    next();
  } catch (err) {
    console.log("Socket auth failed:", err.message);
    return next(new Error("Invalid Token"));
  }
};
