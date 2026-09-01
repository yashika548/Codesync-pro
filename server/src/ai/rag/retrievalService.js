const {
  createEmbedding,
} = require("./embeddingService");

const {
  searchKnowledge,
} = require("./vectorService");

const retrieveRelevantKnowledge = async (
  query,
  limit = 5
) => {
  if (!query || !query.trim()) {
    throw new Error(
      "Search query cannot be empty."
    );
  }

  console.log(
    "Creating embedding for query..."
  );

  const embedding =
    await createEmbedding(query);

  console.log(
    "Embedding created successfully."
  );

  console.log(
    "Searching vector database..."
  );

  const results =
    await searchKnowledge(
      embedding,
      limit
    );

  console.log(
    `Vector search returned ${results.length} results.`
  );

  return results;
};

module.exports = {
  retrieveRelevantKnowledge,
};