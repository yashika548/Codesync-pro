import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">C</div>
        <span>CodeSync Pro</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>⌂</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/problems"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>⌘</span>
          Problems
        </NavLink>

        <NavLink
          to="/submissions"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>✓</span>
          Submissions
        </NavLink>

        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <span>◉</span>
          Rooms
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
        )}

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;