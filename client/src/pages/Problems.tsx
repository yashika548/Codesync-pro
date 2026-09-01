import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { getProblems } from "../services/problemService";
import { getSubmissionHistory } from "../services/codeService";
import type { Problem } from "../services/problemService";
import "./Problems.css";

const Problems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

const difficultyFilter = searchParams.get("difficulty");

const validDifficulty =
  difficultyFilter === "Easy" ||
  difficultyFilter === "Medium" ||
  difficultyFilter === "Hard"
    ? difficultyFilter
    : "All";
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  
  const [statusFilter, setStatusFilter] = useState<
  "all" | "solved" | "unsolved"
>("all");
  const [difficulty, setDifficulty] = useState(validDifficulty);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadProblems = async () => {
    try {
      setLoading(true);

      const data = await getProblems();

      setProblems(data);

     const solved: string[] = [];

      await Promise.all(
        data.map(async (problem) => {
          try {
            const history =
              await getSubmissionHistory(problem.id);

            const submissions =
              history.submissions || [];

            const accepted =
              submissions.some(
                (submission: any) =>
                  submission.verdict === "Accepted"
              );

            if (accepted) {
              solved.push(problem.id);
            }
          } catch (error) {
            console.error(
              `Failed to check ${problem.title}:`,
              error
            );
          }
        })
      );

      setSolvedProblems(solved);
    } catch (error) {
      console.error(
        "Failed to load problems:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadProblems();
}, [location.key]);


useEffect(() => {
  setDifficulty(validDifficulty);
}, [difficultyFilter]);


  const easyCount = problems.filter(
  (problem) => problem.difficulty === "Easy"
).length;

const mediumCount = problems.filter(
  (problem) => problem.difficulty === "Medium"
).length;

const hardCount = problems.filter(
  (problem) => problem.difficulty === "Hard"
).length;

const solvedCount = solvedProblems.length;

const progressPercentage =
  problems.length > 0
    ? Math.round((solvedCount / problems.length) * 100)
    : 0;

const categories = [
  "All",
  ...Array.from(
    new Set(
      problems
        .map((problem) => problem.category)
        .filter(Boolean)
    )
  ),
];    

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

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.id.toLowerCase().includes(search.toLowerCase());

      

    const matchesDifficulty =
      difficulty === "All" || problem.difficulty === difficulty;

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "solved" && solvedProblems.includes(problem.id)) ||
      (statusFilter === "unsolved" && !solvedProblems.includes(problem.id));

      const matchesCategory =
  category === "All" ||
  problem.category === category;

    return matchesSearch && matchesDifficulty && matchesStatus && matchesCategory;
  });

  return (
    <div className="problems-page">
      <div className="problems-container">

        <div className="problems-header">
  <div>
    <h1>Problems</h1>
    <p>
      Practice coding problems and improve your problem-solving skills.
    </p>
  </div>
</div>

<div className="problem-stats">
  <div className="stat-card">
    <span className="stat-number">{problems.length}</span>
    <span className="stat-label">Total</span>
  </div>

  <div className="stat-card">
    <span className="stat-number">{easyCount}</span>
    <span className="stat-label">Easy</span>
  </div>

  <div className="stat-card">
    <span className="stat-number">{mediumCount}</span>
    <span className="stat-label">Medium</span>
  </div>

  <div className="stat-card">
    <span className="stat-number">{hardCount}</span>
    <span className="stat-label">Hard</span>
  </div>
</div>

<div className="progress-card">

  <div className="progress-header">
    <div>
      <h3>Your Progress</h3>

      <p>
        {solvedCount} of {problems.length} problems solved
      </p>
    </div>

    <span className="progress-percentage">
      {progressPercentage}%
    </span>
  </div>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{
        width: `${progressPercentage}%`,
      }}
    />
  </div>

  <div className="difficulty-progress">

    <div className="difficulty-progress-item">
      <span>Easy</span>
      <strong>
        {solvedEasy} / {easyCount}
      </strong>
    </div>

    <div className="difficulty-progress-item">
      <span>Medium</span>
      <strong>
        {solvedMedium} / {mediumCount}
      </strong>
    </div>

    <div className="difficulty-progress-item">
      <span>Hard</span>
      <strong>
        {solvedHard} / {hardCount}
      </strong>
    </div>

  </div>

</div>


{difficulty !== "All" && (
  <div className="active-difficulty-filter">
    <span>
      Showing <strong>{difficulty}</strong> problems
    </span>

    <button
      onClick={() => {
        setDifficulty("All");
        navigate("/problems");
      }}
    >
      Clear
    </button>
  </div>
)}

        <div className="problems-controls">

  <div className="search-wrapper">
    <span className="search-icon">⌕</span>

    <input
      type="text"
      placeholder="Search problems..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {search && (
      <button
        className="clear-search"
        onClick={() => setSearch("")}
        aria-label="Clear search"
      >
        ×
      </button>
    )}
  </div>

  <select
    value={difficulty}
    onChange={(e) =>
      setDifficulty(e.target.value)
    }
  >
    <option value="All">
      All Difficulties
    </option>

    <option value="Easy">
      Easy
    </option>

    <option value="Medium">
      Medium
    </option>

    <option value="Hard">
      Hard
    </option>
  </select>

  <select
  value={category}
  onChange={(e) =>
    setCategory(e.target.value)
  }
>
  {categories.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
</select>

  <div className="status-filters">

    <button
      className={
        statusFilter === "all"
          ? "active"
          : ""
      }
      onClick={() =>
        setStatusFilter("all")
      }
    >
      All
    </button>

    <button
      className={
        statusFilter === "solved"
          ? "active"
          : ""
      }
      onClick={() =>
        setStatusFilter("solved")
      }
    >
      ✓ Solved
    </button>

    <button
      className={
        statusFilter === "unsolved"
          ? "active"
          : ""
      }
      onClick={() =>
        setStatusFilter("unsolved")
      }
    >
      ○ Unsolved
    </button>

  </div>

</div>

        {loading ? (
          <div className="problems-loading">
            Loading problems...
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="no-problems">

  <div className="no-problems-icon">
    🔍
  </div>

  <h3>No problems found</h3>

  <p>
    We couldn't find any problems matching
    your current filters.
  </p>

  <button
    onClick={() => {
      setSearch("");
      setDifficulty("All");
      setCategory("All");
      setStatusFilter("all");
      navigate("/problems");
    }}
  >
    Clear Filters
  </button>

</div>
        ) : (
          <div className="problems-list">
           {filteredProblems.map((problem, index) => (
  <div
   key={`${problem.id}-${index}`}
    className={`problem-card ${
      solvedProblems.includes(problem.id) ? "solved-card" : ""
    }`}
    onClick={() => navigate(`/problems/${problem.id}`)}
  >
    <div className="problem-number">
      {index + 1}
    </div>

    <div className="problem-info">
  <div className="problem-title-row">

    <div className="problem-title">
      
      <div className="problem-title-content">

  <h3>{problem.title}</h3>

  {problem.category && (
    <span className="problem-category">
      {problem.category}
    </span>
  )}

</div>
    </div>

    <span
      className={
        solvedProblems.includes(problem.id)
          ? "problem-status solved"
          : "problem-status unsolved"
      }
    >
      {solvedProblems.includes(problem.id)
        ? "✓ Solved"
        : "○ Unsolved"}
    </span>

  </div>

  <p className="problem-description">
    {problem.description}
  </p>
</div>

    <div
      className={`difficulty ${problem.difficulty.toLowerCase()}`}
    >
      {problem.difficulty}
    </div>

    <div className="problem-arrow">
      →
    </div>
  </div>
))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Problems;