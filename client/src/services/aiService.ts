import api from "./api";

export interface AskAIRequest {
  code: string;
  language: string;
  question: string;
  problem?: string;
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
  }[];
}

export interface AskAIResponse {
  response: string;
  context?: string;
}

export interface RAGSearchRequest {
  query: string;
  conversationId?: string;

  code: string;
  language: string;
  problem?: string;
  constraints?: string[];

  examples?: {
    input: string;
    output: string;
  }[];
}

export interface RAGSearchResponse {
  query: string;
  conversationId: string | null;
  response: string;
  results: {
    _id?: string;
    title: string;
    content: string;
    category?: string;
    source?: string;
    score?: number;
    metadata?: any;
  }[];
  context?: string;
}

// =====================================================
// NORMAL AI
// =====================================================

export const askAI = async (
  data: AskAIRequest
): Promise<AskAIResponse> => {
  const response = await api.post(
    "/ai/ask",
    data
  );

  return response.data;
};

// =====================================================
// RAG AI
// =====================================================

export const searchRAG = async (
  data: RAGSearchRequest
): Promise<RAGSearchResponse> => {
  const response = await api.post(
    "/ai/rag/search",
    data
  );

  return response.data;
};

// =====================================================
// RAG SOURCE
// =====================================================

export interface RAGSource {
  _id?: string;
  title: string;
  content: string;
  category?: string;
  source?: string;
  score?: number;
  metadata?: any;
}

// =====================================================
// AI AGENT
// =====================================================

export interface AgentResponse {
  success: boolean;

  question: string;

  conversationId: string | null;

  intent: string;

  plan: {
    intent: string;
    tools: string[];
  };

  toolResults: {
    tool: string;
    result: any;
  }[];

  ragSources: RAGSource[];

  ragContext?: string;

  response: string;
}

export const runAgent = async ({
  question,
  conversationId,
  code,
  language,
  problem,
  constraints = [],
  examples = [],
}: {
  question: string;
  conversationId?: string;
  code: string;
  language: string;
  problem: string;
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
  }[];
}): Promise<AgentResponse> => {
  const response = await api.post(
    "/ai/agent/run",
    {
      question,
      conversationId,
      code,
      language,
      problem,
      constraints,
      examples,
    }
  );

  return response.data;
};

// =====================================================
// AI CONVERSATION MESSAGE
// =====================================================

export interface AIConversationMessage {
  _id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

// =====================================================
// GET AI CONVERSATION MESSAGES
// =====================================================

export const getAIConversation = async (
  conversationId: string
): Promise<AIConversationMessage[]> => {
  const response = await api.get(
    `/ai/conversation/${conversationId}`
  );

  return response.data.messages;
};

// =====================================================
// AI CONVERSATIONS
// =====================================================

export interface AIConversation {
  _id: string;
  userId: string;
  title: string;
  problemId?: string | null;
  problemTitle?: string | null;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// CREATE CONVERSATION
// =====================================================

export const createAIConversation = async ({
  title = "New AI Conversation",
  problemId = null,
  problemTitle = null,
}: {
  title?: string;
  problemId?: string | null;
  problemTitle?: string | null;
}): Promise<AIConversation> => {
  const response = await api.post(
    "/ai/conversations",
    {
      title,
      problemId,
      problemTitle,
    }
  );

  return response.data.conversation;
};

// =====================================================
// GET USER CONVERSATIONS
// =====================================================

export const getAIConversations =
  async (): Promise<AIConversation[]> => {
    const response = await api.get(
      "/ai/conversations"
    );

    return response.data.conversations;
  };

// =====================================================
// GET SINGLE CONVERSATION
// =====================================================

export const getAIConversationDetails =
  async (
    conversationId: string
  ): Promise<AIConversation> => {
    const response = await api.get(
      `/ai/conversations/${conversationId}`
    );

    return response.data.conversation;
  };

// =====================================================
// DELETE CONVERSATION
// =====================================================

export const deleteAIConversation =
  async (
    conversationId: string
  ): Promise<void> => {
    await api.delete(
      `/ai/conversations/${conversationId}`
    );
  };