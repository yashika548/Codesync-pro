import axios from "axios";

const API_URL = "http://localhost:5000/api/code";

const getAuthToken = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  return token;
};

export interface RunCodeRequest {
  code: string;
  language: string;
  stdin?: string;
}

export interface RunCodeResponse {
  status: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  token?: string;
}

export const runCode = async (
  data: RunCodeRequest
): Promise<RunCodeResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/judge/run`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getCodeResult = async (token: string) => {
  const response = await axios.get(`${API_URL}/result/${token}`);

  return response.data;
};

export const submitProblem = async (
  problemSlug: string,
  sourceCode: string,
  languageId: number
) => {
  const token = getAuthToken();

  console.log("SUBMIT TOKEN:", token);

  if (!token) {
    throw new Error(
      "Authentication token not found. Please login again."
    );
  }

  const response = await axios.post(
    `${API_URL}/submit`,
    {
      problemSlug,
      sourceCode,
      languageId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getSubmissionHistory = async (
  problemSlug: string
) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "Authentication token not found. Please login again."
    );
  }

  const response = await axios.get(
    `${API_URL}/submissions/history/${problemSlug}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getSubmissionDetails = async (
  submissionId: string
) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "Authentication token not found. Please login again."
    );
  }

  const response = await axios.get(
    `${API_URL}/submissions/details/${submissionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};