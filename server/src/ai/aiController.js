const {
  buildRAGContext,
} = require("./rag/ragService");

const {
  saveAIMessage,
  getConversationHistory,
} = require("./aiConversationService");

const {
  generateAIResponse,
} = require("./aiService");

const {
  buildCodingAssistantPrompt,
} = require("./promptService");

const {
  runAgent,
} = require("./agentService");

// =====================================================
// NORMAL AI
// =====================================================

const askAI = async (req, res) => {
  try {
    const {
      code = "",
      language = "javascript",
      question = "",
      problem = "",
      constraints = [],
      examples = [],
    } = req.body;

    if (!question.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const prompt =
      buildCodingAssistantPrompt({
        code,
        language,
        question,
        problem,
        constraints,
        examples,
      });

    const result =
      await generateAIResponse({
        prompt,
      });

    res.status(200).json(result);

  } catch (error) {
    console.error(
      "AI Controller Error:",
      error
    );

    if (
      error?.code === "insufficient_quota"
    ) {
      return res.status(429).json({
        message:
          "AI service quota is unavailable. Please check API billing or quota.",
        code: "AI_QUOTA_EXCEEDED",
      });
    }

    res.status(500).json({
      message: "AI request failed",
      code: "AI_REQUEST_FAILED",
    });
  }
};


// =====================================================
// RAG + CONVERSATION MEMORY
// =====================================================

const searchRAG = async (req, res) => {
  try {

    const {
      query,
      conversationId,
      code = "",
      language = "javascript",
      problem = "",
      constraints = [],
      examples = [],
    } = req.body;


    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Query is required.",
      });
    }


    console.log(
      "RAG query:",
      query
    );


    // =================================================
    // CONVERSATION HISTORY
    // =================================================

    let conversationHistory = [];

const userId =
  req.user?._id ||
  req.user?.id;

if (conversationId) {

  if (!userId) {
    return res.status(401).json({
      message:
        "Authentication required for conversation memory.",
      code: "AUTH_REQUIRED",
    });
  }

  conversationHistory =
    await getConversationHistory({
      conversationId,
      userId,
      limit: 10,
    });

}


    console.log(
      "Conversation messages:",
      conversationHistory.length
    );


    const historyContext =
  conversationHistory.length > 0
    ? conversationHistory
        .map((message) => {

          const role =
            message.role === "user"
              ? "User"
              : message.role === "assistant"
              ? "Assistant"
              : "System";

          return `${role}: ${message.content}`;

        })
        .join("\n\n")
    : "No previous conversation.";


    // =================================================
    // RAG RETRIEVAL
    // =================================================

    const ragResult =
      await buildRAGContext({
        question: query,
        limit: 5,
      });


    console.log(
      "RAG documents found:",
      ragResult.documents.length
    );


    // =================================================
    // CODING ASSISTANT PROMPT
    // =================================================

    const basePrompt =
      buildCodingAssistantPrompt({
        code,
        language,
        question: query,
        problem,
        constraints,
        examples,
      });


    // =================================================
    // FINAL RAG + MEMORY PROMPT
    // =================================================

    const finalPrompt = `

You are CodeSync AI, an expert coding
assistant.

Use the conversation history and
retrieved knowledge to answer the
current user question.

Do not unnecessarily repeat previous
answers.

Build upon previous discussion when
appropriate.


================ CONVERSATION HISTORY ================

${historyContext}


================ RETRIEVED KNOWLEDGE ================

${ragResult.context}


================ CODING CONTEXT ================

${basePrompt}


================ CURRENT QUESTION ================

${query}


Provide a clear, technically accurate
answer.

If code is requested, provide clean
code and explain the important parts.

`;


    // =================================================
    // GENERATION
    // =================================================

    console.log(
      "Generating answer using RAG context..."
    );


    const aiResult =
      await generateAIResponse({
        prompt: finalPrompt,
        context: ragResult.context,
      });


    console.log(
      "RAG answer generated successfully."
    );

    


    // =================================================
    // SAVE CONVERSATION
    // =================================================

    

    if (conversationId) {

  if (!userId) {
    return res.status(401).json({
      message:
        "Authentication required for conversation memory.",
      code: "AUTH_REQUIRED",
    });
  }

  await saveAIMessage({
    userId,
    conversationId,
    role: "user",
    content: query,
  });

  await saveAIMessage({
    userId,
    conversationId,
    role: "assistant",
    content: aiResult.response,
  });

}


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      query,

      conversationId:
        conversationId || null,

      response:
        aiResult.response,

      results:
        ragResult.documents,

      context:
        ragResult.context,

    });


  } catch (error) {

    console.error(
      "========== RAG ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Code:",
      error.code
    );

    console.error(
      "Status:",
      error.status
    );

    console.error(
      "Full error:",
      error
    );

    console.error(
      "================================"
    );


    if (
      error?.code ===
        "insufficient_quota" ||
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
        "Failed to perform RAG search.",

      code:
        "RAG_SEARCH_FAILED",

    });

  }
};


// =====================================================
// AGENTIC AI
// =====================================================

const runAIAgent = async (req, res) => {
  try {
    const {
      question,
      conversationId,
      code = "",
      language = "javascript",
      problem = "",
      constraints = [],
      examples = [],
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required.",
        code: "QUESTION_REQUIRED",
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

    const result = await runAgent({
      question,
      conversationId,
      userId,
      code,
      language,
      problem,
      constraints,
      examples,
    });

    // Save conversation messages
    if (conversationId) {
      await saveAIMessage({
        userId,
        conversationId,
        role: "user",
        content: question,
      });

      await saveAIMessage({
        userId,
        conversationId,
        role: "assistant",
        content: result.response,
      });
    }

   return res.status(200).json({
  success: true,

  question: result.question,

  conversationId:
    result.conversationId ||
    conversationId ||
    null,

  intent:
    result.intent,

  plan:
    result.plan,

  toolResults:
    result.toolResults || [],

  response:
    result.response,

  // RAG sources
  ragSources:
    result.ragSources ||
    result.sources ||
    [],
});
  } catch (error) {
    console.error(
      "========== AGENT ERROR =========="
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      message:
        "AI agent request failed.",
      code:
        "AI_AGENT_FAILED",
    });
  }
};

// =====================================================
// GET AI CONVERSATION HISTORY
// =====================================================

const getAIConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation ID is required.",
      });
    }

    const userId =
  req.user?._id ||
  req.user?.id;

if (!userId) {
  return res.status(401).json({
    message:
      "Authentication required.",
    code: "AUTH_REQUIRED",
  });
}

const messages =
  await getConversationHistory({
    conversationId,
    userId,
    limit: 50,
  });

    return res.status(200).json({
      conversationId,
      messages,
    });

  } catch (error) {
    console.error(
      "Get AI Conversation Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load conversation history.",
      code:
        "CONVERSATION_HISTORY_FAILED",
    });
  }
};

module.exports = {
  askAI,
  searchRAG,
  runAIAgent,
  getAIConversation,
};