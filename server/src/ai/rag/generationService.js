const {
  generateAIResponse,
} = require("../aiService");

const generateRAGAnswer = async ({
  question,
  context,
}) => {
  if (!question || !question.trim()) {
    throw new Error("Question is required.");
  }

  if (!context || !context.trim()) {
    throw new Error("RAG context is required.");
  }

  const prompt = `
You are CodeSync AI, an intelligent coding assistant.

Answer the user's question using the provided knowledge context.

IMPORTANT RULES:
1. Use the provided context as the primary source of truth.
2. Do not invent information that is not supported by the context.
3. If the context does not contain enough information, clearly say so.
4. Give a clear and technically accurate explanation.
5. When appropriate, include a small code example.
6. Prefer efficient and interview-friendly solutions.

USER QUESTION:
${question}

KNOWLEDGE CONTEXT:
${context}

Now provide the best possible answer.
`;

  return generateAIResponse({
    prompt,
  });
};

module.exports = {
  generateRAGAnswer,
};