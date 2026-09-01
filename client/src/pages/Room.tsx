import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getRoom,
  updateRoomCode,
  updateRoomLanguage,
  type Room as RoomType,
} from "../services/roomService";

import {
  runCode,
  getCodeResult,
  submitProblem,
} from "../services/codeService";

import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";

import "./Room.css";

import Chat from "../components/Chat";
import VideoMeeting from "../components/VideoMeeting";
import CodeEditor from "../components/CodeEditor";
import ActiveUsers from "../components/ActiveUsers";

import {
  getProblems,
  type Problem,
} from "../services/problemService";

const Room = () => {
  const { roomId } = useParams();
  const { user } = useAuth();

  const [room, setRoom] =
    useState<RoomType | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [problemsLoading, setProblemsLoading] =
    useState(true);

  const [problems, setProblems] =
    useState<Problem[]>([]);

  const [language, setLanguage] =
    useState("javascript");

  const [code, setCode] =
    useState("");

  const [input, setInput] =
    useState("");

  const [selectedProblem, setSelectedProblem] =
    useState("");

  const [running, setRunning] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [runResult, setRunResult] =
    useState<any>(null);

  const [submitResult, setSubmitResult] =
    useState<any>(null);

  const [activeUsers, setActiveUsers] =
    useState<
      {
        socketId: string;
        userId: string;
        name: string;
      }[]
    >([]);

  const [typingUser, setTypingUser] =
    useState<string | null>(null);

  const [copied, setCopied] =
    useState(false);

  // =====================================================
  // LOAD ROOM
  // =====================================================

  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data =
          await getRoom(roomId);

        setRoom(data);

        setCode(data.code || "");
        setLanguage(
          data.language || "javascript"
        );
      } catch (error) {
        console.error(
          "Failed to load room:",
          error
        );

        setRoom(null);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  // =====================================================
  // LOAD PROBLEMS
  // =====================================================

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setProblemsLoading(true);

        const data =
          await getProblems();

        // getProblems normally returns an array.
        // This guard prevents Room from crashing
        // if the backend ever returns an object.
        const problemList = Array.isArray(data)
          ? data
          : [];

        setProblems(problemList);
      } catch (error) {
        console.error(
          "Failed to load problems:",
          error
        );

        setProblems([]);
      } finally {
        setProblemsLoading(false);
      }
    };

    loadProblems();
  }, []);

  // =====================================================
  // COPY ROOM ID
  // =====================================================

  const handleCopyRoomId =
    async () => {
      if (!room?.roomId) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          room.roomId
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error(
          "Failed to copy room ID:",
          error
        );
      }
    };

  // =====================================================
  // CODE CHANGE
  // =====================================================

  const handleCodeChange =
    async (newCode: string) => {
      setCode(newCode);

      setRunResult(null);
      setSubmitResult(null);

      if (!roomId || !user) {
        return;
      }

      socket.emit(
        "code-change",
        {
          roomId,
          code: newCode,
        }
      );

      socket.emit(
        "typing",
        {
          roomId,
          userId: user._id,
          name: user.name,
        }
      );

      try {
        await updateRoomCode(
          roomId,
          newCode
        );
      } catch (error) {
        console.error(
          "Failed to save room code:",
          error
        );
      }
    };

  // =====================================================
  // SOCKET CONNECTION
  // =====================================================

  useEffect(() => {
    if (!user || !roomId) {
      return;
    }

    const handleActiveUsers = (
      users: {
        socketId: string;
        userId: string;
        name: string;
      }[]
    ) => {
      setActiveUsers(users);
    };

    const handleCodeUpdate = (
      updatedCode: string
    ) => {
      setCode(updatedCode);
    };

    const handleLanguageUpdate = (
      updatedLanguage: string
    ) => {
      setLanguage(updatedLanguage);
    };

    const handleTyping = (data: {
      userId: string;
      name: string;
    }) => {
      if (data.userId === user._id) {
        return;
      }

      setTypingUser(data.name);

      setTimeout(() => {
        setTypingUser(null);
      }, 1500);
    };

    const joinRoom = () => {
      socket.emit("join-room", {
        roomId,
        userId: user._id,
        name: user.name,
      });
    };

    socket.on(
      "active-users",
      handleActiveUsers
    );

    socket.on(
      "code-change",
      handleCodeUpdate
    );

    socket.on(
      "language-change",
      handleLanguageUpdate
    );

    socket.on(
      "typing",
      handleTyping
    );

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once(
        "connect",
        joinRoom
      );

      socket.connect();
    }

    return () => {
      socket.off(
        "active-users",
        handleActiveUsers
      );

      socket.off(
        "code-change",
        handleCodeUpdate
      );

      socket.off(
        "language-change",
        handleLanguageUpdate
      );

      socket.off(
        "typing",
        handleTyping
      );

      socket.off(
        "connect",
        joinRoom
      );

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user, roomId]);

  // =====================================================
  // LANGUAGE CHANGE
  // =====================================================

  const handleLanguageChange =
    async (
      newLanguage: string
    ) => {
      setLanguage(newLanguage);

      if (!roomId) {
        return;
      }

      try {
        await updateRoomLanguage(
          roomId,
          newLanguage
        );

        socket.emit(
          "language-change",
          {
            roomId,
            language: newLanguage,
          }
        );
      } catch (error) {
        console.error(
          "Failed to update room language:",
          error
        );
      }
    };

  // =====================================================
  // LANGUAGE IDS
  // =====================================================

  const languageIds: Record<
    string,
    number
  > = {
    javascript: 63,
    typescript: 74,
    python: 71,
    java: 62,
    cpp: 54,
  };

  // =====================================================
  // RUN CODE
  // =====================================================

  const handleRunCode =
    async () => {
      try {
        setRunning(true);

        setRunResult(null);
        setSubmitResult(null);

        const languageId =
          languageIds[language];

        if (!languageId) {
          setRunResult({
            error:
              "Unsupported language.",
          });

          return;
        }

        const response =
          await runCode({
            code,
            language:
              String(languageId),
            stdin: input,
          });

        const token =
          response?.token;

        if (!token) {
          setRunResult({
            error:
              "Judge0 token was not returned.",
          });

          return;
        }

        let result: any = null;

        for (
          let i = 0;
          i < 15;
          i++
        ) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1000
              )
          );

          const codeResponse =
            await getCodeResult(
              token
            );

          result =
            codeResponse?.result;

          if (
            result?.status?.id >= 3
          ) {
            break;
          }
        }

        if (!result) {
          setRunResult({
            error:
              "Execution timed out.",
          });

          return;
        }

        setRunResult(result);
      } catch (error: any) {
        console.error(
          "Run code error:",
          error
        );

        setRunResult({
          error:
            error?.response?.data
              ?.message ||
            error?.message ||
            "Code execution failed.",
        });
      } finally {
        setRunning(false);
      }
    };

  // =====================================================
  // SUBMIT CODE
  // =====================================================

  const handleSubmitCode =
    async () => {
      if (!selectedProblem) {
        setSubmitResult({
          error:
            "Please select a problem before submitting.",
        });

        return;
      }

      try {
        setSubmitting(true);

        setSubmitResult(null);
        setRunResult(null);

        const languageId =
          languageIds[language];

        if (!languageId) {
          setSubmitResult({
            error:
              "Unsupported language.",
          });

          return;
        }

        // Backend expects problemSlug.
        const response =
          await submitProblem(
            selectedProblem,
            code,
            languageId
          );

        setSubmitResult(response);
      } catch (error: any) {
        console.error(
          "Submit code error:",
          error
        );

        setSubmitResult({
          error:
            error?.response?.data
              ?.message ||
            error?.message ||
            "Submission failed.",
        });
      } finally {
        setSubmitting(false);
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="room-page">
        <div className="room-loading">
          Loading room...
        </div>
      </div>
    );
  }

  // =====================================================
  // ROOM NOT FOUND
  // =====================================================

  if (!room) {
    return (
      <div className="room-page">
        <div className="room-not-found">
          <h2>
            Room not found
          </h2>

          <p>
            This room does not exist or
            could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="room-page">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="room-header">

        <div>
          <h1 className="room-title">
            CodeSync Pro
          </h1>

          <p className="room-subtitle">
            Collaborative Coding Room
          </p>
        </div>

        <div className="room-info">

          {/* Room ID */}

          <div className="room-id">
            <span>
              Room:
            </span>

            <strong>
              {room.roomId}
            </strong>

            <button
              type="button"
              onClick={
                handleCopyRoomId
              }
            >
              {copied
                ? "✓ Copied"
                : "📋 Copy"}
            </button>
          </div>

          {/* Language */}

          <div className="room-language">

            <label htmlFor="language">
              Language:
            </label>

            <select
              id="language"
              value={language}
              onChange={(event) =>
                handleLanguageChange(
                  event.target.value
                )
              }
            >
              <option value="javascript">
                JavaScript
              </option>

              <option value="typescript">
                TypeScript
              </option>

              <option value="python">
                Python
              </option>

              <option value="java">
                Java
              </option>

              <option value="cpp">
                C++
              </option>
            </select>

          </div>

          {/* Online */}

          <span className="room-online">
            🟢 {activeUsers.length} online
          </span>

        </div>
      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="room-content">

        {/* Typing */}

        {typingUser && (
          <div className="typing-indicator">
            <span className="typing-dot">
              ●
            </span>

            <strong>
              {typingUser}
            </strong>

            &nbsp;is typing...
          </div>
        )}

        {/* ================================================= */}
        {/* EDITOR */}
        {/* ================================================= */}

        <div className="editor-container">

          <CodeEditor
            code={code}
            language={language}
            input={input}
            onChange={
              handleCodeChange
            }
            onInputChange={
              setInput
            }
          />

          {/* Code Actions */}

          <div className="room-code-actions">

            {/* Problem selector */}

            <div className="room-problem-selector">

              <label htmlFor="room-problem">
                Submit for:
              </label>

              <select
                id="room-problem"
                value={selectedProblem}
                onChange={(event) => {
                  setSelectedProblem(
                    event.target.value
                  );

                  setSubmitResult(
                    null
                  );

                  setRunResult(
                    null
                  );
                }}
                disabled={
                  problemsLoading ||
                  running ||
                  submitting
                }
              >

                <option value="">
                  {problemsLoading
                    ? "Loading problems..."
                    : "Select Problem"}
                </option>

                {problems.map(
                  (problem) => (
                    <option
                      key={problem.id}
                      value={
                        problem.slug ||
                        problem.id
                      }
                    >
                      {problem.title}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* Buttons */}

            <div className="room-action-buttons">

              <button
                className="run-code-button"
                onClick={
                  handleRunCode
                }
                disabled={
                  running ||
                  submitting
                }
              >
                {running
                  ? "Running..."
                  : "▶ Run Code"}
              </button>

              <button
                className="submit-code-button"
                onClick={
                  handleSubmitCode
                }
                disabled={
                  submitting ||
                  running ||
                  !selectedProblem
                }
              >
                {submitting
                  ? "Submitting..."
                  : "✓ Submit"}
              </button>

            </div>

          </div>

          {/* ================================================= */}
          {/* RUN RESULT */}
          {/* ================================================= */}

          {runResult && (
            <div className="room-result-panel">

              <div className="result-panel-header">

                <strong>
                  Run Result
                </strong>

                {runResult.status?.description && (
                  <span>
                    {
                      runResult.status
                        .description
                    }
                  </span>
                )}

              </div>

              {runResult.stdout && (
                <div className="result-output">

                  <strong>
                    Output
                  </strong>

                  <pre>
                    {runResult.stdout}
                  </pre>

                </div>
              )}

              {runResult.stderr && (
                <div className="result-error">

                  <strong>
                    Runtime Error
                  </strong>

                  <pre>
                    {runResult.stderr}
                  </pre>

                </div>
              )}

              {runResult.compile_output && (
                <div className="result-error">

                  <strong>
                    Compilation Error
                  </strong>

                  <pre>
                    {
                      runResult.compile_output
                    }
                  </pre>

                </div>
              )}

              {runResult.message && (
                <div className="result-error">
                  {runResult.message}
                </div>
              )}

              {runResult.error && (
                <div className="result-error">
                  {runResult.error}
                </div>
              )}

            </div>
          )}

          {/* ================================================= */}
          {/* SUBMISSION RESULT */}
          {/* ================================================= */}

          {submitResult && (
            <div className="room-result-panel">

              <div className="result-panel-header">

                <strong>
                  Submission Result
                </strong>

                {submitResult.verdict && (
                  <span
                    className={
                      submitResult.verdict ===
                      "Accepted"
                        ? "result-accepted"
                        : "result-failed"
                    }
                  >
                    {submitResult.verdict ===
                    "Accepted"
                      ? "✓ Accepted"
                      : `✕ ${submitResult.verdict}`}
                  </span>
                )}

              </div>

              {submitResult.passedTests !==
                undefined && (
                <div className="test-summary">

                  <strong>
                    {
                      submitResult.passedTests
                    }{" "}
                    /{" "}
                    {
                      submitResult.totalTests
                    }
                  </strong>{" "}
                  test cases passed

                  {submitResult.runtime !==
                    undefined && (
                    <span>
                      {" "}
                      • Runtime:{" "}
                      {submitResult.runtime}s
                    </span>
                  )}

                  {submitResult.memory !==
                    undefined && (
                    <span>
                      {" "}
                      • Memory:{" "}
                      {submitResult.memory} KB
                    </span>
                  )}

                </div>
              )}

              {submitResult.error && (
                <div className="result-error">
                  {submitResult.error}
                </div>
              )}

            </div>
          )}

        </div>

        {/* ================================================= */}
        {/* USERS + CHAT */}
        {/* ================================================= */}

        <div className="room-bottom-grid">

          <div className="users-container">

            <ActiveUsers
              users={activeUsers}
              currentUserId={
                user?._id
              }
            />

          </div>

          <div className="chat-container">

            <Chat
              roomId={roomId!}
              userId={
                user?._id || ""
              }
              userName={
                user?.name || ""
              }
            />

          </div>

        </div>

        {/* ================================================= */}
        {/* VIDEO */}
        {/* ================================================= */}

        <div className="video-container">

          <VideoMeeting
            roomId={roomId!}
          />

        </div>

      </div>
    </div>
  );
};

export default Room;