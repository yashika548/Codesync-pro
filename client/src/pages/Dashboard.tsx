import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProblems } from "../services/problemService";
import { getSubmissionHistory } from "../services/codeService";

import type { Problem } from "../services/problemService";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getProblems();

        setProblems(data);

        const solved: string[] = [];
        const allSubmissions: any[] = [];

        await Promise.all(
          data.map(async (problem) => {
            try {
              const response = await getSubmissionHistory(
                problem.id
              );

              const submissions =
                response.submissions || [];

              const isSolved = submissions.some(
                (submission: any) =>
                  submission.verdict === "Accepted"
              );

              if (isSolved) {
                solved.push(problem.id);
              }

              submissions.forEach((submission: any) => {
                allSubmissions.push({
                  ...submission,
                  problemTitle: problem.title,
                  problemId: problem.id,
                });
              });
            } catch (error) {
              console.error(
                `Failed to load history for ${problem.id}:`,
                error
              );
            }
          })
        );

        setSolvedProblems(solved);

        const sortedSubmissions =
          allSubmissions
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5);

        setRecentSubmissions(sortedSubmissions);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalProblems = problems.length;
const solvedCount = solvedProblems.length;

const easyCount = problems.filter(
  (problem) => problem.difficulty === "Easy"
).length;

const mediumCount = problems.filter(
  (problem) => problem.difficulty === "Medium"
).length;

const hardCount = problems.filter(
  (problem) => problem.difficulty === "Hard"
).length;

const solvedEasy = problems.filter(
  (problem) =>
    problem.difficulty === "Easy" &&
    solvedProblems.includes(problem.id)
).length;

const solvedMedium = problems.filter(
  (problem) =>
    problem.difficulty === "Medium" &&
    solvedProblems.includes(problem.id)
).length;

const solvedHard = problems.filter(
  (problem) =>
    problem.difficulty === "Hard" &&
    solvedProblems.includes(problem.id)
).length;

  const progressPercentage =
    totalProblems > 0
      ? Math.round(
          (solvedCount / totalProblems) * 100
        )
      : 0;

  const acceptedSubmissions =
    recentSubmissions.filter(
      (submission) =>
        submission.verdict === "Accepted"
    ).length;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    
      
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}

        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>

            <p>
              Track your coding progress and recent activity.
            </p>
          </div>

          <button
            className="practice-button"
            onClick={() => navigate("/problems")}
          >
            Practice Problems →
          </button>
        </div>

        {/* Stats */}

        <div className="dashboard-stats">

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">
              Problems Solved
            </span>

            <strong>
              {solvedCount}
            </strong>

            <span className="dashboard-stat-sub">
              of {totalProblems} total
            </span>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">
              Progress
            </span>

            <strong>
              {progressPercentage}%
            </strong>

            <span className="dashboard-stat-sub">
              completion
            </span>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">
              Submissions
            </span>

            <strong>
              {recentSubmissions.length}
            </strong>

            <span className="dashboard-stat-sub">
              recent
            </span>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">
              Accepted
            </span>

            <strong>
              {acceptedSubmissions}
            </strong>

            <span className="dashboard-stat-sub">
              recent accepted
            </span>
          </div>

        </div>

                {/* Quick Actions */}

        <div className="dashboard-section quick-actions-section">

          <div className="dashboard-section-header">
            <div>
              <h2>Quick Actions</h2>

              <p>
                Jump back into coding quickly.
              </p>
            </div>
          </div>

          <div className="quick-actions">

            <button
              className="quick-action-card"
              onClick={() => navigate("/problems")}
            >
              <div className="quick-action-icon">
                💻
              </div>

              <div>
                <h3>Solve Problems</h3>

                <p>
                  Practice coding problems and improve your skills.
                </p>
              </div>

              <span className="quick-action-arrow">
                →
              </span>
            </button>

            <button
              className="quick-action-card"
              onClick={() => navigate("/submissions")}
            >
              <div className="quick-action-icon">
                📋
              </div>

              <div>
                <h3>View Submissions</h3>

                <p>
                  Check your previous attempts and results.
                </p>
              </div>

              <span className="quick-action-arrow">
                →
              </span>
            </button>

            <button
              className="quick-action-card"
              onClick={() => navigate("/rooms")}
            >
              <div className="quick-action-icon">
                👥
              </div>

              <div>
                <h3>Collaborate</h3>

                <p>
                  Create or join a coding room with others.
                </p>
              </div>

              <span className="quick-action-arrow">
                →
              </span>
            </button>

          </div>

        </div>

        {/* Progress */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <h2>Your Progress</h2>

              <p>
                Keep solving problems to improve your
                progress.
              </p>
            </div>

            <span className="dashboard-progress-value">
              {solvedCount} / {totalProblems}
            </span>
          </div>

          <div className="dashboard-progress-bar">
            <div
              className="dashboard-progress-fill"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="dashboard-difficulty-progress">

  <button
    className="dashboard-difficulty-item"
    onClick={() => navigate("/problems?difficulty=Easy")}
  >
    <span>Easy</span>

    <strong>
      {solvedEasy} / {easyCount}
    </strong>

    <span className="difficulty-arrow">→</span>
  </button>

  <button
    className="dashboard-difficulty-item"
    onClick={() => navigate("/problems?difficulty=Medium")}
  >
    <span>Medium</span>

    <strong>
      {solvedMedium} / {mediumCount}
    </strong>

    <span className="difficulty-arrow">→</span>
  </button>

  <button
    className="dashboard-difficulty-item"
    onClick={() => navigate("/problems?difficulty=Hard")}
  >
    <span>Hard</span>

    <strong>
      {solvedHard} / {hardCount}
    </strong>

    <span className="difficulty-arrow">→</span>
  </button>

</div>

        </div>

        {/* Recent Submissions */}

        <div className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <h2>Recent Submissions</h2>

              <p>
                Your latest coding activity.
              </p>
            </div>

            <button
              className="view-problems-button"
              onClick={() =>
                navigate("/submissions")
              }
            >
              View All
            </button>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="dashboard-empty">
              No submissions yet.
            </div>
          ) : (
            <div className="recent-submissions">

              {recentSubmissions.map(
                (submission) => (
                 <div
  key={
    submission._id ||
    `${submission.problemId}-${submission.createdAt}`
  }
  className="recent-submission"
  onClick={() =>
  submission._id
    ? navigate(`/submissions/${submission._id}`)
    : navigate(`/problems/${submission.problemId}`)
}
>
  <div className="recent-submission-main">

    <div className="recent-submission-problem">
      <h3>
        {submission.problemTitle}
      </h3>

      <span>
        {submission.language || "Unknown"}
      </span>
    </div>

    <div
      className={
        submission.verdict === "Accepted"
          ? "submission-accepted"
          : "submission-failed"
      }
    >
      {submission.verdict === "Accepted"
        ? "✓ Accepted"
        : `✕ ${submission.verdict}`}
    </div>

  </div>

  <div className="recent-submission-meta">

    <span>
      Runtime:{" "}
      {submission.runtime != null
        ? `${submission.runtime} ms`
        : "N/A"}
    </span>

    <span>
      Memory:{" "}
      {submission.memory != null
        ? `${submission.memory} KB`
        : "N/A"}
    </span>

    <span className="submission-date">
      {submission.createdAt
        ? new Date(
            submission.createdAt
          ).toLocaleString()
        : ""}
    </span>

  </div>
</div>
                )
              )}

            </div>
          )}

        </div>

      </div>
    </div>
    
  );
};

export default Dashboard;