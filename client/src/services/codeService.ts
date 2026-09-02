import api from "./api";

const getAuthToken = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  return token;
};

export interface RunCodeRequest {
  sourceCode: string;
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
  const response = await api.post(
    "/code/run",
    data
  );

  return response.data;
};

export const getCodeResult = async (token: string) => {
  const response = await api.get(
    `/code/result/${token}`
  );

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

  const response = await api.post(
    "/code/submit",
    {
      problemSlug,
      sourceCode,
      languageId,
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

  const response = await api.get(
    `/code/submissions/history/${problemSlug}`
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

  const response = await api.get(
    `/code/submissions/details/${submissionId}`
  );

  return response.data;
};
