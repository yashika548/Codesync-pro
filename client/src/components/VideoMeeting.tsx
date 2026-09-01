import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import socket from "../services/socket";
import "./VideoMeeting.css";

interface VideoMeetingProps {
  roomId: string;
}

interface IncomingCall {
  callerSocketId: string;
  callerName: string;
}

type CallStatus =
  | "idle"
  | "calling"
  | "incoming"
  | "connecting"
  | "connected";

const VideoMeeting = ({
  roomId,
}: VideoMeetingProps) => {
  // =====================================================
  // VIDEO ELEMENTS
  // =====================================================

  const localVideoRef =
    useRef<HTMLVideoElement | null>(null);

  const remoteVideoRef =
    useRef<HTMLVideoElement | null>(null);

  // =====================================================
  // MEDIA
  // =====================================================

  const localStreamRef =
    useRef<MediaStream | null>(null);

  const localAudioTrackRef =
    useRef<MediaStreamTrack | null>(null);

  const localVideoTrackRef =
    useRef<MediaStreamTrack | null>(null);

  const screenStreamRef =
    useRef<MediaStream | null>(null);

  // =====================================================
  // WEBRTC
  // =====================================================

  const peerConnectionRef =
    useRef<RTCPeerConnection | null>(null);

  const audioSenderRef =
    useRef<RTCRtpSender | null>(null);

  const videoSenderRef =
    useRef<RTCRtpSender | null>(null);

  const pendingIceCandidatesRef =
    useRef<RTCIceCandidateInit[]>([]);

  const activePeerRef =
    useRef<string | null>(null);

  // Prevent duplicate getUserMedia calls.
  const mediaRequestRef =
    useRef<Promise<boolean> | null>(null);

  // =====================================================
  // STATE
  // =====================================================

  const [callStatus, setCallStatus] =
    useState<CallStatus>("idle");

  const [micOn, setMicOn] =
    useState(false);

  const [cameraOn, setCameraOn] =
    useState(false);

  const [remoteConnected, setRemoteConnected] =
    useState(false);

  const [cameraLoading, setCameraLoading] =
    useState(false);

  const [isScreenSharing, setIsScreenSharing] =
    useState(false);

  const [incomingCall, setIncomingCall] =
    useState<IncomingCall | null>(null);

  // =====================================================
  // ATTACH LOCAL STREAM
  // =====================================================

  const attachLocalStream = () => {
    if (!localVideoRef.current) {
      return;
    }

    if (!localStreamRef.current) {
      return;
    }

    localVideoRef.current.srcObject =
      localStreamRef.current;

    localVideoRef.current
      .play()
      .catch(() => {});
  };

  // =====================================================
  // START MICROPHONE ONLY
  // =====================================================

  const startMicrophone =
    useCallback(async () => {
      if (
        localAudioTrackRef.current
      ) {
        return true;
      }

      if (
        mediaRequestRef.current
      ) {
        return mediaRequestRef.current;
      }

      const request =
        (async () => {
          try {
            const stream =
              await navigator.mediaDevices.getUserMedia(
                {
                  audio: true,
                  video: false,
                }
              );

            const audioTrack =
              stream.getAudioTracks()[0];

            if (!audioTrack) {
              stream
                .getTracks()
                .forEach((track) =>
                  track.stop()
                );

              return false;
            }

            localAudioTrackRef.current =
              audioTrack;

            if (
              !localStreamRef.current
            ) {
              localStreamRef.current =
                new MediaStream();
            }

            localStreamRef.current.addTrack(
              audioTrack
            );

            attachLocalStream();

            audioTrack.enabled = true;

            setMicOn(true);

            console.log(
              "Microphone started"
            );

            return true;
          } catch (error) {
            console.error(
              "Microphone error:",
              error
            );

            setMicOn(false);

            alert(
              "Microphone could not be started. Please check browser microphone permissions."
            );

            return false;
          } finally {
            mediaRequestRef.current =
              null;
          }
        })();

      mediaRequestRef.current =
        request;

      return request;
    }, []);

  // =====================================================
  // START CAMERA ONLY
  // =====================================================

  const startCamera =
    useCallback(async () => {
      if (
        localVideoTrackRef.current
      ) {
        localVideoTrackRef.current.enabled =
          true;

        setCameraOn(true);

        return true;
      }

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        alert(
          "Camera is not supported by this browser."
        );

        return false;
      }

      try {
        setCameraLoading(true);

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: true,
              audio: false,
            }
          );

        const videoTrack =
          stream.getVideoTracks()[0];

        if (!videoTrack) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          return false;
        }

        localVideoTrackRef.current =
          videoTrack;

        if (
          !localStreamRef.current
        ) {
          localStreamRef.current =
            new MediaStream();
        }

        localStreamRef.current.addTrack(
          videoTrack
        );

        attachLocalStream();

        videoTrack.enabled = true;

        setCameraOn(true);

        // Add camera to existing peer.
        if (
          peerConnectionRef.current
        ) {
          if (
            !videoSenderRef.current
          ) {
            videoSenderRef.current =
              peerConnectionRef.current.addTrack(
                videoTrack,
                localStreamRef.current
              );
          } else {
            await videoSenderRef.current.replaceTrack(
              videoTrack
            );
          }

          // Camera was newly added,
          // so renegotiate.
          await createOffer();
        }

        console.log(
          "Camera started"
        );

        return true;
      } catch (error) {
        console.error(
          "Camera error:",
          error
        );

        setCameraOn(false);

        alert(
          "Camera could not be started. Please close any other application/tab using your camera and try again."
        );

        return false;
      } finally {
        setCameraLoading(false);
      }
    }, []);

  // =====================================================
  // STOP CAMERA
  // =====================================================

  const stopCamera =
    useCallback(async () => {
      const videoTrack =
        localVideoTrackRef.current;

      if (!videoTrack) {
        setCameraOn(false);
        return;
      }

      videoTrack.enabled =
        false;

      // Stop actual camera hardware.
      videoTrack.stop();

      localVideoTrackRef.current =
        null;

      // Remove camera from local stream.
      if (
        localStreamRef.current
      ) {
        const track =
          localStreamRef.current
            .getVideoTracks()
            .find(
              (item) =>
                item ===
                videoTrack
            );

        if (track) {
          localStreamRef.current.removeTrack(
            track
          );
        }
      }

      // Remove WebRTC sender.
      if (
        videoSenderRef.current
      ) {
        try {
          await videoSenderRef.current.replaceTrack(
            null
          );
        } catch {
          // Ignore.
        }
      }

      videoSenderRef.current =
        null;

      setCameraOn(false);

      attachLocalStream();
    }, []);

  // =====================================================
  // CREATE PEER CONNECTION
  // =====================================================

  const createPeerConnection =
    useCallback(() => {
      if (
        peerConnectionRef.current
      ) {
        return peerConnectionRef.current;
      }

      const peer =
        new RTCPeerConnection({
          iceServers: [
            {
              urls:
                "stun:stun.l.google.com:19302",
            },
          ],
        });

      peerConnectionRef.current =
        peer;

      // -------------------------------------------------
      // ADD AUDIO
      // -------------------------------------------------

      if (
        localAudioTrackRef.current &&
        localStreamRef.current
      ) {
        audioSenderRef.current =
          peer.addTrack(
            localAudioTrackRef.current,
            localStreamRef.current
          );
      }

      // -------------------------------------------------
      // ADD VIDEO ONLY IF CAMERA IS ON
      // -------------------------------------------------

      if (
        localVideoTrackRef.current &&
        localStreamRef.current
      ) {
        videoSenderRef.current =
          peer.addTrack(
            localVideoTrackRef.current,
            localStreamRef.current
          );
      }

      // -------------------------------------------------
      // ICE
      // -------------------------------------------------

      peer.onicecandidate = (
        event
      ) => {
        if (
          !event.candidate
        ) {
          return;
        }

        const target =
          activePeerRef.current;

        if (!target) {
          return;
        }

        socket.emit(
          "webrtc-ice-candidate",
          {
            roomId,
            targetSocketId:
              target,
            candidate:
              event.candidate,
          }
        );
      };

      // -------------------------------------------------
      // REMOTE TRACK
      // -------------------------------------------------

      peer.ontrack = (
        event
      ) => {
        if (
          !remoteVideoRef.current
        ) {
          return;
        }

        let remoteStream =
          remoteVideoRef.current
            .srcObject as
            | MediaStream
            | null;

        if (!remoteStream) {
          remoteStream =
            new MediaStream();

          remoteVideoRef.current.srcObject =
            remoteStream;
        }

        // Prevent duplicate tracks.
        const alreadyExists =
          remoteStream
            .getTracks()
            .some(
              (track) =>
                track.id ===
                event.track.id
            );

        if (!alreadyExists) {
          remoteStream.addTrack(
            event.track
          );
        }

        remoteVideoRef.current
          .play()
          .catch(() => {});

        setRemoteConnected(true);

        setCallStatus(
          "connected"
        );
      };

      // -------------------------------------------------
      // CONNECTION
      // -------------------------------------------------

      peer.onconnectionstatechange =
        () => {
          console.log(
            "WebRTC:",
            peer.connectionState
          );

          if (
            peer.connectionState ===
            "connected"
          ) {
            setRemoteConnected(
              true
            );

            setCallStatus(
              "connected"
            );
          }

          if (
            peer.connectionState ===
              "failed" ||
            peer.connectionState ===
              "disconnected"
          ) {
            setRemoteConnected(
              false
            );
          }
        };

      return peer;
    }, [roomId]);

  // =====================================================
  // FLUSH ICE
  // =====================================================

  const flushPendingIce =
    useCallback(async () => {
      const peer =
        peerConnectionRef.current;

      if (
        !peer ||
        !peer.remoteDescription
      ) {
        return;
      }

      const candidates =
        [
          ...pendingIceCandidatesRef.current,
        ];

      pendingIceCandidatesRef.current =
        [];

      for (
        const candidate of candidates
      ) {
        try {
          await peer.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );
        } catch (
          error
        ) {
          console.error(
            "ICE candidate error:",
            error
          );
        }
      }
    }, []);

  // =====================================================
  // CREATE OFFER
  // =====================================================

  const createOffer =
    useCallback(async () => {
      const target =
        activePeerRef.current;

      if (!target) {
        return;
      }

      const peer =
        createPeerConnection();

      if (
        peer.signalingState !==
        "stable"
      ) {
        return;
      }

      try {
        const offer =
          await peer.createOffer();

        await peer.setLocalDescription(
          offer
        );

        socket.emit(
          "webrtc-offer",
          {
            roomId,
            targetSocketId:
              target,
            offer,
          }
        );

        console.log(
          "WebRTC offer sent"
        );
      } catch (
        error
      ) {
        console.error(
          "Offer error:",
          error
        );
      }
    }, [
      createPeerConnection,
      roomId,
    ]);

  // =====================================================
  // CALL USER
  // =====================================================

  const callTeammate =
    async () => {
      if (
        callStatus !==
        "idle"
      ) {
        return;
      }

      // IMPORTANT:
      // Start microphone ONLY.
      // Camera remains completely OFF.
      const micStarted =
        await startMicrophone();

      if (!micStarted) {
        return;
      }

      setCallStatus(
        "calling"
      );

      socket.emit(
        "video-call-request",
        {
          roomId,
        }
      );

      console.log(
        "Calling teammate..."
      );
    };

  // =====================================================
  // INCOMING CALL
  // =====================================================

  const handleIncomingCall =
    useCallback(
      ({
        callerSocketId,
        callerName,
      }: IncomingCall) => {
        if (
          callStatus !==
          "idle"
        ) {
          return;
        }

        console.log(
          "Incoming call from:",
          callerName
        );

        activePeerRef.current =
          callerSocketId;

        setIncomingCall({
          callerSocketId,
          callerName,
        });

        setCallStatus(
          "incoming"
        );
      },
      [callStatus]
    );

  // =====================================================
  // ACCEPT
  // =====================================================

  const acceptCall =
    async () => {
      if (!incomingCall) {
        return;
      }

      const callerId =
        incomingCall.callerSocketId;

      const micStarted =
        await startMicrophone();

      if (!micStarted) {
        socket.emit(
          "video-call-rejected",
          {
            roomId,
            callerSocketId:
              callerId,
          }
        );

        setIncomingCall(
          null
        );

        setCallStatus(
          "idle"
        );

        return;
      }

      activePeerRef.current =
        callerId;

      createPeerConnection();

      setIncomingCall(
        null
      );

      setCallStatus(
        "connecting"
      );

      socket.emit(
        "video-call-accepted",
        {
          roomId,
          callerSocketId:
            callerId,
        }
      );

      console.log(
        "Call accepted"
      );
    };

  // =====================================================
  // DECLINE
  // =====================================================

  const declineCall =
    () => {
      if (!incomingCall) {
        return;
      }

      socket.emit(
        "video-call-rejected",
        {
          roomId,
          callerSocketId:
            incomingCall.callerSocketId,
        }
      );

      setIncomingCall(
        null
      );

      setCallStatus(
        "idle"
      );
    };

  // =====================================================
  // CALL ACCEPTED
  // =====================================================

  const handleCallAccepted =
    useCallback(
      ({
        targetSocketId,
      }: {
        targetSocketId: string;
      }) => {
        activePeerRef.current =
          targetSocketId;

        setCallStatus(
          "connecting"
        );

        createPeerConnection();

        setTimeout(() => {
          createOffer();
        }, 200);
      },
      [
        createOffer,
        createPeerConnection,
      ]
    );

  // =====================================================
  // CALL REJECTED
  // =====================================================

  const handleCallRejected =
    useCallback(() => {
      alert(
        "Teammate declined the call."
      );

      cleanupCall(false);
    }, []);

  // =====================================================
  // HANDLE OFFER
  // =====================================================

  const handleOffer =
    useCallback(
      async ({
        offer,
        callerSocketId,
      }: {
        offer: RTCSessionDescriptionInit;
        callerSocketId: string;
      }) => {
        try {
          activePeerRef.current =
            callerSocketId;

          // Receiver should already have
          // accepted and enabled microphone.
          if (
            !localAudioTrackRef.current
          ) {
            const started =
              await startMicrophone();

            if (!started) {
              return;
            }
          }

          const peer =
            peerConnectionRef.current ||
            createPeerConnection();

          await peer.setRemoteDescription(
            new RTCSessionDescription(
              offer
            )
          );

          await flushPendingIce();

          const answer =
            await peer.createAnswer();

          await peer.setLocalDescription(
            answer
          );

          socket.emit(
            "webrtc-answer",
            {
              roomId,
              targetSocketId:
                callerSocketId,
              answer,
            }
          );

          setCallStatus(
            "connecting"
          );

          console.log(
            "WebRTC answer sent"
          );
        } catch (
          error
        ) {
          console.error(
            "Offer handling error:",
            error
          );
        }
      },
      [
        createPeerConnection,
        flushPendingIce,
        roomId,
        startMicrophone,
      ]
    );

  // =====================================================
  // HANDLE ANSWER
  // =====================================================

  const handleAnswer =
    useCallback(
      async ({
        answer,
      }: {
        answer: RTCSessionDescriptionInit;
      }) => {
        try {
          const peer =
            peerConnectionRef.current;

          if (!peer) {
            return;
          }

          await peer.setRemoteDescription(
            new RTCSessionDescription(
              answer
            )
          );

          await flushPendingIce();

          console.log(
            "WebRTC answer received"
          );
        } catch (
          error
        ) {
          console.error(
            "Answer error:",
            error
          );
        }
      },
      [flushPendingIce]
    );

  // =====================================================
  // HANDLE ICE
  // =====================================================

  const handleIceCandidate =
    useCallback(
      async ({
        candidate,
      }: {
        candidate: RTCIceCandidateInit;
      }) => {
        try {
          const peer =
            peerConnectionRef.current;

          if (!peer) {
            return;
          }

          if (
            !peer.remoteDescription
          ) {
            pendingIceCandidatesRef.current.push(
              candidate
            );

            return;
          }

          await peer.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );
        } catch (
          error
        ) {
          console.error(
            "ICE error:",
            error
          );
        }
      },
      []
    );

  // =====================================================
  // REMOTE ENDED
  // =====================================================

  const handleRemoteCallEnded =
    useCallback(() => {
      alert(
        "Teammate ended the call."
      );

      cleanupCall(false);
    }, []);

  // =====================================================
  // CLEANUP
  // =====================================================

  const cleanupCall =
    (notifyPeer = true) => {
      const target =
        activePeerRef.current;

      if (
        notifyPeer &&
        target
      ) {
        socket.emit(
          "video-call-ended",
          {
            roomId,
            targetSocketId:
              target,
          }
        );
      }

      // Stop microphone
      localAudioTrackRef.current?.stop();

      // Stop camera
      localVideoTrackRef.current?.stop();

      // Stop screen
      screenStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );

      // Close peer
      peerConnectionRef.current?.close();

      // Clear refs
      localAudioTrackRef.current =
        null;

      localVideoTrackRef.current =
        null;

      localStreamRef.current =
        null;

      screenStreamRef.current =
        null;

      peerConnectionRef.current =
        null;

      audioSenderRef.current =
        null;

      videoSenderRef.current =
        null;

      activePeerRef.current =
        null;

      pendingIceCandidatesRef.current =
        [];

      if (
        localVideoRef.current
      ) {
        localVideoRef.current.srcObject =
          null;
      }

      if (
        remoteVideoRef.current
      ) {
        remoteVideoRef.current.srcObject =
          null;
      }

      setCallStatus(
        "idle"
      );

      setMicOn(false);
      setCameraOn(false);
      setRemoteConnected(false);
      setIncomingCall(
        null
      );
      setIsScreenSharing(
        false
      );
    };

  // =====================================================
  // TOGGLE MIC
  // =====================================================

  const toggleMic =
    () => {
      const track =
        localAudioTrackRef.current;

      if (!track) {
        return;
      }

      track.enabled =
        !track.enabled;

      setMicOn(
        track.enabled
      );
    };

  // =====================================================
  // TOGGLE CAMERA
  // =====================================================

  const toggleCamera =
    async () => {
      if (
        cameraOn
      ) {
        await stopCamera();
        return;
      }

      await startCamera();
    };

  // =====================================================
  // SCREEN SHARE
  // =====================================================

  const toggleScreenShare =
    async () => {
      if (
        !peerConnectionRef.current
      ) {
        return;
      }

      try {
        if (
          isScreenSharing
        ) {
          const cameraTrack =
            localVideoTrackRef.current;

          const sender =
            videoSenderRef.current;

          if (
            sender &&
            cameraTrack
          ) {
            await sender.replaceTrack(
              cameraTrack
            );

            cameraTrack.enabled =
              true;

            setCameraOn(true);
          }

          screenStreamRef.current
            ?.getTracks()
            .forEach((track) =>
              track.stop()
            );

          screenStreamRef.current =
            null;

          setIsScreenSharing(
            false
          );

          attachLocalStream();

          return;
        }

        const stream =
          await navigator.mediaDevices.getDisplayMedia(
            {
              video: true,
              audio: false,
            }
          );

        const screenTrack =
          stream.getVideoTracks()[0];

        if (!screenTrack) {
          return;
        }

        const sender =
          videoSenderRef.current;

        if (sender) {
          await sender.replaceTrack(
            screenTrack
          );
        } else {
          videoSenderRef.current =
            peerConnectionRef.current.addTrack(
              screenTrack,
              stream
            );

          await createOffer();
        }

        if (
          localVideoRef.current
        ) {
          localVideoRef.current.srcObject =
            stream;

          localVideoRef.current
            .play()
            .catch(() => {});
        }

        screenStreamRef.current =
          stream;

        setIsScreenSharing(
          true
        );

        setCameraOn(false);

        screenTrack.onended = () => {
          void toggleScreenShare();
        };
      } catch (
        error
      ) {
        console.error(
          "Screen share failed:",
          error
        );
      }
    };

  // =====================================================
  // SOCKET LISTENERS
  // =====================================================

  useEffect(() => {
    socket.on(
      "incoming-video-call",
      handleIncomingCall
    );

    socket.on(
      "video-call-accepted",
      handleCallAccepted
    );

    socket.on(
      "video-call-rejected",
      handleCallRejected
    );

    socket.on(
      "webrtc-offer",
      handleOffer
    );

    socket.on(
      "webrtc-answer",
      handleAnswer
    );

    socket.on(
      "webrtc-ice-candidate",
      handleIceCandidate
    );

    socket.on(
      "video-call-ended",
      handleRemoteCallEnded
    );

    return () => {
      socket.off(
        "incoming-video-call",
        handleIncomingCall
      );

      socket.off(
        "video-call-accepted",
        handleCallAccepted
      );

      socket.off(
        "video-call-rejected",
        handleCallRejected
      );

      socket.off(
        "webrtc-offer",
        handleOffer
      );

      socket.off(
        "webrtc-answer",
        handleAnswer
      );

      socket.off(
        "webrtc-ice-candidate",
        handleIceCandidate
      );

      socket.off(
        "video-call-ended",
        handleRemoteCallEnded
      );
    };
  }, [
    handleIncomingCall,
    handleCallAccepted,
    handleCallRejected,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    handleRemoteCallEnded,
  ]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="video-meeting">

      {/* HEADER */}

      <div className="video-header">
        <div>
          <h3>
            🎥 Live Collaboration
          </h3>

          <span>
            Room: {roomId}
          </span>
        </div>

        <div className="connection-status">
          <span
            className={
              remoteConnected
                ? "status-dot online"
                : "status-dot"
            }
          />

          {callStatus ===
          "connected"
            ? "Connected"
            : callStatus ===
              "calling"
            ? "Calling..."
            : callStatus ===
              "connecting"
            ? "Connecting..."
            : callStatus ===
              "incoming"
            ? "Incoming call"
            : "Video is off"}
        </div>
      </div>

      {/* VIDEO GRID */}

      <div className="video-grid">

        {/* LOCAL */}

        <div className="video-card local-video">

          {!cameraOn &&
            !isScreenSharing && (
              <div className="video-placeholder">
                <div className="avatar-circle">
                  👤
                </div>

                <h4>
                  Camera is off
                </h4>

                <p>
                  Microphone can still
                  be active
                </p>
              </div>
            )}

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
          />

          {callStatus !==
            "idle" &&
            callStatus !==
              "incoming" && (
              <div className="video-overlay">
                <span className="video-label">
                  You
                </span>

                <span className="video-status">
                  {micOn
                    ? "🎤"
                    : "🔇"}
                </span>
              </div>
            )}

          {isScreenSharing && (
            <div className="sharing-badge">
              🖥️ Sharing screen
            </div>
          )}
        </div>

        {/* REMOTE */}

        <div className="video-card remote-video">

          {!remoteConnected && (
            <div className="video-placeholder">
              <div className="avatar-circle">
                👤
              </div>

              <h4>
                {callStatus ===
                "calling"
                  ? "Calling teammate..."
                  : callStatus ===
                    "connecting"
                  ? "Connecting..."
                  : "No video connection"}
              </h4>

              <p>
                {callStatus ===
                "calling"
                  ? "Waiting for them to accept"
                  : "Camera can be turned on independently"}
              </p>
            </div>
          )}

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
          />

          {remoteConnected && (
            <div className="video-overlay">
              <span className="video-label">
                Teammate
              </span>

              <span className="live-badge">
                ● LIVE
              </span>
            </div>
          )}
        </div>
      </div>

      {/* INCOMING CALL */}

      {incomingCall && (
        <div className="incoming-call-overlay">
          <div className="incoming-call-card">

            <div className="incoming-call-icon">
              📹
            </div>

            <h3>
              Incoming Call
            </h3>

            <p>
              <strong>
                {incomingCall.callerName}
              </strong>{" "}
              is calling you
            </p>

            <div className="incoming-call-actions">

              <button
                className="call-action accept"
                onClick={
                  acceptCall
                }
              >
                📞 Accept
              </button>

              <button
                className="call-action decline"
                onClick={
                  declineCall
                }
              >
                ❌ Decline
              </button>

            </div>
          </div>
        </div>
      )}

      {/* CALL BUTTON */}

      {callStatus ===
        "idle" && (
        <div className="video-join-section">

          <div className="video-join-icon">
            📞
          </div>

          <h4>
            Ready to call?
          </h4>

          <p>
            Your microphone starts
            when the call begins.
            Camera stays off.
          </p>

          <button
            className="join-video-button"
            onClick={
              callTeammate
            }
            disabled={
              cameraLoading
            }
          >
            📞 Call Teammate
          </button>

        </div>
      )}

      {/* CALLING */}

      {callStatus ===
        "calling" && (
        <div className="video-join-section">

          <div className="video-join-icon">
            📞
          </div>

          <h4>
            Calling teammate...
          </h4>

          <p>
            Microphone is on.
            Waiting for them to accept.
          </p>

          <button
            className="cancel-call-button"
            onClick={() =>
              cleanupCall(true)
            }
          >
            ❌ Cancel Call
          </button>

        </div>
      )}

      {/* CONTROLS */}

      {callStatus !==
        "idle" &&
        callStatus !==
          "incoming" && (
        <div className="video-controls">

          {/* MIC */}

          <button
            className={
              micOn
                ? "control-button"
                : "control-button active-off"
            }
            onClick={
              toggleMic
            }
          >
            <span>
              {micOn
                ? "🎤"
                : "🔇"}
            </span>

            <small>
              {micOn
                ? "Mute"
                : "Unmute"}
            </small>
          </button>

          {/* CAMERA */}

          <button
            className={
              cameraOn
                ? "control-button"
                : "control-button active-off"
            }
            onClick={
              toggleCamera
            }
            disabled={
              cameraLoading
            }
          >
            <span>
              {cameraOn
                ? "📹"
                : "📷"}
            </span>

            <small>
              {cameraLoading
                ? "Starting..."
                : cameraOn
                ? "Camera"
                : "Camera Off"}
            </small>
          </button>

          {/* SCREEN SHARE */}

          <button
            className={
              isScreenSharing
                ? "control-button sharing"
                : "control-button"
            }
            onClick={
              toggleScreenShare
            }
          >
            <span>
              {isScreenSharing
                ? "🛑"
                : "🖥️"}
            </span>

            <small>
              {isScreenSharing
                ? "Stop Share"
                : "Share Screen"}
            </small>
          </button>

          {/* END */}

          <button
            className="control-button end-call"
            onClick={() =>
              cleanupCall(true)
            }
          >
            <span>
              📞
            </span>

            <small>
              End Call
            </small>
          </button>

        </div>
      )}

      {/* PRIVACY */}

      {callStatus ===
        "idle" && (
        <p className="video-privacy-note">
          🔒 Camera stays completely off
          until you click Camera.
        </p>
      )}

    </div>
  );
};

export default VideoMeeting;