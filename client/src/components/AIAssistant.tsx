import { useState,useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { runAgent,
  getAIConversation,
  createAIConversation,
  getAIConversations,
  deleteAIConversation
 } from "../services/aiService";
import "./AIAssistant.css";
import type {
  AIConversation,
} from "../services/aiService";

interface AIAssistantProps {
  code: string;
  language: string;
  problem: string;
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
  }[];
}

interface AIMessage {
  role: "user" | "assistant";
  content: string;
  createdAt?:string;
  
}

interface RAGSource {
  _id?: string;
  title: string;
  content: string;
  category?: string;
  source?: string;
  score?: number;
  metadata?: any;
}


const AIAssistant = ({
  code,
  language,
  problem,
  constraints = [],
  examples = [],
}: AIAssistantProps) => {
  const [question, setQuestion] = useState("");

const [messages, setMessages] = useState<
  AIMessage[]
>([]);

const [lastQuestion, setLastQuestion] =
  useState("");

const [loading, setLoading] =
  useState(false);

const [error, setError] =
  useState("");

  const [conversationId, setConversationId] =
  useState<string | null>(null);

  const [ragSources, setRagSources] = useState<
  RAGSource[]
>([]);

const conversationEndRef =
  useRef<HTMLDivElement | null>(null);

  const [conversations, setConversations] =
  useState<AIConversation[]>([]);

const [loadingConversations, setLoadingConversations] =
  useState(false);




  const startNewConversation = async () => {
  try {
    setLoading(true);
    setError("");

    const conversation =
      await createAIConversation({
        title: problem
          ? `${problem} — AI Discussion`
          : "New AI Conversation",

        problemTitle:
          problem || null,
      });

    setConversationId(
      conversation._id
    );

    setMessages([]);
    setRagSources([]);
    setQuestion("");
    setLastQuestion("");

    setConversations((previous) => [
  conversation,
  ...previous.filter(
    (item) =>
      item._id !== conversation._id
  ),
]);

  } catch (error: any) {
    console.error(
      "Failed to create conversation:",
      error
    );

    setError(
      error?.response?.data?.message ||
      "Unable to create new AI conversation."
    );
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
  const loadConversation = async () => {
    if (!conversationId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const history =
        await getAIConversation(
          conversationId
        );

      setMessages(
  history.map((message) => ({
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
  }))
);

    } catch (error: any) {
      console.error(
        "Failed to load AI conversation:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to load conversation history.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  loadConversation();
}, [conversationId]);

useEffect(() => {
  conversationEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, loading]);

useEffect(() => {

   // Reset AI UI when problem changes
  setMessages([]);
  setRagSources([]);
  setQuestion("");
  setLastQuestion("");
  setConversationId(null);

  
  const initializeConversation = async () => {
    try {
      setLoading(true);
      setError("");
      setLoadingConversations(true);

      // Load conversations
      const data = await getAIConversations();

      setConversations(data);

      // Find conversation belonging to current problem
      const existingConversation = data.find(
        (conversation) =>
          conversation.problemTitle === problem
      );

      if (existingConversation) {
        setConversationId(existingConversation._id);
        return;
      }

      // No conversation for this problem
      // Create a new one
      const conversation =
        await createAIConversation({
          title: problem
            ? `${problem} — AI Discussion`
            : "New AI Conversation",

          problemTitle: problem || null,
        });

      setConversationId(conversation._id);

      setConversations((previous) => [
        conversation,
        ...previous,
      ]);

    } catch (error: any) {
      console.error(
        "Failed to initialize AI conversation:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Unable to initialize AI conversation."
      );
    } finally {
      setLoadingConversations(false);
      setLoading(false);
    }
  };

  initializeConversation();
}, [problem]);


const handleSelectConversation = async (
  id: string
) => {
  if (id === conversationId) {
    return;
  }

  setConversationId(id);
  setRagSources([]);
  setError("");
};


const handleDeleteConversation = async (
  id: string
) => {
  try {
    await deleteAIConversation(id);

    setConversations((previous) =>
      previous.filter(
        (conversation) =>
          conversation._id !== id
      )
    );

    if (id === conversationId) {
      await startNewConversation();
    }

  } catch (error: any) {
    console.error(
      "Failed to delete conversation:",
      error
    );

    setError(
      error?.response?.data?.message ||
      "Unable to delete conversation."
    );
  }
};

 const ask = async (
  presetQuestion?: string
) => {
  const finalQuestion =
    presetQuestion || question.trim();

  if (!finalQuestion) {
    return;
  }

  // Active conversation
  let activeConversationId =
    conversationId;

  try {
    setLoading(true);
    setError("");

    // ============================================
    // CREATE CONVERSATION IF NONE EXISTS
    // ============================================

    if (!activeConversationId) {
      const conversation =
        await createAIConversation({
          title: problem
            ? `${problem} — AI Discussion`
            : "New AI Conversation",

          problemTitle:
            problem || null,
        });

      activeConversationId =
        conversation._id;

      setConversationId(
        conversation._id
      );

      setConversations((previous) => [
        conversation,
        ...previous.filter(
          (item) =>
            item._id !== conversation._id
        ),
      ]);
    }

    // ============================================
    // SAVE LAST QUESTION
    // ============================================

    setLastQuestion(finalQuestion);

    // ============================================
    // SHOW USER MESSAGE IMMEDIATELY
    // ============================================

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: finalQuestion,
        createdAt:
          new Date().toISOString(),
      },
    ]);

    // ============================================
    // RAG REQUEST
    // ============================================

   const result = await runAgent({
  question: finalQuestion,

  conversationId:
    activeConversationId || undefined,

  code,
  language,
  problem,
  constraints,
  examples,
});

    // ============================================
    // UPDATE RAG SOURCES
    // ============================================

    setRagSources(result.ragSources || []); 

    // ============================================
    // ADD AI RESPONSE
    // ============================================

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        content:
          result.response || "",
        createdAt:
          new Date().toISOString(),
      },
    ]);

    // ============================================
    // UPDATE CONVERSATION ID
    // ============================================

    if (result.conversationId) {
  setConversationId(
    result.conversationId
  );

  setConversations((previous) => {
    const current = previous.find(
      (conversation) =>
        conversation._id === result.conversationId
    );

    if (!current) {
      return previous;
    }

    return [
      {
        ...current,
        updatedAt: new Date().toISOString(),
      },
      ...previous.filter(
        (conversation) =>
          conversation._id !== result.conversationId
      ),
    ];
  });
}

    

    // ============================================
    // CLEAR INPUT
    // ============================================

    setQuestion("");

  } catch (error: any) {

    console.error(
      "AI Assistant Error:",
      error
    );

    const message =
      error?.response?.data?.message ||
      "Unable to get AI response.";

    setError(message);

  } finally {
    setLoading(false);
  }
};

  const handleRegenerate = () => {
    if (!lastQuestion) return;

    ask(lastQuestion);
  };

  const handleCopy = async () => {
  const lastAssistantMessage =
    [...messages]
      .reverse()
      .find(
        (message) =>
          message.role === "assistant"
      );

  if (!lastAssistantMessage) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      lastAssistantMessage.content
    );
  } catch (error) {
    console.error(
      "Failed to copy AI response:",
      error
    );
  }
};

  return (
    <div className="ai-assistant">

      {/* Header */}
      <div className="ai-assistant-header">

        <div className="ai-title-wrapper">

          <div className="ai-icon">
            🤖
          </div>

          <div>
  <div className="ai-title-row">
    <h3>CodeSync AI</h3>

    {ragSources.length > 0 && (
      <span className="ai-rag-badge">
        📚 RAG
      </span>
    )}
  </div>

  <p>
    Your intelligent coding assistant
  </p>
</div>

        </div>

        { !loading && (
          <div className="ai-header-actions">

  <button
    type="button"
    onClick={handleCopy}
  >
    Copy
  </button>

  <button
    type="button"
    onClick={handleRegenerate}
  >
    ↻ Regenerate
  </button>

  <button
  type="button"
  onClick={startNewConversation}
  disabled={loading}
>
  + New Chat
</button>

</div>
        )}

      </div>


      {/* Conversation History */}
<div className="ai-conversations">

  <div className="ai-conversations-header">

    <div>
      <h4>Conversations</h4>
      <p>Your previous AI chats</p>
    </div>

    <button
      type="button"
      className="ai-new-conversation-button"
      onClick={startNewConversation}
      disabled={loading}
    >
      + New
    </button>

  </div>

  <div className="ai-conversation-list">

    {loadingConversations ? (

      <div className="ai-conversations-loading">
        <div className="ai-conversation-skeleton"></div>
        <div className="ai-conversation-skeleton"></div>
        <div className="ai-conversation-skeleton"></div>
      </div>

    ) : conversations.length === 0 ? (

      <div className="ai-conversations-empty">

        <div className="ai-conversations-empty-icon">
          💬
        </div>

        <strong>
          No conversations yet
        </strong>

        <span>
          Start a new AI discussion.
        </span>

      </div>

    ) : (

      conversations.map((conversation) => (

        <div
          key={conversation._id}
          className={`ai-conversation-item ${
            conversation._id === conversationId
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleSelectConversation(
              conversation._id
            )
          }
        >

          <div className="ai-conversation-icon">
            🤖
          </div>

          <div className="ai-conversation-info">

            <strong>
              {conversation.title}
            </strong>

            {conversation.problemTitle && (
              <span>
                {conversation.problemTitle}
              </span>
            )}

          </div>

          <button
            type="button"
            className="ai-conversation-delete"
            title="Delete conversation"
            onClick={(event) => {

              event.stopPropagation();

              handleDeleteConversation(
                conversation._id
              );

            }}
          >
            🗑
          </button>

        </div>

      ))

    )}

  </div>

</div>

      {/* Quick Actions */}
      <div className="ai-actions">

        <button
          type="button"
          onClick={() =>
            ask(
              "Explain my code step by step."
            )
          }
          disabled={loading}
        >
          Explain Code
        </button>

        <button
          type="button"
          onClick={() =>
            ask(
              "Find bugs or logical issues in my code."
            )
          }
          disabled={loading}
        >
          Find Bugs
        </button>

        <button
          type="button"
          onClick={() =>
            ask(
              "Give me a helpful hint without giving me the complete solution."
            )
          }
          disabled={loading}
        >
          Give Hint
        </button>

        <button
          type="button"
          onClick={() =>
            ask(
              "Analyze the time and space complexity of my solution."
            )
          }
          disabled={loading}
        >
          Complexity
        </button>

        <button
          type="button"
          onClick={() =>
            ask(
              "Suggest ways to optimize my current solution."
            )
          }
          disabled={loading}
        >
          Optimize
        </button>

      </div>

      {/* Question */}
      <div className="ai-question">

        <textarea
          placeholder="Ask CodeSync AI anything about your code..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          disabled={loading}
        />

        <button
          type="button"
          onClick={() => ask()}
          disabled={
            loading ||
            !question.trim()
          }
        >
          {loading
            ? "Thinking..."
            : "Ask AI"}
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="ai-error">

          <div className="ai-error-icon">
            ⚠
          </div>

          <div>
            <strong>
              AI request failed
            </strong>

            <p>
              {error}
            </p>
          </div>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="ai-loading">

          <div className="ai-loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <span>
            CodeSync AI is analyzing your code...
          </span>

        </div>
      )}

      {/* Response */}
      {/* Conversation */}
{messages.length > 0 && (
  <div className="ai-conversation">

    {messages.map(
      (message, index) => (
        <div
          key={index}
          className={`ai-message ${
            message.role === "user"
              ? "ai-message-user"
              : "ai-message-assistant"
          }`}
        >

          <div className="ai-message-header">

            <span className="ai-message-icon">
              {message.role === "user"
                ? "👤"
                : "🤖"}
            </span>

            <span>
              {message.role === "user"
                ? "You"
                : "CodeSync AI"}
            </span>


            {message.createdAt && (
  <span className="ai-message-time">
    {new Date(
      message.createdAt
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </span>
)}

          </div>

          <div className="ai-message-content">

            {message.role ===
            "assistant" ? (
              <ReactMarkdown
                remarkPlugins={[
                  remarkGfm,
                ]}
                components={{
                  pre: ({
                    children,
                  }) => (
                    <pre className="ai-code-block">
                      {children}
                    </pre>
                  ),

                  code: ({
                    children,
                    className,
                  }) => (
                    <code
                      className={
                        className ||
                        "ai-inline-code"
                      }
                    >
                      {children}
                    </code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p>
                {message.content}
              </p>
            )}

          </div>

        </div>
      )
    )}
    <div ref={conversationEndRef} />

  </div>
)}



{/* RAG Sources */}

{ragSources.length > 0 && (
  <div className="ai-rag-sources">

    <div className="ai-rag-sources-header">
      <div>
        <span>📚</span>
        <strong>Knowledge Sources</strong>
      </div>

      <span>
        {ragSources.length} sources
      </span>
    </div>

    <div className="ai-rag-source-list">

      {ragSources.map(
        (source, index) => (
          <div
            key={
              source._id ||
              `${source.title}-${index}`
            }
            className="ai-rag-source"
          >

            <div className="ai-rag-source-number">
              {index + 1}
            </div>

            <div className="ai-rag-source-content">

              <h4>
                {source.title}
              </h4>

              {source.category && (
                <span className="ai-rag-category">
                  {source.category}
                </span>
              )}

              <p>
                {source.content}
              </p>

              {typeof source.score ===
                "number" && (
                <div className="ai-rag-score">
                  Relevance:{" "}
                  {(
                    source.score * 100
                  ).toFixed(1)}
                  %
                </div>
              )}

            </div>

          </div>
        )
      )}

    </div>

  </div>
)}

      {/* Empty State */}
      {!messages.length &&
        !loading &&
        !error && (
          <div className="ai-empty">

            <div className="ai-empty-icon">
              ✨
            </div>

            <h4>
              Ask CodeSync AI
            </h4>

            <p>
              Get hints, explanations,
              debugging help and complexity
              analysis for your solution.
            </p>

          </div>
        )}

    </div>
  );
};

export default AIAssistant;