const Room = require("../models/Room");

const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createRoom = async (req, res) => {
  try {
    const roomId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const room = await Room.create({
      roomId,
      host: req.user._id,
      participants: [req.user._id],
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);

    res.status(500).json({
      message: "Failed to create room",
      error: error.message,
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        message: "Room ID is required",
      });
    }

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const alreadyJoined = room.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!alreadyJoined) {
      room.participants.push(req.user._id);
      await room.save();
    }

    res.status(200).json({
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to join room",
      error: error.message,
    });
  }
};

const updateRoomLanguage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { language } = req.body;

    if (!language) {
      return res.status(400).json({
        message: "Language is required",
      });
    }

    const room = await Room.findOneAndUpdate(
      { roomId },
      { language },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json({
      message: "Language updated successfully",
      room,
    });
  } catch (error) {
    console.error("Update room language error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.roomId,
    })
      .populate("host", "name email")
      .populate("participants", "name email");

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get room",
      error: error.message,
    });
  }
};

const updateRoomCode = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { code } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId },
      { code },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json({
      message: "Code saved successfully",
      room,
    });
  } catch (error) {
    console.error("Update room code error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  updateRoomLanguage,
  updateRoomCode,

  getRoom,

};