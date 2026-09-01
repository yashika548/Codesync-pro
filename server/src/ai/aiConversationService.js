const AIConversationMessage = require(
  "../models/AIConversationMessage"
);
const AIConversation = require("../models/AIConversation");

// ============================================
// SAVE AI MESSAGE
// ============================================

const saveAIMessage = async ({
  userId,
  conversationId,
  role,
  content,
}) => {


  if (role === "user") {
  const conversation =
    await AIConversation.findOne({
      _id: conversationId,
      userId,
    });

  if (
    conversation &&
    (!conversation.title ||
      conversation.title === "New AI Conversation" ||
      conversation.title.includes("AI Discussion"))
  ) {
    const title =
      content.length > 45
        ? content.substring(0, 45) + "..."
        : content;

    conversation.title = title;
    conversation.updatedAt = new Date();

    await conversation.save();
  }
}

  if (!userId) {
    throw new Error("userId is required.");
  }

  if (!conversationId) {
    throw new Error(
      "conversationId is required."
    );
  }

  if (!role) {
    throw new Error(
      "Message role is required."
    );
  }

  if (!content || !content.trim()) {
    throw new Error(
      "Message content is required."
    );
  }

  return AIConversationMessage.create({
    userId,
    conversationId,
    role,
    content,
  });
};


// ============================================
// GET CONVERSATION HISTORY
// ============================================

const getConversationHistory = async ({
  conversationId,
  userId,
  limit = 10,
}) => {
  if (!conversationId) {
    throw new Error(
      "conversationId is required."
    );
  }

  if (!userId) {
    throw new Error(
      "userId is required."
    );
  }

  const messages =
    await AIConversationMessage
      .find({
        conversationId,
        userId,
      })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .lean();

  return messages.reverse();
};


module.exports = {
  saveAIMessage,
  getConversationHistory,
};