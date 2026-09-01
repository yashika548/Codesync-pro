import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createRoom,
  joinRoom,
} from "../services/roomService";

import "./Rooms.css";

const Rooms = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // CREATE ROOM
  // =====================================================

  const handleCreateRoom =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await createRoom();

        const room =
          response?.room;

        if (!room?.roomId) {
          throw new Error(
            "Room ID was not returned by server."
          );
        }

        navigate(
          `/room/${room.roomId}`
        );
      } catch (error: any) {
        console.error(
          "Failed to create room:",
          error
        );

        setError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to create room."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // JOIN ROOM
  // =====================================================

  const handleJoinRoom =
    async () => {
      const trimmedRoomId =
        roomId
          .trim()
          .toUpperCase();

      if (!trimmedRoomId) {
        setError(
          "Please enter a Room ID."
        );

        return;
      }

      if (
        trimmedRoomId.length !== 6
      ) {
        setError(
          "Room ID must be 6 characters."
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await joinRoom(
            trimmedRoomId
          );

        if (!response) {
          throw new Error(
            "Unable to join room."
          );
        }

        navigate(
          `/room/${trimmedRoomId}`
        );
      } catch (error: any) {
        console.error(
          "Failed to join room:",
          error
        );

        setError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to join room."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="rooms-page">

      <div className="rooms-container">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="rooms-header">

          <div>
            <div className="rooms-eyebrow">
              ⚡ COLLABORATE IN REAL TIME
            </div>

            <h1>
              Coding Rooms
            </h1>

            <p>
              Build together, solve problems,
              and collaborate with your team
              in real time.
            </p>
          </div>

        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="rooms-error">
            <span>⚠️</span>

            <span>
              {error}
            </span>
          </div>
        )}

        {/* ================================================= */}
        {/* ROOM CARDS */}
        {/* ================================================= */}

        <div className="rooms-grid">

          {/* CREATE */}

          <div className="room-card">

            <div className="room-card-icon create">
              <span>＋</span>
            </div>

            <div className="room-card-content">

              <span className="room-card-label">
                NEW SESSION
              </span>

              <h2>
                Create a Room
              </h2>

              <p>
                Start a private collaborative
                coding session and invite your
                teammates.
              </p>

              <div className="room-features">

                <span>
                  💻 Shared Editor
                </span>

                <span>
                  🎥 Video
                </span>

                <span>
                  💬 Chat
                </span>

              </div>

              <button
                className="room-create-button"
                onClick={
                  handleCreateRoom
                }
                disabled={loading}
              >
                {loading
                  ? "Creating room..."
                  : (
                    <>
                      Create Room
                      <span>→</span>
                    </>
                  )}
              </button>

            </div>

          </div>

          {/* JOIN */}

          <div className="room-card">

            <div className="room-card-icon join">
              <span>→</span>
            </div>

            <div className="room-card-content">

              <span className="room-card-label">
                JOIN SESSION
              </span>

              <h2>
                Join a Room
              </h2>

              <p>
                Enter a six-character room ID
                to join your team's workspace.
              </p>

              <div className="room-input-wrapper">

                <span>
                  #️⃣
                </span>

                <input
                  type="text"
                  placeholder="ABC123"
                  value={roomId}
                  maxLength={6}
                  onChange={(
                    event
                  ) =>
                    setRoomId(
                      event.target.value
                        .toUpperCase()
                        .replace(
                          /[^A-Z0-9]/g,
                          ""
                        )
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      handleJoinRoom();
                    }
                  }}
                  disabled={loading}
                  aria-label="Room ID"
                />

                <span className="room-id-count">
                  {roomId.length}/6
                </span>

              </div>

              <button
                className="room-join-button"
                onClick={
                  handleJoinRoom
                }
                disabled={
                  loading ||
                  roomId.length !== 6
                }
              >
                {loading
                  ? "Joining room..."
                  : (
                    <>
                      Join Room
                      <span>→</span>
                    </>
                  )}
              </button>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* INFO */}
        {/* ================================================= */}

        <div className="rooms-info-strip">

          <div>
            <span className="rooms-info-icon">
              ⚡
            </span>

            <div>
              <strong>
                Code together
              </strong>

              <p>
                Real-time code synchronization
              </p>
            </div>
          </div>

          <div>
            <span className="rooms-info-icon">
              🎥
            </span>

            <div>
              <strong>
                Meet together
              </strong>

              <p>
                Built-in video collaboration
              </p>
            </div>
          </div>

          <div>
            <span className="rooms-info-icon">
              🤖
            </span>

            <div>
              <strong>
                Solve together
              </strong>

              <p>
                Practice with CodeSync
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Rooms;