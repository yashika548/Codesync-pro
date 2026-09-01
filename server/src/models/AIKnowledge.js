const mongoose = require("mongoose");

const aiKnowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "general",
    },

    source: {
      type: String,
      default: "codesync",
    },

    embedding: {
      type: [Number],
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "aiknowledges",
  }
);

module.exports = mongoose.model(
  "AIKnowledge",
  aiKnowledgeSchema
);