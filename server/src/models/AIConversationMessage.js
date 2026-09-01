const mongoose = require("mongoose");

const aiConversationMessageSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      conversationId: {
        type: String,
        required: true,
        index: true,
      },

      role: {
        type: String,
        enum: [
          "user",
          "assistant",
          "system",
        ],
        required: true,
      },

      content: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "AIConversationMessage",
    aiConversationMessageSchema
  );