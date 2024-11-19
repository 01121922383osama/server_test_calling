document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const username = '<%= username %>';
  const chatBox = document.getElementById('chat');
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message');

  socket.emit('join', username);

  socket.on('message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-bubble');
    if (data.username === username) {
      messageElement.classList.add('sent');
    } else {
      messageElement.classList.add('received');
    }
    messageElement.innerHTML = `
      <div>${data.username}</div>
      <div>${data.message}</div>
      <div>${data.timestamp}</div>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
      socket.emit('message', message);
      messageInput.value = '';
    }
  });
});
