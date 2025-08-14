// chat.js - Minimal chat logic for mem0-js

const messages = [];

function sendMessage(user, text) {
  const message = { user, text, timestamp: Date.now() };
  messages.push(message);
  return message;
}

function getMessages() {
  return messages;
}

module.exports = {
  sendMessage,
  getMessages
};
