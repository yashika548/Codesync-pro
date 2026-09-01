import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    }
  };

  return (
    <div className="auth-page">

      {/* Background decoration */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="auth-container">

        {/* Left branding */}
        <div className="auth-showcase">

          <div className="brand-logo">
            <span>⚡</span>
            CodeSync Pro
          </div>

          <h1>
            Code together.
            <br />
            <span>Build together.</span>
          </h1>

          <p>
            Your collaborative coding workspace for
            interviews, learning and real-time development.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon">💻</div>
              <div>
                <strong>Real-time Coding</strong>
                <small>
                  Collaborate inside a shared Monaco editor.
                </small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎥</div>
              <div>
                <strong>Video Collaboration</strong>
                <small>
                  Talk face-to-face while solving problems.
                </small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <div>
                <strong>AI Powered Learning</strong>
                <small>
                  Get smarter while solving coding problems.
                </small>
              </div>
            </div>

          </div>
        </div>

        {/* Login card */}
        <div className="auth-card-wrapper">

          <div className="auth-card">

            <div className="mobile-brand">
              ⚡ CodeSync Pro
            </div>

            <div className="auth-heading">

              <div className="welcome-badge">
                WELCOME BACK 👋
              </div>

              <h2>Login to your workspace</h2>

              <p>
                Continue your coding journey.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

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
                    placeholder="Enter your password"
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
                  "Logging in..."
                ) : (
                  <>
                    Login to CodeSync
                    <span>→</span>
                  </>
                )}
              </button>

            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-footer">
              Don't have an account?{" "}
              <Link to="/register">
                Create one
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

export default Login;