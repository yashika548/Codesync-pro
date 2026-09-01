const AIKnowledge = require(
  "../../models/AIKnowledge"
);

const storeKnowledge = async ({
  title,
  content,
  category,
  source,
  embedding,
  metadata = {},
}) => {
  return AIKnowledge.create({
    title,
    content,
    category,
    source,
    embedding,
    metadata,
  });
};

const searchKnowledge = async (
  embedding,
  limit = 5
) => {
  if (
    !embedding ||
    !Array.isArray(embedding)
  ) {
    throw new Error(
      "Valid embedding is required for vector search."
    );
  }

  const results =
    await AIKnowledge.aggregate([
      {
        $vectorSearch: {
          index:
            "ai_knowledge_vector_index",

          path: "embedding",

          queryVector: embedding,

          numCandidates: 50,

          limit,
        },
      },

      {
        $project: {
          title: 1,
          content: 1,
          category: 1,
          source: 1,
          metadata: 1,

          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

  return results;
};

module.exports = {
  storeKnowledge,
  searchKnowledge,
};