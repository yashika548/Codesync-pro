const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const initializeSocket = require("./sockets/socket");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const codeRoutes = require("./routes/codeRoutes");
const problemRoutes = require("./routes/problemRoutes");
const aiRoutes = require("./ai/aiRoutes");
const agentRoutes = require("./ai/agentRoutes");

const aiConversationRoutes =
  require("./ai/aiConversationRoutes");

const app = express();

connectDB();

const server = http.createServer(app);

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://codesync-pro.vercel.app",
  "https://codesync-pro-git-main-yashika11.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    credentials: true,
  })
);

app.use(express.json());

// =====================================================
// SOCKET.IO
// =====================================================

initializeSocket(server);

// =====================================================
// ROUTES
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", agentRoutes);

app.use(
  "/api/ai/conversations",
  aiConversationRoutes
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "CodeSync Pro API is running 🚀",
  });
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});