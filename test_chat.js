const chat = require('./chat');

chat.sendMessage('Alice', 'Hello!');
chat.sendMessage('Bob', 'Hi Alice!');
console.log(chat.getMessages());
