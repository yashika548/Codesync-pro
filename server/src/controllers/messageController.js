const Message = require("../models/Message");

const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);

    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

module.exports = {
  getRoomMessages,
};