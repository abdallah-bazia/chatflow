import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ── Types ──────────────────────────────────────────────
interface User {
  id: string;
  username: string;
  room: string;
}

interface Message {
  id: string;
  username: string;
  text: string;
  room: string;
  timestamp: number;
}

// ── State ──────────────────────────────────────────────
const users: Map<string, User> = new Map();
const messages: Map<string, Message[]> = new Map();
const ROOMS = ["general", "tech", "random", "algeria"];

// Initialize rooms
ROOMS.forEach((room) => messages.set(room, []));

// ── Helpers ────────────────────────────────────────────
const getRoomUsers = (room: string) =>
  Array.from(users.values()).filter((u) => u.room === room);

const addMessage = (msg: Message) => {
  const roomMsgs = messages.get(msg.room) || [];
  roomMsgs.push(msg);
  if (roomMsgs.length > 50) roomMsgs.shift(); // keep last 50
  messages.set(msg.room, roomMsgs);
};

// ── Socket.io ──────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`⚡ Connected: ${socket.id}`);

  // Join a room
  socket.on("join", ({ username, room }: { username: string; room: string }) => {
    // Leave previous room if any
    const prevUser = users.get(socket.id);
    if (prevUser) {
      socket.leave(prevUser.room);
      io.to(prevUser.room).emit("room_users", getRoomUsers(prevUser.room));
      io.to(prevUser.room).emit("message", {
        id: Date.now().toString(),
        username: "System",
        text: `${prevUser.username} left the room`,
        room: prevUser.room,
        timestamp: Date.now(),
      });
    }

    // Register user
    const user: User = { id: socket.id, username, room };
    users.set(socket.id, user);
    socket.join(room);

    // Send message history
    socket.emit("history", messages.get(room) || []);

    // Notify room
    io.to(room).emit("room_users", getRoomUsers(room));
    io.to(room).emit("message", {
      id: Date.now().toString(),
      username: "System",
      text: `${username} joined the room 👋`,
      room,
      timestamp: Date.now(),
    });

    console.log(`👤 ${username} joined #${room}`);
  });

  // Send message
  socket.on("send_message", ({ text }: { text: string }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const msg: Message = {
      id: Date.now().toString(),
      username: user.username,
      text,
      room: user.room,
      timestamp: Date.now(),
    };

    addMessage(msg);
    io.to(user.room).emit("message", msg);
  });

  // Typing indicator
  socket.on("typing", (isTyping: boolean) => {
    const user = users.get(socket.id);
    if (!user) return;
    socket.to(user.room).emit("typing", { username: user.username, isTyping });
  });

  // Disconnect
  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.to(user.room).emit("room_users", getRoomUsers(user.room));
      io.to(user.room).emit("message", {
        id: Date.now().toString(),
        username: "System",
        text: `${user.username} left the room`,
        room: user.room,
        timestamp: Date.now(),
      });
    }
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

// ── Health check ───────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ChatFlow server running", rooms: ROOMS, users: users.size });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 ChatFlow server running on http://localhost:${PORT}`);
});