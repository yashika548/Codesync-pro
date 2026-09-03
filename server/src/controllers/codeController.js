const Problem = require("../models/Problem");
const Submission = require("../models/Submission");

const {
  submitCode,
  getSubmission,
} = require("../services/judge0Service");

const {
  buildWrappedCode,
} = require("../services/codeWrapperService");

const getLanguageName = (languageId) => {
  const languages = {
    63: "JavaScript",
    74: "TypeScript",
    71: "Python",
    62: "Java",
    54: "C++",
    50: "C",
  };

  return languages[Number(languageId)] || "Unknown";
};

const getVerdictFromStatus = (statusId) => {
  const statusMap = {
    3: "Accepted",
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error",
    8: "Runtime Error",
    9: "Runtime Error",
    10: "Runtime Error",
    11: "Runtime Error",
    12: "Runtime Error",
  };

  return statusMap[Number(statusId)] || "Runtime Error";
};

const runCode = async (req, res) => {
  try {
    const { sourceCode, languageId, stdin } = req.body;

    if (!sourceCode || !languageId) {
      return res.status(400).json({
        message: "Source code and language are required",
      });
    }

    const submission = await submitCode({
      sourceCode,
      languageId,
      stdin: stdin || "",
    });

    res.status(200).json({
      success: true,
      token: submission.token,
    });
  } catch (error) {
    console.error("Run code error:", error);

    res.status(500).json({
      message: error.message || "Code execution failed",
    });
  }
};

const getCodeResult = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await getSubmission(token);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Get result error:", error);

    res.status(500).json({
      message: error.message || "Failed to get result",
    });
  }
};

const submitProblem = async (req, res) => {
  try {
    const { problemSlug, sourceCode, languageId } = req.body;

    if (!problemSlug || !sourceCode || !languageId) {
      return res.status(400).json({
        message: "Problem slug, source code and language are required",
      });
    }

    const problem = await Problem.findOne({
      slug: problemSlug,
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    let passedTests = 0;
    const results = [];

    let totalRuntime = 0;
    let peakMemory = 0;

    for (const testCase of problem.testCases) {
      const wrappedCode = buildWrappedCode({
        sourceCode,
        languageId,
        problemSlug: problem.slug,
        input: testCase.input,
      });

      console.log("=================================");
      console.log("Submitting problem:", problem.slug);
      console.log("Test input:", testCase.input);
      console.log("Language ID:", languageId);
      console.log("Wrapped code:");
      console.log(wrappedCode);
      console.log("=================================");

      const submissionResult = await submitCode({
        sourceCode: wrappedCode,
        languageId,
        stdin: "",
      });

      const token = submissionResult.token;

      let result = null;
      

      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );

        result = await getSubmission(token);

        if (result?.status?.id >= 3) {
          break;
        }
       
      }
      if (result?.time) {
  totalRuntime += Number(result.time);
}

if (result?.memory) {
  peakMemory = Math.max(
    peakMemory,
    Number(result.memory)
  );
}

      if (!result) {
        results.push({
          passed: false,
          error: "Execution timed out",
        });

        break;
      }

     const statusId = Number(result.status?.id);

const actualOutput = (result.stdout || "")
  .trim()
  .replace(/\s+/g, " ");

const expectedOutput = (
  testCase.expectedOutput || ""
)
  .trim()
  .replace(/\s+/g, " ");

const passed =
  statusId === 3 &&
  actualOutput === expectedOutput;

if (passed) {
  passedTests++;
}

const testVerdict =
  statusId === 3
    ? "Accepted"
    : getVerdictFromStatus(statusId);

results.push({
  passed,

  input: testCase.isHidden
    ? undefined
    : testCase.input,

  expectedOutput: testCase.isHidden
    ? undefined
    : expectedOutput,

  actualOutput: testCase.isHidden
    ? undefined
    : actualOutput,

  status: result.status?.description,

  verdict: testVerdict,

  runtime: result.time || null,

  memory: result.memory || null,

  error:
    result.stderr ||
    result.compile_output ||
    undefined,
});

if (!passed) {
  break;
}

      
    }

    const totalTests = problem.testCases.length;

let verdict = "Accepted";

if (results.length > 0) {
  const firstFailedResult = results.find(
    (result) => !result.passed
  );

  if (firstFailedResult) {
    verdict =
      firstFailedResult.verdict ||
      "Wrong Answer";
  }
}

 

const languageName = getLanguageName(languageId);

console.log("=================================");
console.log("SUBMISSION DATA");
console.log("languageId:", languageId);
console.log("languageName:", languageName);
console.log("=================================");

if (!languageName) {
  return res.status(400).json({
    message: `Unsupported language ID: ${languageId}`,
  });
}

const submission = await Submission.create({
  userId: req.user.id,
  problemId: problem._id,
  problemSlug: problem.slug,
  language: languageName,
  languageId: Number(languageId),
  sourceCode,
  verdict,
  passedTests,
  totalTests,
  runtime: totalRuntime,
  memory: peakMemory,
  results:results,
});

    res.status(200).json({
  success: true,
  verdict,
  passedTests,
  totalTests,

  runtime: totalRuntime,
  memory: peakMemory,

  results,
  submissionId: submission._id,
});
  } catch (error) {
    console.error("=================================");
    console.error("SUBMIT PROBLEM ERROR:");
    console.error(error);
    console.error("=================================");

    res.status(500).json({
      message:
        error.message ||
        "Failed to submit solution",
    });
  }
};

const getSubmissionHistory = async (req, res) => {
  try {
    const { problemSlug } = req.params;

    console.log("========== HISTORY DEBUG ==========");
    console.log("USER ID:", req.user.id);
    console.log("PROBLEM SLUG FROM URL:", problemSlug);

    const submissions = await Submission.find({
      userId: req.user.id,
      problemSlug,
    })
      .select(
        "problemSlug language languageId verdict passedTests totalTests runtime memory results createdAt"
      )
      .sort({ createdAt: -1 });

    console.log("FOUND SUBMISSIONS:", submissions.length);
    console.log("SUBMISSIONS:", submissions);
    console.log("===================================");

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Get submission history error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to fetch submission history",
    });
  }
};

const getSubmissionDetails = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findOne({
      _id: submissionId,
      userId: req.user.id,
    });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    console.log("========== SUBMISSION DETAILS ==========");
    console.log("Submission ID:", submission._id);
    console.log("Passed:", submission.passedTests);
    console.log("Total:", submission.totalTests);
    console.log("Results:", submission.results);
    console.log("Results count:", submission.results?.length);
    console.log("========================================");

    res.status(200).json({
      success: true,
      submission: {
        _id: submission._id,
        problemSlug: submission.problemSlug,
        language: submission.language,
        languageId: submission.languageId,
        sourceCode: submission.sourceCode,
        verdict: submission.verdict,
        passedTests: submission.passedTests,
        totalTests: submission.totalTests,
        runtime: submission.runtime,
        memory: submission.memory,
        results: submission.results || [],
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Get submission details error:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to fetch submission details",
    });
  }
};

module.exports = {
  runCode,
  getCodeResult,
  submitProblem,
  getSubmissionHistory,
  getSubmissionDetails,
};