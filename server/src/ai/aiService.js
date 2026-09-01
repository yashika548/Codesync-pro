const {
  generateLLMResponse,
} = require("./providers/llmProvider");


const generateAIResponse = async ({
  prompt,
  context = "",
}) => {

  const finalPrompt = `
You are CodeSync AI, an expert coding assistant.

Use the following retrieved knowledge to answer
the user's question.

================ RAG CONTEXT ================

${context || "No additional knowledge available."}

================ END CONTEXT =================

USER REQUEST:

${prompt}

Instructions:

1. Give a clear technical explanation.
2. Prefer efficient algorithms.
3. Mention time and space complexity when relevant.
4. Do not invent information that contradicts the
   retrieved context.
5. If the context is insufficient, say so clearly.
`;


  const response =
    await generateLLMResponse({
      prompt: finalPrompt,
    });


  return {
    response,
    context,
  };
};


module.exports = {
  generateAIResponse,
};