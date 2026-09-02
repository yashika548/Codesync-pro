import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  getSubmissionHistory,
  getSubmissionDetails,
  runCode,
  getCodeResult,
  submitProblem,
} from "../services/codeService";

import AIAssistant from "../components/AIAssistant";

import {
  getProblemById,
} from "../services/problemService";

import type {
  Problem,
} from "../services/problemService";

import CodeEditor from "../components/CodeEditor";

import "./ProblemDetails.css";

type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp";

type ResultMode =
  | "none"
  | "run"
  | "submit";

const LANGUAGE_IDS: Record<
  Language,
  number
> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
};

// =====================================================
// FORMAT RUNTIME
// =====================================================

const formatRuntime = (
  value: unknown
) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "-"
  ) {
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return `${(
    number * 1000
  ).toFixed(0)} ms`;
};

// =====================================================
// FORMAT MEMORY
// =====================================================

const formatMemory = (
  value: unknown
) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "-"
  ) {
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return `${(
    number / 1024
  ).toFixed(1)} MB`;
};

// =====================================================
// COMPONENT
// =====================================================

const ProblemDetails = () => {
  const { problemId } =
    useParams();

  const navigate =
    useNavigate();

  // ===================================================
  // PROBLEM
  // ===================================================

  const [problem, setProblem] =
    useState<Problem | null>(null);

  const [problemLoading, setProblemLoading] =
    useState(true);

  // ===================================================
  // CODE
  // ===================================================

  const [language, setLanguage] =
    useState<Language>(
      "javascript"
    );

  const [code, setCode] =
    useState("");

  const [input, setInput] =
    useState("");

  // ===================================================
  // RESULT
  // ===================================================

  const [output, setOutput] =
    useState("");

  const [error, setError] =
    useState("");

  const [runtime, setRuntime] =
    useState("");

  const [memory, setMemory] =
    useState("");

  const [verdict, setVerdict] =
    useState("");

  const [resultMode, setResultMode] =
    useState<ResultMode>(
      "none"
    );

  // ===================================================
  // TEST SUMMARY
  // ===================================================

  const [passedTests, setPassedTests] =
    useState(0);

  const [totalTests, setTotalTests] =
    useState(0);

  // ===================================================
  // RUN STATUS
  // ===================================================

  const [runStatus, setRunStatus] =
    useState<
      "idle" |
      "running" |
      "success" |
      "error"
    >("idle");

  const [runTestCase, setRunTestCase] =
    useState<{
      input: string;
      output: string;
      passed: boolean;
    } | null>(null);

  // ===================================================
  // LOADING STATES
  // ===================================================

  const [isRunning, setIsRunning] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // ===================================================
  // SUBMISSIONS
  // ===================================================

  const [submissionHistory, setSubmissionHistory] =
    useState<any[]>([]);

  const [selectedSubmission, setSelectedSubmission] =
    useState<any | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [expandedTestCases, setExpandedTestCases] =
    useState<number[]>([0]);

  // ===================================================
  // LOAD PROBLEM
  // ===================================================

  useEffect(() => {
    if (!problemId) {
      setProblem(null);
      setProblemLoading(false);
      return;
    }

    const loadProblem =
      async () => {
        try {
          setProblemLoading(true);

          setProblem(null);
          setSubmissionHistory([]);
          setSelectedSubmission(null);

          console.log(
            "Loading problem:",
            problemId
          );

          const data =
            await getProblemById(
              problemId
            );

          console.log(
            "Problem loaded:",
            data
          );

          setProblem(data);
        } catch (error) {
          console.error(
            "Failed to load problem:",
            error
          );

          setProblem(null);
        } finally {
          setProblemLoading(false);
        }
      };

    loadProblem();
  }, [problemId]);

  // ===================================================
  // LOAD SUBMISSION HISTORY
  // ===================================================

  useEffect(() => {
    if (!problemId) {
      return;
    }

    const loadHistory =
      async () => {
        try {
          const history =
            await getSubmissionHistory(
              problemId
            );

          setSubmissionHistory(
            history?.submissions || []
          );
        } catch (error) {
          console.error(
            "Failed to load submission history:",
            error
          );

          setSubmissionHistory([]);
        }
      };

    loadHistory();
  }, [problemId]);

  // ===================================================
  // LOAD STARTER CODE
  // ===================================================

  useEffect(() => {
    if (!problem) {
      return;
    }

    const starterCode =
      problem.starterCode?.[
        language
      ];

    setCode(
      starterCode || ""
    );

    // Clear old result
    setOutput("");
    setError("");
    setVerdict("");

    setRuntime("");
    setMemory("");

    setPassedTests(0);
    setTotalTests(0);

    setRunTestCase(null);

    setRunStatus("idle");
    setResultMode("none");
  }, [problem, language]);

  // ===================================================
  // LOADING UI
  // ===================================================

  if (problemLoading) {
    return (
      <div className="problem-not-found">

        <h2>
          Loading Problem...
        </h2>

        <p>
          Please wait while the
          problem is loaded.
        </p>

      </div>
    );
  }

  // ===================================================
  // NOT FOUND UI
  // ===================================================

  if (!problem) {
    return (
      <div className="problem-not-found">

        <h2>
          Problem Not Found
        </h2>

        <p>
          The problem you're looking
          for does not exist or could
          not be loaded.
        </p>

        <button
          onClick={() =>
            navigate("/problems")
          }
        >
          Back to Problems
        </button>

      </div>
    );
  }

  // ===================================================
  // CODE CHANGE
  // ===================================================

  const handleCodeChange =
    (value: string) => {
      setCode(value);
    };

  // ===================================================
  // RUN CODE
  // ===================================================

  const handleRun =
    async () => {
      try {
        setIsRunning(true);

        setResultMode("run");
        setRunStatus("running");

        setOutput("");
        setError("");
        setVerdict("");

        setRuntime("");
        setMemory("");

        setPassedTests(0);
        setTotalTests(0);

        setRunTestCase(null);

        const response =
         await runCode({
    code,
    languageId: LANGUAGE_IDS[language],
    stdin: input,
});

        if (!response?.token) {
          throw new Error(
            "Judge0 did not return a token."
          );
        }

        let result: any = null;

        // =============================================
        // POLL JUDGE0
        // =============================================

        for (
          let i = 0;
          i < 15;
          i++
        ) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1000
              )
          );

          result =
            await getCodeResult(
              response.token
            );

          if (
            result?.status?.id >= 3
          ) {
            break;
          }
        }

        if (!result) {
          setRunStatus("error");

          setVerdict(
            "Execution Failed"
          );

          setError(
            "Execution timed out."
          );

          return;
        }

        // =============================================
        // RUNTIME
        // =============================================

        if (
          result.time !==
            undefined &&
          result.time !== null
        ) {
          setRuntime(
            String(result.time)
          );
        }

        // =============================================
        // MEMORY
        // =============================================

        if (
          result.memory !==
            undefined &&
          result.memory !== null
        ) {
          setMemory(
            String(result.memory)
          );
        }

        // =============================================
        // TLE
        // =============================================

        if (
          result.status?.id === 5
        ) {
          setRunStatus("error");

          setVerdict(
            "Time Limit Exceeded"
          );

          setError(
            "Your program exceeded the time limit."
          );

          setRunTestCase(null);

          return;
        }

        // =============================================
        // COMPILATION ERROR
        // =============================================

        if (
          result.compile_output
        ) {
          setRunStatus("error");

          setVerdict(
            "Compilation Error"
          );

          setError(
            result.compile_output
          );

          setRunTestCase(null);

          return;
        }

        // =============================================
        // RUNTIME ERROR
        // =============================================

        if (result.stderr) {
          setRunStatus("error");

          setVerdict(
            "Runtime Error"
          );

          setError(
            result.stderr
          );

          setRunTestCase(null);

          return;
        }

        // =============================================
        // SUCCESS
        // =============================================

        const programOutput =
          result.stdout || "";

        setRunStatus("success");

        setVerdict(
          "Executed Successfully"
        );

        setOutput(
          programOutput ||
            "Program executed successfully."
        );

        setRunTestCase({
          input:
            input ||
            "No custom input",

          output:
            programOutput ||
            "No output",

          passed: false,
        });

      } catch (error: any) {
        console.error(
          "Run error:",
          error
        );

        setRunStatus("error");

        setVerdict(
          "Execution Failed"
        );

        setError(
          error.response?.data
            ?.message ||
            error.message ||
            "Failed to execute code."
        );
      } finally {
        setIsRunning(false);
      }
    };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit =
    async () => {
      if (!problemId) {
        return;
      }

      try {
        setIsSubmitting(true);

        setResultMode("submit");

        setOutput("");
        setError("");
        setVerdict("");

        setRunTestCase(null);

        setRunStatus("idle");

        setPassedTests(0);
        setTotalTests(0);

        const result =
          await submitProblem(
            problemId,
            code,
            LANGUAGE_IDS[language]
          );

        // =============================================
        // VERDICT
        // =============================================

        setVerdict(
          result.verdict
        );

        setPassedTests(
          result.passedTests || 0
        );

        setTotalTests(
          result.totalTests || 0
        );

        // =============================================
        // RUNTIME
        // =============================================

        setRuntime(
          result.runtime !==
            undefined &&
          result.runtime !== null
            ? String(
                result.runtime
              )
            : "-"
        );

        // =============================================
        // MEMORY
        // =============================================

        setMemory(
          result.memory !==
            undefined &&
          result.memory !== null
            ? String(
                result.memory
              )
            : "-"
        );

        // =============================================
        // FAILED TEST
        // =============================================

        const failedResult =
          result.results?.find(
            (test: any) =>
              !test.passed
          );

        if (failedResult) {
          if (
            failedResult.error
          ) {
            setError(
              failedResult.error
            );
          } else {
            setError(
              `Expected: ${
                failedResult.expectedOutput ||
                ""
              }\n\nActual: ${
                failedResult.actualOutput ||
                ""
              }`
            );
          }
        } else {
          setOutput(
            `All ${
              result.totalTests
            } test cases passed.`
          );
        }

        // =============================================
        // REFRESH HISTORY
        // =============================================

        try {
          const history =
            await getSubmissionHistory(
              problemId
            );

          setSubmissionHistory(
            history?.submissions ||
              []
          );
        } catch (
          historyError
        ) {
          console.error(
            "Failed to refresh submission history:",
            historyError
          );
        }

      } catch (error: any) {
        console.error(
          "Submit error:",
          error
        );

        setVerdict(
          "Submission Failed"
        );

        setError(
          error.response?.data
            ?.message ||
            error.message ||
            "Failed to submit code."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  // ===================================================
  // TOGGLE TEST CASE
  // ===================================================

  const toggleTestCase =
    (index: number) => {
      setExpandedTestCases(
        (current) =>
          current.includes(index)
            ? current.filter(
                (item) =>
                  item !== index
              )
            : [
                ...current,
                index,
              ]
      );
    };

  // ===================================================
  // VIEW SUBMISSION
  // ===================================================

  const handleViewSubmission =
    async (
      submissionId: string
    ) => {
      try {
        setDetailsLoading(true);

        setSelectedSubmission(
          null
        );

        setExpandedTestCases([]);

        const data =
          await getSubmissionDetails(
            submissionId
          );

        setSelectedSubmission(
          data.submission
        );

        if (
          data.submission?.results &&
          data.submission.results
            .length > 0
        ) {
          setExpandedTestCases(
            [0]
          );
        }

      } catch (error: any) {
        console.error(
          "Failed to load submission details:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to load submission details."
        );
      } finally {
        setDetailsLoading(
          false
        );
      }
    };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="problem-details-page">

      <div className="problem-layout">

        {/* ========================================= */}
        {/* LEFT PANEL */}
        {/* ========================================= */}

        <div className="problem-panel">

          <button
            className="back-button"
            onClick={() =>
              navigate(
                "/problems"
              )
            }
          >
            ← Back to Problems
          </button>

          <div className="problem-title-row">

            <div className="problem-title-info">
  <h1>{problem.title}</h1>

  <div className="problem-meta">
    {problem.category && (
      <span className="problem-category">
        {problem.category}
      </span>
    )}

    <span
      className={`difficulty ${problem.difficulty.toLowerCase()}`}
    >
      {problem.difficulty}
    </span>
  </div>
</div>

          </div>

          {/* Description */}

          <section>
            <h2>
              Description
            </h2>

            <p>
              {problem.description}
            </p>
          </section>

          {/* Examples */}

          <section>
            <h2>
              Examples
            </h2>

            {problem.examples?.length >
            0 ? (
              problem.examples.map(
                (
                  example,
                  index
                ) => (
                  <div
                    className="example-box"
                    key={index}
                  >
                    <strong>
                      Example{" "}
                      {index + 1}
                    </strong>

                    <p>
                      <b>
                        Input:
                      </b>{" "}
                      {example.input}
                    </p>

                    <p>
                      <b>
                        Output:
                      </b>{" "}
                      {example.output}
                    </p>
                  </div>
                )
              )
            ) : (
              <p>
                No examples
                available.
              </p>
            )}

          </section>

          {/* Constraints */}

          <section>
            <h2>
              Constraints
            </h2>

            {problem.constraints?.length >
            0 ? (
              <ul>
                {problem.constraints.map(
                  (
                    constraint,
                    index
                  ) => (
                    <li
                      key={index}
                    >
                      {constraint}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>
                No constraints
                available.
              </p>
            )}

          </section>

        </div>

        {/* ========================================= */}
        {/* RIGHT PANEL */}
        {/* ========================================= */}

        <div className="editor-panel">

          {/* Toolbar */}

          <div className="editor-toolbar">

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target
                    .value as Language
                )
              }
              disabled={
                isRunning ||
                isSubmitting
              }
            >

              <option value="javascript">
                JavaScript
              </option>

              <option value="typescript">
                TypeScript
              </option>

              <option value="python">
                Python
              </option>

              <option value="java">
                Java
              </option>

              <option value="cpp">
                C++
              </option>

            </select>

          </div>

          {/* Editor */}

          <div className="problem-editor">

            <CodeEditor
              code={code}
              language={language}
              input={input}
              onChange={
                handleCodeChange
              }
              onInputChange={
                setInput
              }
            />

          </div>

          {/* Actions */}

          <div className="editor-actions">

            <button
              className="run-button"
              onClick={
                handleRun
              }
              disabled={
                isRunning ||
                isSubmitting
              }
            >
              {isRunning
                ? "Running..."
                : "▶ Run"}
            </button>

            <button
              className="submit-button"
              onClick={
                handleSubmit
              }
              disabled={
                isRunning ||
                isSubmitting
              }
            >
              {isSubmitting
                ? "Submitting..."
                : "✔ Submit"}
            </button>

          </div>

          {/* ======================================= */}
          {/* RESULT */}
          {/* ======================================= */}

          <div className="result-panel">

            <div className="result-header">

              <div>

                <h3>
                  Result
                </h3>

                {resultMode ===
                  "run" && (
                  <span className="result-mode">
                    Custom Input
                  </span>
                )}

                {resultMode ===
                  "submit" && (
                  <span className="result-mode">
                    Submission
                  </span>
                )}

              </div>

              {runStatus ===
                "running" && (
                <span className="result-live-status">
                  Running...
                </span>
              )}

              {isSubmitting && (
                <span className="result-live-status">
                  Evaluating...
                </span>
              )}

            </div>

            {/* ===================================== */}
            {/* SUMMARY */}
            {/* ===================================== */}

            {verdict && (
              <div className="submission-summary">

                <div
                  className={`verdict-badge ${
                    verdict
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )
                  }`}
                >

                  <span className="verdict-icon">
                    {runStatus ===
                      "success" ||
                    verdict ===
                      "Accepted"
                      ? "✓"
                      : "✕"}
                  </span>

                  <span>
                    {verdict}
                  </span>

                </div>

                {resultMode ===
                  "submit" &&
                  totalTests >
                    0 && (
                    <div className="test-summary">

                      <span className="test-summary-count">
                        {
                          passedTests
                        }{" "}
                        /{" "}
                        {
                          totalTests
                        }
                      </span>

                      <span className="test-summary-label">
                        test cases
                        passed
                      </span>

                    </div>
                  )}

                <div className="submission-stats">

                  <div className="stat-item">

                    <span className="stat-label">
                      Runtime
                    </span>

                    <span className="stat-value">
                      {formatRuntime(
                        runtime
                      )}
                    </span>

                  </div>

                  <div className="stat-item">

                    <span className="stat-label">
                      Memory
                    </span>

                    <span className="stat-value">
                      {formatMemory(
                        memory
                      )}
                    </span>

                  </div>

                </div>

              </div>
            )}

            {/* ===================================== */}
            {/* RUN TEST CASE */}
            {/* ===================================== */}

            {runTestCase && (
              <div className="run-test-case-section">

                <div className="run-test-case-header">

                  <div>
                    <h4>
                      Test Case
                    </h4>

                    <p>
                      Custom input
                      execution
                    </p>
                  </div>

                  <span className="run-test-case-passed">
                    ✓ Executed
                  </span>

                </div>

                <div className="run-test-case-grid">

                  <div className="run-test-case-field">

                    <span>
                      Input
                    </span>

                    <pre>
                      {
                        runTestCase.input
                      }
                    </pre>

                  </div>

                  <div className="run-test-case-field">

                    <span>
                      Your Output
                    </span>

                    <pre>
                      {
                        runTestCase.output
                      }
                    </pre>

                  </div>

                </div>

              </div>
            )}

            {/* ===================================== */}
            {/* OUTPUT */}
            {/* ===================================== */}

            {output && (
              <div className="output-section">

                <h4>
                  Output
                </h4>

                <pre className="success-output">
                  {output}
                </pre>

              </div>
            )}

            {/* ===================================== */}
            {/* ERROR */}
            {/* ===================================== */}

            {error && (
              <div className="output-section">

                <h4>
                  Error
                </h4>

                <pre className="error-output">
                  {error}
                </pre>

              </div>
            )}

            {/* ===================================== */}
            {/* EMPTY */}
            {/* ===================================== */}

            {!output &&
              !error &&
              !verdict && (
                <p className="empty-output">
                  Run your code or
                  submit your solution
                  to see the result.
                </p>
              )}

          </div>

          {/* ======================================= */}
          {/* AI ASSISTANT */}
          {/* ======================================= */}

          <AIAssistant
            code={code}
            language={language}
            problem={
              problem.description
            }
            constraints={
              problem.constraints ||
              []
            }
            examples={
              problem.examples ||
              []
            }
          />

          {/* ======================================= */}
          {/* SUBMISSION HISTORY */}
          {/* ======================================= */}

          <div className="submission-history">

            <div className="section-header">

              <h2>
                Submission History
              </h2>

              <span>
                {
                  submissionHistory.length
                }{" "}
                submission
                {submissionHistory.length !==
                1
                  ? "s"
                  : ""}
              </span>

            </div>

            {submissionHistory.length ===
            0 ? (

              <div className="empty-history">
                No submissions yet.
              </div>

            ) : (

              <div className="history-list">

                {submissionHistory.map(
                  (
                    submission
                  ) => (

                    <div
                      key={
                        submission._id
                      }
                      className={`history-item ${
                        selectedSubmission?._id ===
                        submission._id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleViewSubmission(
                          submission._id
                        )
                      }
                    >

                      <div className="history-main">

                        <span
                          className={`history-verdict ${
                            submission.verdict ===
                            "Accepted"
                              ? "accepted"
                              : "failed"
                          }`}
                        >
                          {submission.verdict ===
                          "Accepted"
                            ? "✓ Accepted"
                            : submission.verdict ||
                              "Failed"}
                        </span>

                        <span className="history-language">
                          {
                            submission.language ||
                            "Unknown"
                          }
                        </span>

                      </div>

                      <div className="history-stats">

                        <span>
                          Runtime:{" "}
                          {submission.runtime !=
                          null
                            ? `${submission.runtime} ms`
                            : "N/A"}
                        </span>

                        <span>
                          Memory:{" "}
                          {submission.memory !=
                          null
                            ? `${submission.memory} KB`
                            : "N/A"}
                        </span>

                      </div>

                      <div className="history-date">

                        {submission.createdAt
                          ? new Date(
                              submission.createdAt
                            ).toLocaleString()
                          : ""}

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* ======================================= */}
          {/* DETAILS LOADING */}
          {/* ======================================= */}

          {detailsLoading && (
            <div className="submission-details-overlay">

              <div className="submission-details-loading">

                <div className="loading-spinner" />

                <p>
                  Loading submission
                  details...
                </p>

              </div>

            </div>
          )}

          {/* ======================================= */}
          {/* SUBMISSION DETAILS */}
          {/* ======================================= */}

          {selectedSubmission &&
            !detailsLoading && (

            <div
              className="submission-details-overlay"
              onClick={() =>
                setSelectedSubmission(
                  null
                )
              }
            >

              <div
                className="submission-details-modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                {/* Header */}

                <div className="submission-details-header">

                  <div>

                    <h2>
                      Submission Details
                    </h2>

                    <p>
                      {selectedSubmission.createdAt
                        ? new Date(
                            selectedSubmission.createdAt
                          ).toLocaleString()
                        : ""}
                    </p>

                  </div>

                  <button
                    className="close-details-button"
                    onClick={() =>
                      setSelectedSubmission(
                        null
                      )
                    }
                  >
                    ✕
                  </button>

                </div>

                {/* Stats */}

                <div className="submission-details-stats">

                  <div className="detail-stat">

                    <span>
                      Verdict
                    </span>

                    <strong
                      className={
                        selectedSubmission.verdict ===
                        "Accepted"
                          ? "accepted"
                          : "failed"
                      }
                    >
                      {selectedSubmission.verdict ===
                      "Accepted"
                        ? "✓ Accepted"
                        : `✕ ${selectedSubmission.verdict}`}
                    </strong>

                  </div>

                  <div className="detail-stat">

                    <span>
                      Language
                    </span>

                    <strong>
                      {
                        selectedSubmission.language
                      }
                    </strong>

                  </div>

                  <div className="detail-stat">

                    <span>
                      Test Cases
                    </span>

                    <strong>
                      {
                        selectedSubmission.passedTests
                      }{" "}
                      /{" "}
                      {
                        selectedSubmission.totalTests
                      }
                    </strong>

                  </div>

                  <div className="detail-stat">

                    <span>
                      Runtime
                    </span>

                    <strong>
                      {formatRuntime(
                        selectedSubmission.runtime
                      )}
                    </strong>

                  </div>

                  <div className="detail-stat">

                    <span>
                      Memory
                    </span>

                    <strong>
                      {formatMemory(
                        selectedSubmission.memory
                      )}
                    </strong>

                  </div>

                </div>

                {/* ================================= */}
                {/* TEST CASE RESULTS */}
                {/* ================================= */}

                <div className="test-cases-section">

                  <div className="test-cases-header">

                    <div>

                      <h3>
                        Test Case Results
                      </h3>

                      <p>
                        {
                          selectedSubmission.passedTests
                        }{" "}
                        of{" "}
                        {
                          selectedSubmission.totalTests
                        }{" "}
                        test cases passed
                      </p>

                    </div>

                  </div>

                  {selectedSubmission.results &&
                  selectedSubmission
                    .results.length >
                    0 ? (

                    <div className="test-cases-list">

                      {selectedSubmission.results.map(
                        (
                          test: any,
                          index: number
                        ) => {

                          const isExpanded =
                            expandedTestCases.includes(
                              index
                            );

                          return (
                            <div
                              key={index}
                              className={`test-case-card ${
                                test.passed
                                  ? "test-case-passed"
                                  : "test-case-failed"
                              } ${
                                isExpanded
                                  ? "test-case-expanded"
                                  : "test-case-collapsed"
                              }`}
                            >

                              {/* Header */}

                              <button
                                type="button"
                                className="test-case-header"
                                onClick={() =>
                                  toggleTestCase(
                                    index
                                  )
                                }
                                aria-expanded={
                                  isExpanded
                                }
                              >

                                <div className="test-case-title">

                                  <span
                                    className={`test-case-icon ${
                                      test.passed
                                        ? "passed"
                                        : "failed"
                                    }`}
                                  >
                                    {test.passed
                                      ? "✓"
                                      : "✕"}
                                  </span>

                                  <strong>
                                    Test Case{" "}
                                    {index +
                                      1}
                                  </strong>

                                </div>

                                <div className="test-case-header-right">

                                  <span
                                    className={`test-case-status ${
                                      test.passed
                                        ? "passed"
                                        : "failed"
                                    }`}
                                  >
                                    {test.passed
                                      ? "Passed"
                                      : "Failed"}
                                  </span>

                                  <span
                                    className={`test-case-chevron ${
                                      isExpanded
                                        ? "expanded"
                                        : ""
                                    }`}
                                  >
                                    ›
                                  </span>

                                </div>

                              </button>

                              {/* Details */}

                              {isExpanded && (
                                <div className="test-case-details">

                                  <div className="test-case-field">

                                    <span className="test-case-label">
                                      Input
                                    </span>

                                    <pre>
                                      {
                                        test.input ||
                                        "—"
                                      }
                                    </pre>

                                  </div>

                                  <div className="test-case-field">

                                    <span className="test-case-label">
                                      Expected Output
                                    </span>

                                    <pre>
                                      {
                                        test.expectedOutput ||
                                        "—"
                                      }
                                    </pre>

                                  </div>

                                  <div className="test-case-field">

                                    <span className="test-case-label">
                                      Your Output
                                    </span>

                                    <pre>
                                      {
                                        test.actualOutput ||
                                        "—"
                                      }
                                    </pre>

                                  </div>

                                  {test.error && (
                                    <div className="test-case-field">

                                      <span className="test-case-label">
                                        Error
                                      </span>

                                      <pre className="test-case-error">
                                        {
                                          test.error
                                        }
                                      </pre>

                                    </div>
                                  )}

                                </div>
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div className="no-test-results">
                      No individual test
                      case results
                      available.
                    </div>

                  )}

                </div>

                {/* ================================= */}
                {/* SOURCE CODE */}
                {/* ================================= */}

                <div className="source-code-section">

                  <div className="source-code-header">

                    <h3>
                      Submitted Code
                    </h3>

                    <span>
                      {
                        selectedSubmission.language
                      }
                    </span>

                  </div>

                  <pre className="submission-source-code">
                    <code>
                      {
                        selectedSubmission.sourceCode
                      }
                    </code>
                  </pre>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ProblemDetails;
