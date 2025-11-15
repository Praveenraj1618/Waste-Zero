// server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// DB connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/opportunities', require('./routes/opportunities'));


// Health route
app.get('/', (req, res) => {
  res.json({ message: 'WasteZero Backend Running', time: new Date() });
});

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: "*" }
});

const socketAuth = require('./middleware/socketAuth');
io.use(socketAuth);

const Message = require('./models/Message');
const Notification = require('./models/Notification');

const onlineUsers = new Map();

// Socket Events
io.on('connection', (socket) => {
  const user = socket.user;

  if (!user || !user.id) {
    return socket.disconnect(true);
  }

  onlineUsers.set(user.id, socket.id);
  console.log("User connected:", user.id);

  socket.on('sendMessage', async (data) => {
    try {
      const msg = await Message.create({
        sender_id: user.id,
        receiver_id: data.receiver_id,
        content: data.content
      });

      const receiverSocket = onlineUsers.get(data.receiver_id);
      if (receiverSocket) {
        io.to(receiverSocket).emit('receiveMessage', msg);
      } else {
        await Notification.create({
          user_id: data.receiver_id,
          type: "message",
          message: `New message from ${user.id}`
        });
      }

      socket.emit('messageSent', msg);
    } catch (err) {
      console.log("Socket Message Error:", err.message);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(user.id);
    console.log("User disconnected:", user.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
