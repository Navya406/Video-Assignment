const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// 1. Standard Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Setup Socket.io (Create Server)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 3. Attach Socket to Request (MUST BE BEFORE ROUTES) <<--- MOVED UP
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 4. Routes (Now they can see req.io)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

// 5. Socket Logic
io.on('connection', (socket) => {
  console.log('⚡ New Client Connected:', socket.id);

  socket.on('join_room', (userId) => {
    if(userId) {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});