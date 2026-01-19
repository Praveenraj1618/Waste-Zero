// frontend/socket-client.js (example usage - plain JS)
import { io } from 'socket.io-client';

// Example: pass the JWT token you get after login
// const token = localStorage.getItem('jwt') or similar
function createSocket(token) {
  // Connect passing token via auth field (recommended)
  const socket = io('http://localhost:5000', {
    auth: { token }, // preferred
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('Socket connected', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect error', err);
  });

  // Listen for incoming chat messages
  socket.on('receiveMessage', (msg) => {
    console.log('New message', msg);
    // update your chat UI with the msg
  });

  // Listen for general notifications
  socket.on('notification', (payload) => {
    console.log('Notification', payload);
    // show toast or badge update
  });

  // Send a message
  // payload: { receiver_id: 'userId', content: 'text' }
  function sendMessage(payload) {
    socket.emit('sendMessage', payload);
  }

  // Mark notification read (optional)
  function markNotificationRead(notificationId) {
    socket.emit('markNotificationRead', { notificationId });
  }

  // Disconnect gracefully
  function disconnect() {
    if (socket && socket.connected) socket.disconnect();
  }

  return { socket, sendMessage, markNotificationRead, disconnect };
}

export default createSocket;
