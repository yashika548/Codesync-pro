const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    problemSlug: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    languageId: {
      type: Number,
      required: true,
    },

    sourceCode: {
      type: String,
      required: true,
    },

    verdict: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Runtime Error",
        "Compilation Error",
        "Time Limit Exceeded",
        "Submission Failed",
      ],
      required: true,
    },

    passedTests: {
      type: Number,
      default: 0,
    },

    totalTests: {
      type: Number,
      default: 0,
    },

    runtime: {
      type: Number,
      default: 0,
    },

    memory: {
      type: Number,
      default: 0,
    },

    results: [
  {
    passed: {
      type: Boolean,
      default: false,
    },

    input: {
      type: String,
      default: "",
    },

    expectedOutput: {
      type: String,
      default: "",
    },

    actualOutput: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "",
    },

    runtime: {
      type: Number,
      default: null,
    },

    memory: {
      type: Number,
      default: null,
    },

    error: {
      type: String,
      default: "",
    },
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);