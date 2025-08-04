require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const chatController = require('./controllers/chatController');

connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // Adjust this for production!
});

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for encrypted chat messages
  socket.on('send_message', async (data) => {
    console.log('Received message from client:', data);
    
    // Save to DB using the reusable function
    try {
      console.log('Saving message to database...');
      const savedMessage = await chatController.saveMessage(data);
      console.log('Message saved successfully:', savedMessage);
      
      // Broadcast the saved message to all clients
      console.log('Broadcasting message to all clients...');
      io.emit('receive_message', savedMessage);
      console.log('Message broadcasted successfully');
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('error', { message: 'Failed to save message.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
