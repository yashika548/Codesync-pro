const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const generateLLMResponse = async ({ prompt }) => {
  console.log("LLM provider: groq");

  const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: prompt,
  });

  return response.output_text || "";
};

module.exports = {
  generateLLMResponse,
};