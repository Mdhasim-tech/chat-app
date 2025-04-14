const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('🟢 A user connected: ' + socket.id);

  socket.on('send-message', ({ to, message }) => {
    console.log(`📨 Message from ${socket.id} to ${to}: ${message}`);

    // Broadcast message to the receiver (if connected)
    const messageData = {
      from: socket.userId,
      text: message,
    };
    console.log('📤 Broadcasting message to:', to, 'data:', messageData);
    io.to(to).emit('receive-message', messageData);
  });

  socket.on('join', (userId) => {
    socket.userId = userId; // Store the user ID on the socket
    socket.join(userId); // So we can send to this specific user later
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 A user disconnected: ' + socket.id);
  });
});

server.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
