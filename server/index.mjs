import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { randomUUID } from "crypto";

const PORT = process.env.PORT ?? 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on("chat_message", (message, ack) => {
    const trimmedContent = message?.content?.toString().trim();
    if (!trimmedContent) {
      if (typeof ack === "function") {
        ack({ status: "ignored" });
      }
      return;
    }

    const username =
      message?.user?.toString().trim() || `Guest-${socket.id.slice(-4)}`;

    const chatMessage = {
      id: randomUUID(),
      user: username,
      content: trimmedContent,
      timestamp: new Date().toISOString(),
    };

    io.emit("chat_message", chatMessage);

    if (typeof ack === "function") {
      ack({ status: "ok" });
    }
  });

  socket.on("clear_chat", () => {
    io.emit("chat_cleared");
  });
});

server.listen(PORT, () => {
  console.log(`Chat server listening on http://localhost:${PORT}`);
});
