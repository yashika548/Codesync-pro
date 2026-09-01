const crypto = require("crypto");
const { pipeline } = require("@xenova/transformers");

const EMBEDDING_DIMENSIONS = 384;

let embedder = null;

const getEmbedder = async () => {
  if (!embedder) {
    console.log("Loading local embedding model...");

    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log(
      "Local embedding model loaded successfully."
    );
  }

  return embedder;
};


// ==========================================
// MOCK EMBEDDING
// ==========================================

const createMockEmbedding = (text) => {
  const vector = new Array(
    EMBEDDING_DIMENSIONS
  ).fill(0);

  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  for (const token of tokens) {
    const hash = crypto
      .createHash("sha256")
      .update(token)
      .digest();

    const index =
      hash.readUInt32BE(0) %
      EMBEDDING_DIMENSIONS;

    const sign =
      hash[4] % 2 === 0 ? 1 : -1;

    vector[index] += sign;
  }

  const magnitude = Math.sqrt(
    vector.reduce(
      (sum, value) =>
        sum + value * value,
      0
    )
  );

  if (magnitude === 0) {
    return vector;
  }

  return vector.map(
    (value) => value / magnitude
  );
};


// ==========================================
// LOCAL REAL EMBEDDING
// ==========================================

const createLocalEmbedding = async (text) => {

  const model = await getEmbedder();

  const output = await model(
    text,
    {
      pooling: "mean",
      normalize: true,
    }
  );

  return Array.from(output.data);
};


// ==========================================
// MAIN EMBEDDING FUNCTION
// ==========================================

const createEmbedding = async (text) => {

  if (!text || !text.trim()) {
    throw new Error(
      "Cannot create embedding from empty text."
    );
  }

  const provider =
    process.env.EMBEDDING_PROVIDER ||
    "mock";

  console.log(
    `Embedding provider: ${provider}`
  );

  if (provider === "mock") {
    return createMockEmbedding(text);
  }

  if (provider === "local") {
    return createLocalEmbedding(text);
  }

  throw new Error(
    `Unsupported embedding provider: ${provider}`
  );
};


module.exports = {
  createEmbedding,
};