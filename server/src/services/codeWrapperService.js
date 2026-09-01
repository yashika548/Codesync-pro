const buildJavaScriptCode = (
  sourceCode,
  problemSlug,
  input
) => {
  if (problemSlug === "two-sum") {
    return `
${sourceCode}

try {
  const input = ${JSON.stringify(
    JSON.parse(input)
  )};

  if (typeof twoSum !== "function") {
    throw new Error(
      "Function twoSum was not found."
    );
  }

  const result = twoSum(
    input.nums,
    input.target
  );

  process.stdout.write(
    JSON.stringify(result)
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
`;
  }

  if (problemSlug === "reverse-string") {
    return `
${sourceCode}

try {
  const input = ${JSON.stringify(
    JSON.parse(input)
  )};

  if (typeof reverseString !== "function") {
    throw new Error(
      "Function reverseString was not found."
    );
  }

  const chars = input.s;

  reverseString(chars);

  process.stdout.write(
    JSON.stringify(chars)
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
`;
  }

  return sourceCode;
};

const buildPythonCode = (
  sourceCode,
  problemSlug,
  input
) => {
  if (problemSlug === "two-sum") {
    return `
${sourceCode}

import json

input_data = json.loads(${JSON.stringify(input)})

result = two_sum(
    input_data["nums"],
    input_data["target"]
)

print(json.dumps(result))
`;
  }

  if (problemSlug === "reverse-string") {
    return `
${sourceCode}

import json

input_data = json.loads(${JSON.stringify(input)})

s = input_data["s"]

reverse_string(s)

print(json.dumps(s))
`;
  }

  return sourceCode;
};

const buildTypeScriptCode = (
  sourceCode,
  problemSlug,
  input
) => {
  if (problemSlug === "two-sum") {
    return `
${sourceCode}

const input = ${JSON.stringify(
  JSON.parse(input)
)};

const result = twoSum(
  input.nums,
  input.target
);

console.log(JSON.stringify(result));
`;
  }

  if (problemSlug === "reverse-string") {
    return `
${sourceCode}

const input = ${JSON.stringify(
  JSON.parse(input)
)};

const chars = input.s;

reverseString(chars);

console.log(JSON.stringify(chars));
`;
  }

  return sourceCode;
};

const buildWrappedCode = ({
  sourceCode,
  languageId,
  problemSlug,
  input,
}) => {
  switch (languageId) {
    case 63:
      return buildJavaScriptCode(
        sourceCode,
        problemSlug,
        input
      );

    case 74:
      return buildTypeScriptCode(
        sourceCode,
        problemSlug,
        input
      );

    case 71:
      return buildPythonCode(
        sourceCode,
        problemSlug,
        input
      );

    default:
      return sourceCode;
  }
};

module.exports = {
  buildWrappedCode,
};