const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const cors = require('cors');
const path = require('path');
const moment = require('moment');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// Route to display the login page
app.get('/', (_req, res) => {
  res.render('login');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    res.render('chat', { username });
  } else {
    res.redirect('/');
  }
});

// Store connected users and their socket IDs
const users = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining
  socket.on('join', (username) => {
    users.set(socket.id, username);
    console.log(`${username} joined with socket ID: ${socket.id}`);
    io.emit('userJoined', username);
    io.emit('userList', Array.from(users.values()));
  });

  // Handle messages
  socket.on('message', (message) => {
    const username = users.get(socket.id);
    if (username) {
      io.emit('message', {
        username,
        message,
        timestamp: moment().format('h:mm A'),
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      console.log(`${username} disconnected`);
      io.emit('userLeft', username);
      io.emit('userList', Array.from(users.values()));
    }
  });
});

// Start the server
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
