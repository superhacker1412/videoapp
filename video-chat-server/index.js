import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: `http://${process.env.BASE_URL}:${process.env.FRONTEND_PORT}`,
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `http://${process.env.BASE_URL}:${process.env.FRONTEND_PORT}`,
    credentials: true
  }
});

const PORT = 3000;

let waitingUser = null;
const partners = new Map();
const userSocketMap = {}; // { userId: socketId }

// === Socket.IO Handling ===
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  console.log("🔌 New connection:", socket.id);

  socket.on("register", (peerId) => {
    socket.peerId = peerId;
    console.log(`🧍 Registered PeerID=${peerId}`);
  });

  socket.on("find-random", () => {
    console.log(`🔍 ${socket.peerId} is searching...`);
    if (waitingUser && waitingUser !== socket) {
      partners.set(socket.id, waitingUser.id);
      partners.set(waitingUser.id, socket.id);
      io.to(socket.id).emit("start-call", waitingUser.peerId);
      io.to(waitingUser.id).emit("start-call", socket.peerId);
      console.log(`✅ Paired: ${socket.peerId} ↔ ${waitingUser.peerId}`);
      waitingUser = null;
    } else {
      waitingUser = socket;
      io.to(socket.id).emit("searching");
      console.log(`⏳ ${socket.peerId} added to queue`);
    }
  });

  socket.on("stop-find", () => {
    if (waitingUser === socket) {
      waitingUser = null;
      io.to(socket.id).emit("stopped");
      console.log(`✋ ${socket.peerId} stopped searching`);
    }
  });

  socket.on("end-call", () => {
    const partnerSocketId = partners.get(socket.id);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit("end-call");
      partners.delete(partnerSocketId);
      partners.delete(socket.id);
      console.log(`❌ Call ended: ${socket.peerId} ↔ ${io.sockets.sockets.get(partnerSocketId)?.peerId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Disconnected:", socket.peerId);
    if (waitingUser === socket) waitingUser = null;
    const partnerSocketId = partners.get(socket.id);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit("end-call");
      partners.delete(partnerSocketId);
      partners.delete(socket.id);
    }

    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// === Export socket utils ===
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// === Start server ===
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Socket.IO server running at http://192.168.1.8:${PORT}`);
});