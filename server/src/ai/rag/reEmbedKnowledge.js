const mongoose = require("mongoose");
require("dotenv").config();

const AIKnowledge = require("../../models/AIKnowledge");
const { createEmbedding } = require("./embeddingService");

const reEmbedKnowledge = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    const documents = await AIKnowledge.find({});

    console.log(
      `Found ${documents.length} knowledge documents.`
    );

    for (const document of documents) {
      console.log(
        `Re-embedding: ${document.title}`
      );

      const text = `
Title: ${document.title}

Category: ${document.category}

Content:
${document.content}
      `;

      const embedding =
        await createEmbedding(text);

      console.log(
        `Embedding dimensions: ${embedding.length}`
      );

      document.embedding = embedding;

      await document.save();

      console.log(
        `Updated: ${document.title}`
      );
    }

    console.log(
      "================================"
    );

    console.log(
      "All knowledge documents re-embedded."
    );

    console.log(
      "================================"
    );

    await mongoose.connection.close();

    process.exit(0);

  } catch (error) {

    console.error(
      "Re-embedding failed:"
    );

    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

reEmbedKnowledge();