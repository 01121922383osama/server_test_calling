const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Store connected users
const users = new Map();

// Route to display the login page
app.get('/', (_req, res) => {
  res.render('login');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    res.render('chat', { username }); // Pass the username to the template
  } else {
    res.redirect('/');
  }
});

// Socket.io functionality
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (username) => {
    users.set(socket.id, username);
    console.log(`${username} joined`);
    io.emit('userJoined', username);
  });

  socket.on('message', (message) => {
    const username = users.get(socket.id);
    io.emit('message', {
      username,
      message,
      timestamp: moment().format('h:mm A'),
    });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      io.emit('userLeft', username);
      console.log(`${username} disconnected`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
