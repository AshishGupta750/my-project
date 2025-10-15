// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const port = 4000; // Choose a port for the backend

// Configure Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // The origin of the React app
    methods: ["GET", "POST"]
  }
});

// Listen for WebSocket connections
io.on('connection', (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  // Listen for a 'sendMessage' event from a client
  socket.on('sendMessage', (data) => {
    console.log(`Message received: ${data.text}`);
    // Broadcast the received message to all connected clients
    io.emit('receiveMessage', data);
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`🟢 SERVER IS RUNNING ON PORT ${port}`);
});