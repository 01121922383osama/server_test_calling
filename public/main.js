// public/main.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const username = '<%= username %>';
    const chat = document.getElementById('chat');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message');
  
    // Join the chat
    socket.emit('join', username);
  
    // Listen for messages
    socket.on('message', (data) => {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${data.username} (${new Date(data.timestamp).toLocaleTimeString()}): ${data.message}`;
      chat.appendChild(messageElement);
    });
  
    // Listen for user join/leave events
    socket.on('userJoined', (user) => {
      const joinElement = document.createElement('div');
      joinElement.textContent = `${user} joined the chat.`;
      chat.appendChild(joinElement);
    });
  
    socket.on('userLeft', (user) => {
      const leaveElement = document.createElement('div');
      leaveElement.textContent = `${user} left the chat.`;
      chat.appendChild(leaveElement);
    });
  
    // Send a message
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = messageInput.value.trim();
      if (message) {
        socket.emit('message', message);
        messageInput.value = '';
      }
    });
  });
  