const axios = require("axios");

const JUDGE0_URL = "https://ce.judge0.com";

const submitCode = async ({ sourceCode, languageId, stdin = "" }) => {
  try {
    const response = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    console.log(
      "Judge0 submission response:",
      response.status,
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Judge0 submission error:",
      "status:",
      error.response?.status,
      "data:",
      error.response?.data,
      "message:",
      error.message
    );
      
    

   throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to submit code"
    );
  }
};

const getSubmission = async (token) => {
  try {
    const response = await axios.get(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
      {
        timeout: 10000,
      }
    );

    console.log(
      "Judge0 submission result:",
      response.status,
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Judge0 result error:",
      "status:",
      error.response?.status,
      "data:",
      error.response?.data,
      "message:",
      error.message
    );

    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to get execution result"
    );
  }
};

module.exports = {
  submitCode,
  getSubmission,
};