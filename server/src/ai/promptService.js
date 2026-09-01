const buildCodingAssistantPrompt = ({
  code,
  language,
  question,
  problem = "",
  constraints = [],
  examples = [],
}) => {
  const formattedConstraints =
    constraints.length > 0
      ? constraints.map((item) => `- ${item}`).join("\n")
      : "No constraints provided.";

  const formattedExamples =
    examples.length > 0
      ? examples
          .map(
            (example, index) =>
              `Example ${index + 1}:
Input: ${example.input}
Output: ${example.output}`
          )
          .join("\n\n")
      : "No examples provided.";

  return `
You are CodeSync AI, an expert competitive programming
and software engineering assistant.

Your job is to help the user understand and improve their
code without unnecessarily rewriting correct solutions.

PROBLEM:
${problem}

CONSTRAINTS:
${formattedConstraints}

EXAMPLES:
${formattedExamples}

PROGRAMMING LANGUAGE:
${language}

USER CODE:
${code}

USER QUESTION:
${question}

Instructions:

1. Analyze the user's code carefully.
2. Answer the user's specific question.
3. If there is a bug, explain the exact issue.
4. If suggesting code changes, explain why.
5. Mention time complexity when relevant.
6. Mention space complexity when relevant.
7. Do not invent requirements that are not present.
8. Keep the explanation understandable for a developer
   preparing for technical interviews.
`;

};

module.exports = {
  buildCodingAssistantPrompt,
};