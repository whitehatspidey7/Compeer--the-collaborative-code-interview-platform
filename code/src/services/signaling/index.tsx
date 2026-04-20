import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// 1. DEFINE THE CONTRACT (The TypeScript Magic)
// What the frontend is allowed to send TO the server
interface ClientToServerEvents {
  "join-room": (data: { slug: string }) => void;
  "code-change": (data: { slug: string; code: string }) => void;
}

// What the server is allowed to send TO the frontend
interface ServerToClientEvents {
  "receive-code": (code: string) => void;
}

const app = express();
const server = createServer(app);

// 2. APPLY THE TYPES TO THE SERVER
// Now, 'io' and 'socket' know exactly what events exist
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);

  socket.on("join-room", ({ slug }) => {
    socket.join(slug);
    console.log(` User ${socket.id} joined room: ${slug}`);
  });

  socket.on("code-change", ({ slug, code }) => {
    socket.to(slug).emit("receive-code", code);
  });

  socket.on("disconnect", () => {
    console.log( "User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Signaling Server running on port 3001");
});