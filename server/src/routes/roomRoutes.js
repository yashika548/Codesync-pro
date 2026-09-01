const express = require("express");

const {
  createRoom,
  joinRoom,
  updateRoomLanguage,
  getRoom,
  updateRoomCode,
} = require("../controllers/roomController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

console.log("protect:", typeof protect);
console.log("createRoom:", typeof createRoom);
console.log("joinRoom:", typeof joinRoom);
console.log("getRoom:", typeof getRoom);
router.post("/", protect, createRoom);

router.post("/join", protect, joinRoom);

router.patch("/:roomId/language", protect, updateRoomLanguage);

router.get("/:roomId", protect, getRoom);

router.put("/:roomId/code", protect, updateRoomCode);

module.exports = router;