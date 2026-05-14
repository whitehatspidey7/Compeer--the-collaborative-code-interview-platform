import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as Y from 'yjs';

// 1. DEFINE THE CONTRACT (The TypeScript Magic)
// What the frontend is allowed to send TO the server
interface ClientToServerEvents {
  "join-room": (data: { slug: string }) => void;
  "yjs-update": (data: { slug: string; code: Uint8Array }) => void;
}

// What the server is allowed to send TO the frontend
interface ServerToClientEvents {
  "yjs-update": (code: Uint8Array) => void;
}

// map with list of all the documents of all the interview rooms
const documents  =  new Map<string , Y.Doc>();


const app = express();
const server = createServer(app); //http server

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

    // if the document for the room doesn't exist , create one
    if(!documents.has(slug))
    {
       documents.set(slug, new Y.Doc);
    }

    const doc  = documents.get(slug)!;
    const stateVector = Y.encodeStateAsUpdate(doc);

    socket.emit("yjs-update",stateVector);

  });

    
  socket.on("yjs-update", ({ slug, code }) => {

    const doc = documents.get(slug);

    if(doc)
    {
        Y.applyUpdate(doc, new Uint8Array(code));
    }
    socket.to(slug).emit("yjs-update", code);
  });

  socket.on("disconnect", () => {
    console.log( "User disconnected:", socket.id);
  });


});

server.listen(3001, () => {
  console.log("Signaling Server running on port 3001");
});