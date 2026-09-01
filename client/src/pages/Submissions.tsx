import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProblems } from "../services/problemService";
import { getSubmissionHistory } from "../services/codeService";

import type { Problem } from "../services/problemService";

import "./Submissions.css";

interface Submission {
  _id?: string;
  verdict: string;
  language?: string;
  createdAt?: string;
  problemId: string;
  problemTitle: string;
}

const Submissions = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const problems = getProblems();

        const allSubmissions: Submission[] = [];

        await Promise.all(
          problems.map(async (problem: Problem) => {
            try {
              const response = await getSubmissionHistory(problem.id);

              const problemSubmissions =
                response.submissions || [];

              problemSubmissions.forEach(
                (submission: any) => {
                  allSubmissions.push({
                    ...submission,
                    problemId: problem.id,
                    problemTitle: problem.title,
                  });
                }
              );
            } catch (error) {
              console.error(
                `Failed to load submissions for ${problem.id}:`,
                error
              );
            }
          })
        );

        allSubmissions.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );

        console.log("ALL SUBMISSIONS:", allSubmissions);
console.log(
  "VERDICTS:",
  allSubmissions.map(
    (submission) => submission.verdict
  )
);

        setSubmissions(allSubmissions);
      } catch (error) {
        console.error(
          "Failed to load submissions:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const filteredSubmissions =
    filter === "All"
      ? submissions
      : submissions.filter(
          (submission) =>
            submission.verdict === filter
        );
 const verdictFilters = [
  "All",
  ...Array.from(
    new Set(
      submissions.map(
        (submission) => submission.verdict
      )
    )
  ),
];

        

  if (loading) {
    return (
      <div className="submissions-page">
        <div className="submissions-loading">
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="submissions-page">
      <div className="submissions-container">

        <div className="submissions-header">
          <div>
            <button
              className="submissions-back"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>

            <h1>Submission History</h1>

            <p>
              Review your coding attempts and results.
            </p>
          </div>
        </div>


        <div className="submission-stats">
  <div className="submission-stat">
    <span>Total</span>
    <strong>{submissions.length}</strong>
  </div>

  <div className="submission-stat">
    <span>Accepted</span>
    <strong>
      {
        submissions.filter(
          (submission) =>
            submission.verdict === "Accepted"
        ).length
      }
    </strong>
  </div>

  <div className="submission-stat">
    <span>Failed</span>
    <strong>
      {
        submissions.filter(
          (submission) =>
            submission.verdict !== "Accepted"
        ).length
      }
    </strong>
  </div>

  <div className="submission-stat">
    <span>Success Rate</span>
    <strong>
      {submissions.length > 0
        ? Math.round(
            (submissions.filter(
              (submission) =>
                submission.verdict === "Accepted"
            ).length /
              submissions.length) *
              100
          )
        : 0}
      %
    </strong>
  </div>
</div>

        <div className="submission-filters">
  {verdictFilters.map((option) => (
    <button
      key={option}
      className={
        filter === option
          ? "submission-filter active"
          : "submission-filter"
      }
      onClick={() => setFilter(option)}
    >
      {option}
    </button>
  ))}
</div>

        {filteredSubmissions.length === 0 ? (
          <div className="submissions-empty">
            <h2>No submissions found</h2>

            <p>
              Start solving problems to see your
              submission history here.
            </p>

            <button
              onClick={() => navigate("/problems")}
            >
              Practice Problems →
            </button>
          </div>
        ) : (
          <div className="submissions-list">

            {filteredSubmissions.map(
              (submission, index) => (
                <div
                  key={
                    submission._id ||
                    `${submission.problemId}-${submission.createdAt}-${index}`
                  }
                  className="submission-card"
                 onClick={() => {
  if (submission._id) {
    navigate(
      `/submissions/${submission._id}`
    );
  }
}}
                >
                  <div className="submission-info">
                    <h3>
                      {submission.problemTitle}
                    </h3>

                    <span>
                      {submission.language ||
                        "Unknown"}
                    </span>
                  </div>

                  <div
                    className={
                      submission.verdict ===
                      "Accepted"
                        ? "submission-status accepted"
                        : "submission-status failed"
                    }
                  >
                    {submission.verdict ===
                    "Accepted"
                      ? "✓ Accepted"
                      : `✕ ${submission.verdict}`}
                  </div>

                  <div className="submission-time">
                    {submission.createdAt
                      ? new Date(
                          submission.createdAt
                        ).toLocaleString()
                      : "Unknown date"}
                  </div>
                </div>
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Submissions;