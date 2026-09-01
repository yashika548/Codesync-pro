import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import Rooms from "./pages/Rooms";
import Room from "./pages/Room";

import Submissions from "./pages/Submissions";
import SubmissionDetails from "./pages/SubmissionDetails";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Register />
            )
          }
        />

        {/* =========================
            PROTECTED APP
        ========================= */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Problems */}

          <Route
            path="/problems"
            element={<Problems />}
          />

          {/* Problem Details */}

          <Route
            path="/problems/:problemId"
            element={<ProblemDetails />}
          />

          {/* Submissions */}

          <Route
            path="/submissions"
            element={<Submissions />}
          />

          {/* Submission Details */}

          <Route
            path="/submissions/:submissionId"
            element={<SubmissionDetails />}
          />

          {/* Room */}


           <Route
    path="/rooms"
    element={<Rooms />}
  />


          <Route
            path="/room/:roomId"
            element={<Room />}
          />

        </Route>

        {/* =========================
            ROOT
        ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                user
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

        {/* =========================
            UNKNOWN ROUTE
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;