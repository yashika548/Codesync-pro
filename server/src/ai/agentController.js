const {
  runAgent,
} = require("./agentService");

// =====================================================
// RUN AI AGENT
// =====================================================

const runAIAgent = async (req, res) => {
  try {
    const {
      question = "",
      conversationId,
      code = "",
      language = "javascript",
      problem = "",
      input = "",
      constraints = [],
      examples = [],
    } = req.body;

    // ============================================
    // VALIDATION
    // ============================================

    if (!question.trim()) {
      return res.status(400).json({
        message: "Question is required.",
        code: "AGENT_QUESTION_REQUIRED",
      });
    }

    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    // ============================================
    // RUN AGENT
    // ============================================

    const result = await runAgent({
      question,
      conversationId,
      userId,
      code,
      language,
      problem,
      input,
      constraints,
      examples,
    });

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(200).json({
      success: true,

      question:
        result.question || question,

      conversationId:
        result.conversationId ||
        conversationId ||
        null,

      intent:
        result.intent || "general",

      plan:
        result.plan || {
          intent: result.intent || "general",
          tools: [],
        },

      toolResults:
        result.toolResults || [],

      // IMPORTANT
      ragSources:
        result.ragSources ||
        result.sources ||
        [],

      ragContext:
        result.ragContext || "",

      response:
        result.response || "",
    });

  } catch (error) {
    console.error(
      "========== AI AGENT ERROR =========="
    );

    console.error(error);

    console.error(
      "===================================="
    );

    if (
      error?.code === "insufficient_quota" ||
      error?.status === 429
    ) {
      return res.status(429).json({
        message:
          "AI service quota is unavailable.",
        code:
          "AI_QUOTA_EXCEEDED",
      });
    }

    return res.status(500).json({
      message:
        "AI Agent request failed.",
      code:
        "AGENT_REQUEST_FAILED",
    });
  }
};

module.exports = {
  runAIAgent,
};