const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("✅ A user connected");

  socket.on("chat message", (data) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    io.emit("chat message", { ...data, timestamp });
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
