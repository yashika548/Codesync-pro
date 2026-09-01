const express = require("express");

const {
  runAIAgent,
} = require("./agentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/agent",
  protect,
  runAIAgent
);

module.exports = router;