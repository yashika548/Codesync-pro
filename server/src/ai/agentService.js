// =====================================================
// CODE SYNC AI - AGENT SERVICE
// =====================================================
const {
  generateAIResponse,
} = require("./aiService");

const {
  buildRAGContext,
} = require("./rag/ragService");

const {
  buildCodingAssistantPrompt,
} = require("./promptService");

const {
  analyzeCode,
  executeCode,
} = require("./agentTools");

const {
  getConversationHistory,
  saveAIMessage,
} = require("./aiConversationService");




// =====================================================
// INTENT DETECTION
// =====================================================

const detectIntent = (question = "") => {

  const text = question.toLowerCase();

  if (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("wrong") ||
    text.includes("debug") ||
    text.includes("issue") ||
    text.includes("fix")
  ) {
    return "CODE_ANALYSIS";
  }

  if (
    text.includes("complexity") ||
    text.includes("time complexity") ||
    text.includes("space complexity") ||
    text.includes("big o")
  ) {
    return "COMPLEXITY";
  }

  if (
    text.includes("optimize") ||
    text.includes("optimization") ||
    text.includes("faster") ||
    text.includes("improve performance")
  ) {
    return "OPTIMIZATION";
  }

  if (
    text.includes("hint") ||
    text.includes("clue")
  ) {
    return "HINT";
  }

  if (
    text.includes("explain") ||
    text.includes("what does") ||
    text.includes("how does")
  ) {
    return "EXPLANATION";
  }

  if (
  text.includes("run my code") ||
  text.includes("execute my code") ||
  text.includes("run the code") ||
  text.includes("execute the code") ||
  text.includes("test my code") ||
  text.includes("compile my code")
) {
  return "CODE_EXECUTION";
}

  return "GENERAL";
};


// =====================================================
// AGENT PLANNER
// =====================================================

const createPlan = ({
  question,
}) => {

  const intent =
    detectIntent(question);

  const text =
    question.toLowerCase();

  const tools = [];

  // ============================================
  // CODE ANALYSIS
  // ============================================

  if (
    intent === "CODE_ANALYSIS" ||
    intent === "COMPLEXITY" ||
    intent === "OPTIMIZATION"
  ) {
    tools.push("analyzeCode");
  }

  // ============================================
  // CODE EXECUTION
  // ============================================

  if (
    intent === "CODE_EXECUTION" ||
    text.includes("run") ||
    text.includes("execute") ||
    text.includes("test")
  ) {
    tools.push("executeCode");
  }

  // ============================================
  // RAG
  // ============================================

  if (
    intent === "HINT" ||
    intent === "EXPLANATION" ||
    intent === "GENERAL" ||
    text.includes("explain") ||
    text.includes("why") ||
    text.includes("how")
  ) {
    tools.push("ragSearch");
  }

  // ============================================
  // COMPLEX QUESTIONS
  // ============================================

  if (
    text.includes("bug") &&
    (
      text.includes("why") ||
      text.includes("explain") ||
      text.includes("fix")
    )
  ) {
    if (!tools.includes("analyzeCode")) {
      tools.push("analyzeCode");
    }

    if (!tools.includes("ragSearch")) {
      tools.push("ragSearch");
    }
  }


  // ============================================
// DEBUG + EXECUTION + EXPLANATION
// ============================================

if (
  (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("debug")
  ) &&
  (
    text.includes("run") ||
    text.includes("execute") ||
    text.includes("test")
  )
) {

  if (!tools.includes("analyzeCode")) {
    tools.push("analyzeCode");
  }

  if (!tools.includes("executeCode")) {
    tools.push("executeCode");
  }

  if (!tools.includes("ragSearch")) {
    tools.push("ragSearch");
  }
}

  // ============================================
  // FALLBACK
  // ============================================

  if (tools.length === 0) {
    tools.push("ragSearch");
  }

  return {
    intent,
    tools,
  };
};


// =====================================================
// TOOL EXECUTION
// =====================================================

const executeTool = async ({
  tool,
  code,
  language,
  problem,
  input = "",
}) => {

  switch (tool) {

    case "analyzeCode":

      return await analyzeCode({
        code,
        language,
        problem,
      });

    case "executeCode":

      return await executeCode({
        code,
        language,
        input,
      });

    default:

      return {
        success: false,
        error:
          `Tool "${tool}" is not implemented yet.`,
      };
  }
};


// =====================================================
// RUN AGENT
// =====================================================

