import { useNavigate } from "react-router-dom";
import "./ProblemCard.css";

interface ProblemCardProps {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags?: string[];
}

const ProblemCard = ({
  id,
  title,
  difficulty,
  tags = [],
}: ProblemCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="problem-card"
      onClick={() => navigate(`/problems/${id}`)}
    >
      <div className="problem-card-header">
        <h3>{title}</h3>

        <span className={`difficulty ${difficulty.toLowerCase()}`}>
          {difficulty}
        </span>
      </div>

      {tags.length > 0 && (
        <div className="problem-tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemCard;