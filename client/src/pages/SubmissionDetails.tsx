import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getSubmissionDetails,
} from "../services/codeService";

import "./SubmissionDetails.css";

interface Submission {
  _id: string;
  problemId: string;
  problemTitle?: string;
  problemSlug?: string;
  language?: string;
  verdict: string;
  sourceCode?: string;
  createdAt?: string;
}

const SubmissionDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] =
    useState<Submission | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmission = async () => {
      if (!submissionId) return;

      try {
        const response =
          await getSubmissionDetails(
            submissionId
          );

        setSubmission(
          response.submission || response
        );
      } catch (error) {
        console.error(
          "Failed to load submission:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="submission-details-page">
        <div className="submission-details-loading">
          Loading submission...
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="submission-details-page">
        <div className="submission-details-empty">
          <h2>Submission not found</h2>

          <button
            onClick={() =>
              navigate("/submissions")
            }
          >
            ← Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-details-page">
      <div className="submission-details-container">

        <button
          className="submission-details-back"
          onClick={() =>
            navigate("/submissions")
          }
        >
          ← Back to Submissions
        </button>

        <div className="submission-details-header">
          <div>
            <h1>
              {submission.problemTitle ||
                "Submission"}
            </h1>

            <p>
              Submission details and code
            </p>
          </div>

          <div
            className={
              submission.verdict === "Accepted"
                ? "details-verdict accepted"
                : "details-verdict failed"
            }
          >
            {submission.verdict === "Accepted"
              ? "✓ Accepted"
              : `✕ ${submission.verdict}`}
          </div>
        </div>

        <div className="submission-meta">

          <div>
            <span>Language</span>
            <strong>
              {submission.language ||
                "Unknown"}
            </strong>
          </div>

          <div>
            <span>Submitted</span>
            <strong>
              {submission.createdAt
                ? new Date(
                    submission.createdAt
                  ).toLocaleString()
                : "Unknown"}
            </strong>
          </div>

        </div>

        <div className="submission-code-section">

          <div className="submission-code-header">
            <h2>Submitted Code</h2>
          </div>

          <pre className="submission-code">
            <code>
              {submission.sourceCode ||
                "// Submitted code unavailable"}
            </code>
          </pre>

        </div>

        <button
          className="solve-problem-button"
          onClick={() =>
            navigate(
              `/problems/${submission.problemId}`
            )
          }
        >
          Open Problem →
        </button>

      </div>
    </div>
  );
};

export default SubmissionDetails;