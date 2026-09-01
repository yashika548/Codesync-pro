const AIConversation = require(
  "../models/AIConversation"
);


// ============================================
// CREATE CONVERSATION
// ============================================

const createConversation = async ({
  userId,
  title = "New AI Conversation",
  problemId = null,
  problemTitle = null,
}) => {

  if (!userId) {
    throw new Error(
      "userId is required."
    );
  }

  return AIConversation.create({
    userId,
    title,
    problemId,
    problemTitle,
  });
};


// ============================================
// GET USER CONVERSATIONS
// ============================================

const getUserConversations = async (
  userId
) => {

  if (!userId) {
    throw new Error(
      "userId is required."
    );
  }

  return AIConversation
    .find({
      userId,
    })
    .sort({
      updatedAt: -1,
    })
    .lean();
};


// ============================================
// GET SINGLE CONVERSATION
// ============================================

const getConversation = async ({
  conversationId,
  userId,
}) => {

  if (!conversationId) {
    throw new Error(
      "conversationId is required."
    );
  }

  return AIConversation.findOne({
    _id: conversationId,
    userId,
  }).lean();
};


// ============================================
// DELETE CONVERSATION
// ============================================

const deleteConversation = async ({
  conversationId,
  userId,
}) => {

  if (!conversationId) {
    throw new Error(
      "conversationId is required."
    );
  }

  return AIConversation.findOneAndDelete({
    _id: conversationId,
    userId,
  });
};


module.exports = {
  createConversation,
  getUserConversations,
  getConversation,
  deleteConversation,
};