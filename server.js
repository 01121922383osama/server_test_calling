const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Store connected users and their socket IDs
const users = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user joining
  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('userJoined', username);
    io.emit('userList', Array.from(users.entries()).map(([id, name]) => ({
      id,
      username: name
    })));
  });

  // Handle messages
  socket.on('message', (data) => {
    const username = users.get(socket.id);
    io.emit('message', {
      username: username,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });

  // WebRTC Signaling
  socket.on('call-user', ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit('incoming-call', {
      signal: signalData,
      from,
      username: users.get(from)
    });
  });

  socket.on('answer-call', ({ to, signal }) => {
    io.to(to).emit('call-accepted', signal);
  });

  socket.on('end-call', ({ to }) => {
    io.to(to).emit('call-ended');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userLeft', username);
    io.emit('userList', Array.from(users.entries()).map(([id, name]) => ({
      id,
      username: name
    })));
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});