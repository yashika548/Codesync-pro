const mongoose = require("mongoose");

const AIConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "New AI Conversation",
      trim: true,
    },

    problemId: {
      type: String,
      default: null,
    },

    problemTitle: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

AIConversationSchema.index({
  userId: 1,
  updatedAt: -1,
});

module.exports = mongoose.model(
  "AIConversation",
  AIConversationSchema
);