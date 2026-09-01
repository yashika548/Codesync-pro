const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },

    expectedOutput: {
      type: String,
      default: "",
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const problemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    starterCode: {
      javascript: {
        type: String,
        default: "",
      },

      python: {
        type: String,
        default: "",
      },

      cpp: {
        type: String,
        default: "",
      },

      java: {
        type: String,
        default: "",
      },
    },

    testCases: {
      type: [testCaseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", problemSchema);