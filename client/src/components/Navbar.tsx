import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
  if (path === "/problems") {
    return location.pathname.startsWith("/problems");
  }

  return location.pathname === path;
};

  const handleLogout = async () => {
  try {
    await logout();
  } finally {
    navigate("/login", { replace: true });
  }
};

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <div
          className="navbar-logo"
          onClick={() => navigate("/dashboard")}
        >
          <span className="logo-code">Code</span>
          <span className="logo-sync">Sync</span>
          <span className="logo-pro"> Pro</span>
        </div>

        {/* Navigation */}

        <div className="navbar-links">

          <button
            className={
              isActive("/dashboard")
                ? "navbar-link active"
                : "navbar-link"
            }
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              isActive("/problems")
                ? "navbar-link active"
                : "navbar-link"
            }
            onClick={() => navigate("/problems")}
          >
            Problems
          </button>

        </div>

        {/* User */}

        <div className="navbar-user">

          <span className="navbar-welcome">
            Hi, {user?.name || "User"}
          </span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;