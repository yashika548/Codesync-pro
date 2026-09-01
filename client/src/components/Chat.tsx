import {
  useEffect,
  useRef,
  useState,
} from "react";

import socket from "../services/socket";
import { getRoomMessages } from "../services/messageService";

import "./Chat.css";

interface Message {
  _id?: string;
  roomId?: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt?: string;
}

interface ChatProps {
  roomId: string;
  userId: string;
  userName: string;
}

const Chat = ({
  roomId,
  userId,
  userName,
}: ChatProps) => {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [message, setMessage] =
    useState("");

  const [typingUser, setTypingUser] =
    useState<string | null>(null);

  const chatEndRef =
    useRef<HTMLDivElement | null>(null);

  const typingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  // =====================================================
  // LOAD MESSAGES + SOCKET LISTENERS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      try {
        const data =
          await getRoomMessages(roomId);

        if (mounted) {
          setMessages(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load messages:",
          error
        );
      }
    };

    loadMessages();

    // ---------------------------------------------------
    // RECEIVE MESSAGE
    // ---------------------------------------------------

    const handleReceiveMessage = (
      newMessage: Message
    ) => {
      console.log(
        "Received message:",
        newMessage
      );

      setMessages((prev) => {
        // Prevent accidental duplicate messages
        if (
          newMessage._id &&
          prev.some(
            (item) =>
              item._id ===
              newMessage._id
          )
        ) {
          return prev;
        }

        return [
          ...prev,
          newMessage,
        ];
      });
    };

    // ---------------------------------------------------
    // TYPING
    // ---------------------------------------------------

    const handleTyping = (data: {
      userId: string;
      name: string;
    }) => {
      // Don't show our own typing.
      if (
        data.userId === userId
      ) {
        return;
      }

      setTypingUser(
        data.name
      );

      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }

      typingTimeoutRef.current =
        setTimeout(() => {
          setTypingUser(null);
        }, 1500);
    };

    socket.on(
      "receive-message",
      handleReceiveMessage
    );

    socket.on(
      "typing",
      handleTyping
    );

    return () => {
      mounted = false;

      socket.off(
        "receive-message",
        handleReceiveMessage
      );

      socket.off(
        "typing",
        handleTyping
      );

      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }
    };
  }, [roomId, userId]);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSendMessage = () => {
    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!socket.connected) {
      console.log(
        "Socket is not connected"
      );
      return;
    }

    const newMessage = {
      roomId,
      senderId: userId,
      senderName: userName,
      message:
        trimmedMessage,
    };

    console.log(
      "Sending message:",
      newMessage
    );

    socket.emit(
      "send-message",
      newMessage
    );

    setMessage("");
    setTypingUser(null);

    if (
      typingTimeoutRef.current
    ) {
      clearTimeout(
        typingTimeoutRef.current
      );

      typingTimeoutRef.current =
        null;
    }
  };

  // =====================================================
  // TYPING
  // =====================================================

  const handleMessageChange = (
    value: string
  ) => {
    setMessage(value);

    if (
      !socket.connected
    ) {
      return;
    }

    if (
      value.trim()
    ) {
      socket.emit(
        "chat-typing",
        {
          roomId,
          userId,
          name: userName,
        }
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="chat">

      {/* HEADER */}

      <div className="chat-header">
        <h3>
          Room Chat
        </h3>

        <span>
          Live
        </span>
      </div>

      {/* MESSAGES */}

      <div className="chat-messages">

        {messages.length ===
        0 ? (
          <div className="chat-empty">
            <p>
              No messages yet
            </p>

            <span>
              Start the conversation 👋
            </span>
          </div>
        ) : (
          messages.map(
            (
              msg,
              index
            ) => {
              const isOwnMessage =
                msg.senderId ===
                userId;

              return (
                <div
                  key={
                    msg._id ||
                    `${msg.senderId}-${msg.createdAt}-${index}`
                  }
                  className={`message-row ${
                    isOwnMessage
                      ? "message-own"
                      : "message-other"
                  }`}
                >
                  <div className="message-bubble">

                    {!isOwnMessage && (
                      <div className="message-sender">
                        {
                          msg.senderName
                        }
                      </div>
                    )}

                    <div className="message-text">
                      {
                        msg.message
                      }
                    </div>

                    {msg.createdAt && (
                      <div className="message-time">
                        {new Date(
                          msg.createdAt
                        ).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            }
          )
        )}

        <div
          ref={
            chatEndRef
          }
        />

      </div>

      {/* TYPING */}

      {typingUser && (
        <div className="chat-typing-indicator">

          <strong>
            {typingUser}
          </strong>{" "}
          is typing

          <span className="typing-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>

        </div>
      )}

      {/* INPUT */}

      <div className="chat-input">

        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) =>
            handleMessageChange(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              e.preventDefault();

              handleSendMessage();
            }
          }}
        />

        <button
          onClick={
            handleSendMessage
          }
          disabled={
            !message.trim()
          }
        >
          Send
        </button>

      </div>

    </div>
  );
};

export default Chat;