const runAgent = async ({
  question,
  conversationId,
  userId,
  code = "",
  language = "javascript",
  problem = "",
  input = "",
  constraints = [],
  examples = [],
}) => {

  if (!question?.trim()) {
    throw new Error(
      "Agent question is required."
    );
  }

  let conversationHistory = [];

if (conversationId && userId) {
  conversationHistory =
    await getConversationHistory({
      conversationId,
      userId,
      limit: 10,
    });
}

const historyContext =
  conversationHistory.length > 0
    ? conversationHistory
        .map((message) => {
          const role =
            message.role === "user"
              ? "User"
              : "Assistant";

          return `${role}: ${message.content}`;
        })
        .join("\n\n")
    : "No previous conversation.";

  // ============================================
  // 1. CREATE PLAN
  // ============================================

  const plan = createPlan({
    question,
  });

  // ============================================
  // 2. EXECUTE TOOLS
  // ============================================

  const toolResults = [];

  for (const tool of plan.tools) {

    // RAG will be handled separately
    if (tool === "ragSearch") {
      continue;
    }

    const result =
      await executeTool({
        tool,
        code,
        language,
        problem,
        input,
      });

    toolResults.push({
      tool,
      result,
    });
  }

  // ============================================
// 3. RAG RETRIEVAL
// ============================================

let ragContext = "";
let ragSources = [];

if (plan.tools.includes("ragSearch")) {

  const ragResult =
    await buildRAGContext({
      question,
      limit: 5,
    });

  ragContext =
    ragResult.context || "";

  ragSources =
    ragResult.documents ||
    ragResult.results ||
    [];
}

  // ============================================
  // 4. CODING CONTEXT
  // ============================================

  const basePrompt =
    buildCodingAssistantPrompt({
      code,
      language,
      question,
      problem,
      constraints,
      examples,
    });

  // ============================================
  // 5. TOOL RESULTS → AI
  // ============================================

  const toolContext =
    toolResults.length > 0
      ? JSON.stringify(
          toolResults,
          null,
          2
        )
      : "No tool results.";

  // ============================================
  // 6. FINAL AGENT PROMPT
  // ============================================

  const finalPrompt = `

You are CodeSync AI, an expert
agentic coding assistant.

You have access to tools that can
analyze code and retrieve knowledge.

Your job is to use the available
tool results and coding context to
answer the user's question.

Do not mention internal tools,
agent planning, or implementation
details unless explicitly asked.

================ CONVERSATION MEMORY ================

${historyContext}

================ USER QUESTION ================

${question}


================ CODING CONTEXT ================

${basePrompt}


================ TOOL RESULTS ================

${toolContext}


================ RAG KNOWLEDGE ================

${ragContext || "No additional knowledge retrieved."}


================ RESPONSE RULES ================

Give a clear and technically accurate
answer.

If bugs were detected:
- Explain the bug.
- Explain why it happens.
- Suggest a fix.

If complexity is requested:
- Give time complexity.
- Give space complexity.
- Briefly explain why.

If optimization is requested:
- Explain the current issue.
- Suggest a better approach.

If a hint is requested:
- Do not immediately provide the
  complete solution.


  If code execution was performed:

- If verdict is ACCEPTED, clearly state that the code executed successfully.
- If verdict is COMPILATION_ERROR, explain the compilation error.
- If verdict is RUNTIME_ERROR, explain the runtime error and likely cause.
- If verdict is TIME_LIMIT_EXCEEDED, explain the performance issue.
- If verdict is WRONG_ANSWER, explain that the output does not match the expected result.
- Use stderr and compileOutput when available.
- Do not claim that code passed unless the execution verdict is ACCEPTED.

`;



  // ============================================
  // 7. GENERATE FINAL ANSWER
  // ============================================

  const aiResult =
    await generateAIResponse({
      prompt: finalPrompt,
      context: ragContext,
    });

      // ============================================
  // 8. SAVE CONVERSATION MEMORY
  // ============================================

  if (conversationId && userId) {

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
      content: aiResult.response,
    });
  }

  // ============================================
  // 9. RETURN AGENT RESULT
  // ============================================

  return {
    success: true,

    question,

    conversationId:
      conversationId || null,

    intent:
      plan.intent,

    plan,

    toolResults,

    ragSources,


    ragContext,


    response:
      aiResult.response,
  };

 
};


module.exports = {
  detectIntent,
  createPlan,
  executeTool,
  runAgent,
};