// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });
// const cors = require('cors');

// app.use(cors());
// app.use(express.json());

const PORT = process.env.PORT || 3000;

// // Basic route to test if server is running
// app.get('/', (_req, res) => {
//   res.send('WebRTC Chat Server is running');
// });

// // Store connected users and their socket IDs
// const users = new Map();

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Handle user joining
//   socket.on('join', (username) => {
//     users.set(socket.id, username);
//     console.log(`${username} joined with socket ID: ${socket.id}`);
//     io.emit('userJoined', username);
//     io.emit('userList', Array.from(users.entries()).map(([id, name]) => ({
//       id,
//       username: name
//     })));
//   });

//   // Handle messages
//   socket.on('message', (data) => {
//     const username = users.get(socket.id);
//     io.emit('message', {
//       username: username,
//       message: data.message,
//       timestamp: new Date().toISOString()
//     });
//   });

//   // WebRTC Signaling
//   socket.on('call-user', (data) => {
//     console.log('Call request from', socket.id, 'to', data.userToCall);
//     io.to(data.userToCall).emit('incoming-call', {
//       signal: data.signalData,
//       from: socket.id,
//       username: users.get(socket.id)
//     });
//   });

//   socket.on('answer-call', (data) => {
//     console.log('Call answered by', socket.id, 'to', data.to);
//     io.to(data.to).emit('call-accepted', data.signal);
//   });

//   socket.on('ice-candidate', (data) => {
//     console.log('ICE candidate from', socket.id, 'to', data.to);
//     io.to(data.to).emit('ice-candidate', {
//       candidate: data.candidate,
//       from: socket.id
//     });
//   });

//   // Handle track state changes
//   socket.on('track-ended', (data) => {
//     io.to(data.to).emit('track-ended', {
//       trackKind: data.trackKind
//     });
//   });

//   socket.on('track-muted', (data) => {
//     io.to(data.to).emit('track-muted', {
//       trackKind: data.trackKind
//     });
//   });

//   socket.on('track-unmuted', (data) => {
//     io.to(data.to).emit('track-unmuted', {
//       trackKind: data.trackKind
//     });
//   });

//   socket.on('end-call', (data) => {
//     console.log('Call ended by', socket.id, 'to', data.to);
//     io.to(data.to).emit('call-ended');
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     const username = users.get(socket.id);
//     users.delete(socket.id);
//     if (username) {
//       console.log(`${username} disconnected`);
//       io.emit('userLeft', username);
//       io.emit('userList', Array.from(users.entries()).map(([id, name]) => ({
//         id,
//         username: name
//       })));
//     }
//   });
// });

// Start the server
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});