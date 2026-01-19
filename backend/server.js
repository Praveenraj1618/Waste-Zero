// server.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/pickups', require('./routes/pickups'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/matching', require('./routes/matching'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => res.json({ ok: true, time: new Date() }));

// Socket.io
const io = new Server(server, { cors: { origin: '*' } });
const socketAuth = require('./middleware/socketAuth');
io.use(socketAuth);

const Message = require('./models/Message');
const Notification = require('./models/Notification');

const onlineUsers = new Map(); // userId -> socketId

function getSocketIdForUser(userId) {
  return onlineUsers.get(String(userId));
}

io.on('connection', (socket) => {
  const user = socket.user;
  if (!user || !user.id) return socket.disconnect(true);

  onlineUsers.set(String(user.id), socket.id);
  socket.broadcast.emit('userOnline', { userId: user.id });

  // handle sendMessage
  socket.on('sendMessage', async (payload, ack) => {
    try {
      if (!payload?.receiver_id || !payload?.content) {
        if (ack) ack({ ok: false, msg: 'Invalid payload' });
        return;
      }

      const saved = await Message.create({
        sender_id: user.id,
        receiver_id: payload.receiver_id,
        content: payload.content,
        delivered: false,
        read: false
      });

      const recvSocketId = getSocketIdForUser(payload.receiver_id);
      if (recvSocketId) {
        io.to(recvSocketId).emit('receiveMessage', saved);
        saved.delivered = true;
        await saved.save();
        socket.emit('messageDelivered', { messageId: saved._id });
      } else {
        await Notification.create({
          user_id: payload.receiver_id,
          type: 'message',
          message: `New message from ${user.id}`,
          sent_at: new Date(),
          read: false
        });
      }

      if (ack) ack({ ok: true, data: saved });
      socket.emit('messageSent', saved);
    } catch (err) {
      console.error('sendMessage error', err);
      if (ack) ack({ ok: false, msg: 'Send failed' });
      socket.emit('error', { msg: 'Send failed' });
    }
  });

  // typing
  socket.on('typing', (payload) => {
    try {
      if (!payload?.receiver_id) return;
      const recvSocketId = getSocketIdForUser(payload.receiver_id);
      if (recvSocketId) {
        io.to(recvSocketId).emit('typing', { from: user.id, isTyping: !!payload.isTyping });
      }
    } catch (err) {
      console.error('typing error', err);
    }
  });

  // read
  socket.on('messageRead', async (payload) => {
    try {
      if (!payload?.messageId) return;
      const msg = await Message.findById(payload.messageId);
      if (!msg) return;
      if (String(msg.receiver_id) !== String(user.id)) return;

      if (!msg.read) {
        msg.read = true;
        await msg.save();
      }

      const senderSocketId = getSocketIdForUser(msg.sender_id);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messageRead', { messageId: msg._id, readerId: user.id });
      }
    } catch (err) {
      console.error('messageRead error', err);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(String(user.id));
    socket.broadcast.emit('userOffline', { userId: user.id });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
