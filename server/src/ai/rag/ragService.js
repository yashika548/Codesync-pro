const {
  retrieveRelevantKnowledge,
} = require("./retrievalService");

const buildRAGContext = async ({
  question,
  limit = 5,
}) => {
  const documents =
    await retrieveRelevantKnowledge(
      question,
      limit
    );

  if (
    !documents ||
    documents.length === 0
  ) {
    return {
      documents: [],
      context:
        "No relevant knowledge was found.",
    };
  }

  const context = documents
    .map(
      (document, index) => `
Knowledge ${index + 1}

Title:
${document.title}

Category:
${document.category}

Content:
${document.content}

Relevance Score:
${document.score}
`
    )
    .join("\n");

  return {
    documents,
    context,
  };
};

module.exports = {
  buildRAGContext,
};