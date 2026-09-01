const express = require("express");

const {
  createAIConversation,
  listAIConversations,
  getAIConversation,
  deleteAIConversation,
} = require("./aiConversationController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Create
router.post(
  "/",
  protect,
  createAIConversation
);


// List
router.get(
  "/",
  protect,
  listAIConversations
);


// Get single
router.get(
  "/:conversationId",
  protect,
  getAIConversation
);


// Delete
router.delete(
  "/:conversationId",
  protect,
  deleteAIConversation
);


module.exports = router;