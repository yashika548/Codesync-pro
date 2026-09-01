const Problem = require("../models/Problem");

const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select(
      "_id title difficulty category"
    );

    res.status(200).json(problems);
  } catch (error) {
    console.error("Get problems error:", error);

    res.status(500).json({
      message: "Failed to get problems",
    });
  }
};

const getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(
      req.params.id
    );

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error("Get problem error:", error);

    res.status(500).json({
      message: "Failed to get problem",
    });
  }
};

module.exports = {
  getProblems,
  getProblem,
};