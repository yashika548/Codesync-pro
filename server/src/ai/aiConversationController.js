const {
  createConversation,
  getUserConversations,
  getConversation,
  deleteConversation,
} = require("./aiConversationManager");


// ============================================
// CREATE CONVERSATION
// ============================================

const createAIConversation = async (req, res) => {
  try {
    const userId =
      req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const {
      title = "New AI Conversation",
      problemId = null,
      problemTitle = null,
    } = req.body;

    const conversation =
      await createConversation({
        userId,
        title,
        problemId,
        problemTitle,
      });

    return res.status(201).json({
      conversation,
    });

  } catch (error) {
    console.error(
      "Create AI Conversation Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create AI conversation.",
    });
  }
};


// ============================================
// GET USER CONVERSATIONS
// ============================================

const listAIConversations = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const conversations =
      await getUserConversations(userId);

    return res.status(200).json({
      conversations,
    });

  } catch (error) {
    console.error(
      "List AI Conversations Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load AI conversations.",
    });
  }
};


// ============================================
// GET SINGLE CONVERSATION
// ============================================

const getAIConversation = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id || req.user?.id;

    const {
      conversationId,
    } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const conversation =
      await getConversation({
        conversationId,
        userId,
      });

    if (!conversation) {
      return res.status(404).json({
        message:
          "Conversation not found.",
      });
    }

    return res.status(200).json({
      conversation,
    });

  } catch (error) {
    console.error(
      "Get AI Conversation Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load AI conversation.",
    });
  }
};


// ============================================
// DELETE CONVERSATION
// ============================================

const deleteAIConversation = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id || req.user?.id;

    const {
      conversationId,
    } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const conversation =
      await deleteConversation({
        conversationId,
        userId,
      });

    if (!conversation) {
      return res.status(404).json({
        message:
          "Conversation not found.",
      });
    }

    return res.status(200).json({
      message:
        "Conversation deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete AI Conversation Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete AI conversation.",
    });
  }
};


module.exports = {
  createAIConversation,
  listAIConversations,
  getAIConversation,
  deleteAIConversation,
};