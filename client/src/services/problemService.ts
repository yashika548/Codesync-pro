import axios from "axios";

const API_URL = "http://localhost:5000/api";

// =====================================================
// TYPES
// =====================================================

export interface TestCase {
  input: string;
  output: string;
}

export interface Problem {
  id: string;
  slug?: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;

  examples: TestCase[];

  constraints: string[];

  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
    cpp: string;
    java: string;
  };
}

// =====================================================
// DEFAULT STARTER CODE
// =====================================================

const getDefaultStarterCode = (): Problem["starterCode"] => ({
  javascript: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();

// Write your solution here.
`,

  typescript: `const fs = require("fs");

const input: string = fs.readFileSync(0, "utf8").trim();

// Write your solution here.
`,

  python: `import sys

input_data = sys.stdin.read().strip()

# Write your solution here.
`,

  java: `import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {

        BufferedReader br =
            new BufferedReader(new InputStreamReader(System.in));

        StringBuilder input = new StringBuilder();
        String line;

        while ((line = br.readLine()) != null) {
            input.append(line).append("\\n");
        }

        // Write your solution here.
    }
}
`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {

    string line;

    while (getline(cin, line)) {
        // Read input
    }

    // Write your solution here.

    return 0;
}
`,
});

// =====================================================
// NORMALIZE SINGLE PROBLEM
// =====================================================

const normalizeProblem = (raw: any): Problem => {
  const defaultStarterCode = getDefaultStarterCode();

  const examples =
    Array.isArray(raw.examples) && raw.examples.length > 0
      ? raw.examples
      : Array.isArray(raw.testCases)
      ? raw.testCases
          .filter(
            (testCase: any) =>
              testCase.isHidden !== true
          )
          .map((testCase: any) => ({
            input: testCase.input || "",
            output:
              testCase.output ??
              testCase.expectedOutput ??
              "",
          }))
      : [];

  const constraints =
    Array.isArray(raw.constraints)
      ? raw.constraints
      : [
          "Input values follow the format described in the examples.",
          "Return the correct output for all valid inputs.",
          "Your solution should handle edge cases correctly.",
        ];

  return {
    id: String(raw.id ?? raw._id ?? ""),
    slug: raw.slug,

    title: raw.title || "Untitled Problem",

    difficulty:
      raw.difficulty === "Medium" ||
      raw.difficulty === "Hard"
        ? raw.difficulty
        : "Easy",

    category:
      raw.category || "Arrays",

    description:
      raw.description || "No description available.",

    examples: examples.map((example: any) => ({
      input: example.input || "",
      output:
        example.output ??
        example.expectedOutput ??
        "",
    })),

    constraints,

    starterCode: {
      javascript:
        raw.starterCode?.javascript ??
        defaultStarterCode.javascript,

      typescript:
        raw.starterCode?.typescript ??
        defaultStarterCode.typescript,

      python:
        raw.starterCode?.python ??
        defaultStarterCode.python,

      cpp:
        raw.starterCode?.cpp ??
        defaultStarterCode.cpp,

      java:
        raw.starterCode?.java ??
        defaultStarterCode.java,
    },
  };
};

// =====================================================
// GET ALL PROBLEMS
// =====================================================

export const getProblems = async (): Promise<Problem[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/problems`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data =
    response.data?.problems ||
    response.data ||
    [];

  return Array.isArray(data)
    ? data.map(normalizeProblem)
    : [];
};

// =====================================================
// GET SINGLE PROBLEM
// =====================================================

export const getProblemById = async (
  problemId: string
): Promise<Problem> => {
  if (!problemId) {
    throw new Error("Problem ID is missing.");
  }

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/problems/${problemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const rawProblem =
    response.data?.problem ||
    response.data;

  if (!rawProblem) {
    throw new Error("Problem not found.");
  }

  return normalizeProblem(rawProblem);
};