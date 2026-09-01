// =====================================================
// CODE ANALYSIS TOOL
// =====================================================

const analyzeCode = async ({
  code = "",
  language = "javascript",
  problem = "",
}) => {

  if (!code.trim()) {
    return {
      success: false,
      error: "No code provided for analysis.",
    };
  }

  // Basic structural analysis for now.
  // Later this tool will use an LLM + AST analysis.

  const suggestions = [];
  const bugs = [];

  // Empty / very small code
  if (code.trim().length < 10) {
    suggestions.push(
      "The submitted code is very short. Verify that the complete solution is provided."
    );
  }

  // Common JavaScript issue
  if (
    language === "javascript" &&
    code.includes("==")
  ) {
    suggestions.push(
      "Consider using strict equality (===) instead of loose equality (==)."
    );
  }

  // Infinite-loop heuristic
  if (
    code.includes("while (true)") &&
    !code.includes("break")
  ) {
    bugs.push(
      "Potential infinite loop detected: while(true) has no visible break statement."
    );
  }

  // Nested-loop heuristic
  const forCount =
  (code.match(/\bfor\s*\(/g) || []).length;

const whileCount =
  (code.match(/\bwhile\s*\(/g) || []).length;

  const loopCount =
    forCount + whileCount;

  let timeComplexity = "O(n)";
  let spaceComplexity = "O(1)";

  if (loopCount >= 2) {
    timeComplexity = "Potentially O(n²) or higher";
  }

  return {
    success: true,

    tool: "analyzeCode",

    language,

    problem,

    bugs,

    complexity: {
      time: timeComplexity,
      space: spaceComplexity,
    },

    suggestions,
  };
};


const axios = require("axios");

const executeCode = async ({
  code,
  language = "javascript",
  input = "",
}) => {
  try {
    const languageIds = {
      javascript: 63,
      typescript: 74,
      python: 71,
      java: 62,
      cpp: 54,
    };

    const languageId = languageIds[language];

    if (!languageId) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const submission = await axios.post(
      "https://ce.judge0.com/submissions",
      {
        source_code: code,
        language_id: languageId,
        stdin: input,
      },
      {
        params: {
          base64_encoded: false,
          wait: true,
        },
      }
    );

    const result = submission.data;

    const statusDescription =
  result.status?.description || "Unknown";

let verdict = "UNKNOWN";

if (statusDescription === "Accepted") {
  verdict = "ACCEPTED";
} else if (
  statusDescription === "Compilation Error"
) {
  verdict = "COMPILATION_ERROR";
} else if (
  statusDescription === "Runtime Error"
) {
  verdict = "RUNTIME_ERROR";
} else if (
  statusDescription === "Time Limit Exceeded"
) {
  verdict = "TIME_LIMIT_EXCEEDED";
} else if (
  statusDescription === "Wrong Answer"
) {
  verdict = "WRONG_ANSWER";
}


    return {
      success: true,
      verdict,
      status: result.status?.description || "Unknown",
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compileOutput: result.compile_output || "",
      time: result.time || null,
      memory: result.memory || null,
    };

  } catch (error) {
    console.error(
      "Execute Code Tool Error:",
      error
    );

    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error.message ||
        "Code execution failed.",
    };
  }
};

// =====================================================
// TOOL REGISTRY
// =====================================================

const agentTools = {
  analyzeCode,
  executeCode,
};


module.exports = {
  analyzeCode,
  agentTools,
  executeCode
};