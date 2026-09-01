import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(
        name,
        email,
        password
      );

      navigate("/login");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="auth-container">

        {/* Left side */}
        <div className="auth-showcase">

          <div className="brand-logo">
            <span>⚡</span>
            CodeSync Pro
          </div>

          <h1>
            Start building
            <br />
            <span>something amazing.</span>
          </h1>

          <p>
            Create your account and start collaborating
            with developers in real-time.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon">👥</div>

              <div>
                <strong>Collaborate</strong>
                <small>
                  Code together with your team.
                </small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🚀</div>

              <div>
                <strong>Practice & Improve</strong>
                <small>
                  Solve coding problems and track progress.
                </small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🤖</div>

              <div>
                <strong>Learn with AI</strong>
                <small>
                  Get intelligent guidance while coding.
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* Register card */}
        <div className="auth-card-wrapper">

          <div className="auth-card">

            <div className="mobile-brand">
              ⚡ CodeSync Pro
            </div>

            <div className="auth-heading">

              <div className="welcome-badge">
                JOIN CODESYNC 🚀
              </div>

              <h2>Create your account</h2>

              <p>
                Start your collaborative coding journey.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div className="auth-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="input-wrapper">
                  <span>👤</span>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>

              </div>

              {/* Email */}
              <div className="auth-field">

                <label htmlFor="email">
                  Email
                </label>

                <div className="input-wrapper">
                  <span>✉️</span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    required
                  />
                </div>

              </div>

              {/* Password */}
              <div className="auth-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">
                  <span>🔒</span>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Create a password"
                    required
                  />
                </div>

              </div>

              {/* Confirm password */}
              <div className="auth-field">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="input-wrapper">
                  <span>🔐</span>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    required
                  />
                </div>

              </div>

              {/* Error */}
              {error && (
                <div className="auth-error">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="auth-button"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create CodeSync Account
                    <span>→</span>
                  </>
                )}
              </button>

            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-footer">
              Already have an account?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>

          </div>

          <p className="auth-security">
            🔐 Secure authentication · CodeSync Pro
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;