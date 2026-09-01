const express = require("express");

const {
  runAIAgent,
} = require("./agentController");

const {
  askAI,
  searchRAG,
  getAIConversation,
} = require("./aiController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/ask",
  protect,
  askAI
);

router.post(
  "/rag/search",
  protect,
  searchRAG
);

router.get(
  "/conversation/:conversationId",
  protect,
  getAIConversation
);

router.post(
  "/agent/run",
  protect,
  runAIAgent
);

module.exports = router;