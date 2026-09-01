const { Server } = require("socket.io");
const Message = require("../models/Message");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ==================================================
  // ACTIVE USERS
  // socket.id -> {
  //   userId,
  //   name,
  //   roomId
  // }
  // ==================================================

  const activeUsers = new Map();

  // ==================================================
  // ACTIVE VIDEO CALLS
  //
  // roomId -> {
  //   callerSocketId,
  //   receiverSocketId
  // }
  // ==================================================

  const videoCalls = new Map();

  // ==================================================
  // GET USERS IN ROOM
  // ==================================================

  const getRoomUsers = (roomId) => {
    const roomUsers = [];

    for (const [
      socketId,
      currentUser,
    ] of activeUsers.entries()) {
      if (
        currentUser.roomId === roomId
      ) {
        roomUsers.push({
          socketId,
          userId: currentUser.userId,
          name: currentUser.name,
        });
      }
    }

    return roomUsers;
  };

  // ==================================================
  // FIND OTHER USER IN ROOM
  // ==================================================

  const getOtherUserInRoom = (
    roomId,
    currentSocketId
  ) => {
    const users =
      getRoomUsers(roomId);

    return users.find(
      (user) =>
        user.socketId !==
        currentSocketId
    );
  };

  // ==================================================
  // SOCKET CONNECTION
  // ==================================================

  io.on(
    "connection",
    (socket) => {
      console.log(
        "User connected:",
        socket.id
      );

      // ==================================================
      // CODE COLLABORATION
      // ==================================================

      socket.on(
        "code-change",
        ({
          roomId,
          code,
        }) => {
          if (!roomId) {
            return;
          }

          console.log(
            `Code changed in room ${roomId}`
          );

          // Send to everyone except sender.
          socket
            .to(roomId)
            .emit(
              "code-change",
              code
            );
        }
      );

      // ==================================================
      // LANGUAGE COLLABORATION
      // ==================================================

      socket.on(
        "language-change",
        ({
          roomId,
          language,
        }) => {
          if (!roomId) {
            return;
          }

          console.log(
            `Language changed in room ${roomId}: ${language}`
          );

          socket
            .to(roomId)
            .emit(
              "language-change",
              language
            );
        }
      );

      // ==================================================
      // EDITOR TYPING
      // ==================================================

      socket.on(
        "typing",
        ({
          roomId,
          userId,
          name,
        }) => {
          if (!roomId) {
            return;
          }

          socket
            .to(roomId)
            .emit(
              "typing",
              {
                userId,
                name,
              }
            );
        }
      );

      // ==================================================
      // STOP EDITOR TYPING
      // ==================================================

      socket.on(
        "stop-typing",
        ({
          roomId,
          userId,
        }) => {
          if (!roomId) {
            return;
          }

          socket
            .to(roomId)
            .emit(
              "stop-typing",
              {
                userId,
              }
            );
        }
      );

      // ==================================================
      // CHAT TYPING
      // ==================================================

      socket.on(
        "chat-typing",
        ({
          roomId,
          userId,
          name,
        }) => {
          if (!roomId) {
            return;
          }

          socket
            .to(roomId)
            .emit(
              "typing",
              {
                userId,
                name,
              }
            );
        }
      );

      // ==================================================
      // CHAT MESSAGE
      // ==================================================

      socket.on(
        "send-message",
        async ({
          roomId,
          senderId,
          senderName,
          message,
        }) => {
          try {
            if (
              !roomId ||
              !senderId ||
              !senderName ||
              !message ||
              !message.trim()
            ) {
              return;
            }

            // Make sure sender is actually
            // inside this room.
            const sender =
              activeUsers.get(
                socket.id
              );

            if (
              !sender ||
              sender.roomId !== roomId
            ) {
              console.warn(
                "Rejected chat message from user not in room:",
                socket.id
              );

              return;
            }

            const newMessage =
              await Message.create({
                roomId,
                senderId,
                senderName,
                message:
                  message.trim(),
              });

            console.log(
              `Message sent in room ${roomId} by ${senderName}`
            );

            // Send saved message to everyone
            // in the room, INCLUDING sender.
            io.to(roomId).emit(
              "receive-message",
              newMessage
            );
          } catch (error) {
            console.error(
              "Failed to send chat message:",
              error
            );

            socket.emit(
              "chat-error",
              {
                message:
                  "Failed to send message.",
              }
            );
          }
        }
      );

      // ==================================================
      // JOIN ROOM
      // ==================================================

      socket.on(
        "join-room",
        ({
          roomId,
          userId,
          name,
        }) => {
          if (
            !roomId ||
            !userId ||
            !name
          ) {
            return;
          }

          const previousUser =
            activeUsers.get(
              socket.id
            );

          // ----------------------------------------------
          // LEAVE PREVIOUS ROOM
          // ----------------------------------------------

          if (
            previousUser &&
            previousUser.roomId !==
              roomId
          ) {
            const previousRoomId =
              previousUser.roomId;

            // --------------------------------------------
            // END VIDEO CALL IN OLD ROOM
            // --------------------------------------------

            const existingCall =
              videoCalls.get(
                previousRoomId
              );

            if (
              existingCall
            ) {
              const otherSocketId =
                existingCall.callerSocketId ===
                socket.id
                  ? existingCall.receiverSocketId
                  : existingCall.callerSocketId;

              if (
                otherSocketId
              ) {
                io.to(
                  otherSocketId
                ).emit(
                  "video-call-ended"
                );
              }

              videoCalls.delete(
                previousRoomId
              );
            }

            // --------------------------------------------
            // LEAVE OLD SOCKET ROOM
            // --------------------------------------------

            socket.leave(
              previousRoomId
            );

            activeUsers.delete(
              socket.id
            );

            // --------------------------------------------
            // UPDATE OLD ROOM USERS
            // --------------------------------------------

            const previousRoomUsers =
              getRoomUsers(
                previousRoomId
              );

            io.to(
              previousRoomId
            ).emit(
              "active-users",
              previousRoomUsers
            );

            // --------------------------------------------
            // NOTIFY OLD ROOM
            // --------------------------------------------

            socket
              .to(previousRoomId)
              .emit(
                "user-left",
                {
                  userId:
                    previousUser.userId,

                  name:
                    previousUser.name,
                }
              );

            console.log(
              `${previousUser.name} left room ${previousRoomId}`
            );
          }

          // ----------------------------------------------
          // JOIN NEW ROOM
          // ----------------------------------------------

          socket.join(
            roomId
          );

          activeUsers.set(
            socket.id,
            {
              userId,
              name,
              roomId,
            }
          );

          console.log(
            `${name} joined room ${roomId}`
          );

          // ----------------------------------------------
          // NOTIFY EXISTING USERS
          // ----------------------------------------------

          socket
            .to(roomId)
            .emit(
              "user-joined",
              {
                userId,
                name,
              }
            );

          // ----------------------------------------------
          // UPDATED ACTIVE USERS
          // ----------------------------------------------

          const roomUsers =
            getRoomUsers(
              roomId
            );

          io.to(roomId).emit(
            "active-users",
            roomUsers
          );
        }
      );

      // ==================================================
      // VIDEO CALL REQUEST
      // ==================================================

      socket.on(
        "video-call-request",
        ({ roomId }) => {
          const caller =
            activeUsers.get(
              socket.id
            );

          if (
            !caller ||
            caller.roomId !== roomId
          ) {
            return;
          }

          const targetUser =
            getOtherUserInRoom(
              roomId,
              socket.id
            );

          // No teammate.
          if (
            !targetUser
          ) {
            socket.emit(
              "video-call-rejected"
            );

            return;
          }

          // Another call already exists.
          if (
            videoCalls.has(
              roomId
            )
          ) {
            socket.emit(
              "video-call-rejected"
            );

            return;
          }

          videoCalls.set(
            roomId,
            {
              callerSocketId:
                socket.id,

              receiverSocketId:
                targetUser.socketId,
            }
          );

          console.log(
            `Video call request: ${caller.name} -> ${targetUser.name}`
          );

          io.to(
            targetUser.socketId
          ).emit(
            "incoming-video-call",
            {
              callerSocketId:
                socket.id,

              callerName:
                caller.name ||
                "Teammate",
            }
          );
        }
      );

      // ==================================================
      // ACCEPT VIDEO CALL
      // ==================================================

      socket.on(
        "video-call-accepted",
        ({
          roomId,
          callerSocketId,
        }) => {
          const call =
            videoCalls.get(
              roomId
            );

          if (!call) {
            return;
          }

          if (
            call.callerSocketId !==
            callerSocketId
          ) {
            return;
          }

          if (
            call.receiverSocketId !==
            socket.id
          ) {
            return;
          }

          console.log(
            `Video call accepted: ${callerSocketId} <-> ${socket.id}`
          );

          io.to(
            callerSocketId
          ).emit(
            "video-call-accepted",
            {
              targetSocketId:
                socket.id,
            }
          );
        }
      );

      // ==================================================
      // REJECT VIDEO CALL
      // ==================================================

      socket.on(
        "video-call-rejected",
        ({
          roomId,
          callerSocketId,
        }) => {
          const call =
            videoCalls.get(
              roomId
            );

          if (
            call &&
            call.receiverSocketId !==
              socket.id
          ) {
            return;
          }

          if (
            callerSocketId
          ) {
            io.to(
              callerSocketId
            ).emit(
              "video-call-rejected"
            );
          }

          videoCalls.delete(
            roomId
          );

          console.log(
            `Video call rejected in room ${roomId}`
          );
        }
      );

      // ==================================================
      // WEBRTC OFFER
      // ==================================================

      socket.on(
        "webrtc-offer",
        ({
          roomId,
          targetSocketId,
          offer,
        }) => {
          if (
            !targetSocketId ||
            !offer
          ) {
            return;
          }

          const call =
            videoCalls.get(
              roomId
            );

          if (!call) {
            return;
          }

          // Only caller creates initial offer.
          if (
            call.callerSocketId !==
            socket.id
          ) {
            return;
          }

          console.log(
            `WebRTC offer: ${socket.id} -> ${targetSocketId}`
          );

          io.to(
            targetSocketId
          ).emit(
            "webrtc-offer",
            {
              offer,

              callerSocketId:
                socket.id,
            }
          );
        }
      );

      // ==================================================
      // WEBRTC ANSWER
      // ==================================================

      socket.on(
        "webrtc-answer",
        ({
          roomId,
          targetSocketId,
          answer,
        }) => {
          if (
            !targetSocketId ||
            !answer
          ) {
            return;
          }

          const call =
            videoCalls.get(
              roomId
            );

          if (!call) {
            return;
          }

          // Only receiver sends answer.
          if (
            call.receiverSocketId !==
            socket.id
          ) {
            return;
          }

          console.log(
            `WebRTC answer: ${socket.id} -> ${targetSocketId}`
          );

          io.to(
            targetSocketId
          ).emit(
            "webrtc-answer",
            {
              answer,

              answererSocketId:
                socket.id,
            }
          );
        }
      );

      // ==================================================
      // WEBRTC ICE CANDIDATE
      // ==================================================

      socket.on(
        "webrtc-ice-candidate",
        ({
          roomId,
          targetSocketId,
          candidate,
        }) => {
          if (
            !targetSocketId ||
            !candidate
          ) {
            return;
          }

          const call =
            videoCalls.get(
              roomId
            );

          if (!call) {
            return;
          }

          const isCaller =
            call.callerSocketId ===
            socket.id;

          const isReceiver =
            call.receiverSocketId ===
            socket.id;

          if (
            !isCaller &&
            !isReceiver
          ) {
            return;
          }

          io.to(
            targetSocketId
          ).emit(
            "webrtc-ice-candidate",
            {
              candidate,

              fromSocketId:
                socket.id,
            }
          );
        }
      );

      // ==================================================
      // END VIDEO CALL
      // ==================================================

      socket.on(
        "video-call-ended",
        ({
          roomId,
          targetSocketId,
        }) => {
          const call =
            videoCalls.get(
              roomId
            );

          if (!call) {
            return;
          }

          const isCaller =
            call.callerSocketId ===
            socket.id;

          const isReceiver =
            call.receiverSocketId ===
            socket.id;

          if (
            !isCaller &&
            !isReceiver
          ) {
            return;
          }

          const target =
            targetSocketId ||
            (isCaller
              ? call.receiverSocketId
              : call.callerSocketId);

          if (
            target
          ) {
            io.to(
              target
            ).emit(
              "video-call-ended"
            );
          }

          videoCalls.delete(
            roomId
          );

          console.log(
            `Video call ended in room ${roomId}`
          );
        }
      );

      // ==================================================
      // DISCONNECT
      // ==================================================

      socket.on(
        "disconnect",
        () => {
          const user =
            activeUsers.get(
              socket.id
            );

          // ----------------------------------------------
          // CLEAN VIDEO CALL
          // ----------------------------------------------

          for (const [
            roomId,
            call,
          ] of videoCalls.entries()) {
            if (
              call.callerSocketId ===
                socket.id ||
              call.receiverSocketId ===
                socket.id
            ) {
              const otherSocketId =
                call.callerSocketId ===
                socket.id
                  ? call.receiverSocketId
                  : call.callerSocketId;

              if (
                otherSocketId
              ) {
                io.to(
                  otherSocketId
                ).emit(
                  "video-call-ended"
                );
              }

              videoCalls.delete(
                roomId
              );
            }
          }

          // ----------------------------------------------
          // UNKNOWN SOCKET
          // ----------------------------------------------

          if (!user) {
            console.log(
              "Unknown socket disconnected:",
              socket.id
            );

            return;
          }

          // ----------------------------------------------
          // REMOVE ACTIVE USER
          // ----------------------------------------------

          activeUsers.delete(
            socket.id
          );

          // ----------------------------------------------
          // UPDATE ACTIVE USERS
          // ----------------------------------------------

          const roomUsers =
            getRoomUsers(
              user.roomId
            );

          io.to(
            user.roomId
          ).emit(
            "active-users",
            roomUsers
          );

          // ----------------------------------------------
          // NOTIFY ROOM
          // ----------------------------------------------

          socket
            .to(user.roomId)
            .emit(
              "user-left",
              {
                userId:
                  user.userId,

                name:
                  user.name,
              }
            );

          console.log(
            `${user.name} disconnected from room ${user.roomId}`
          );
        }
      );
    }
  );
};

module.exports =
  initializeSocket;