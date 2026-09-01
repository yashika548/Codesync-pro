require("dotenv").config();

const mongoose = require("mongoose");

const AIKnowledge = require("../models/AIKnowledge");

const {
  createEmbedding,
} = require("./rag/embeddingService");

const knowledge = [
  {
    title: "Two Sum",
    category: "dsa",
    content:
      "The Two Sum problem asks you to find two numbers in an array whose sum equals a target. An efficient solution uses a hash map to store previously seen numbers. For each number, calculate target - number and check whether that complement already exists. This gives O(n) time complexity and O(n) space complexity.",
  },

  {
    title: "Binary Search",
    category: "dsa",
    content:
      "Binary Search efficiently finds an element in a sorted array by repeatedly dividing the search space in half. Its time complexity is O(log n), making it much faster than linear search for large sorted datasets.",
  },

  {
    title: "Hash Maps",
    category: "dsa",
    content:
      "A hash map stores key-value pairs and provides average O(1) insertion, lookup, and deletion. Hash maps are commonly used for frequency counting, caching, duplicate detection, and problems such as Two Sum.",
  },

  {
    title: "Big O Complexity",
    category: "dsa",
    content:
      "Big O notation describes how an algorithm's time or space requirements grow with input size. Common complexities include O(1), O(log n), O(n), O(n log n), and O(n^2). Efficient algorithms generally try to reduce unnecessary loops and repeated computation.",
  },

  {
    title: "Arrays",
    category: "dsa",
    content:
      "Arrays store elements in contiguous or logically indexed positions. Accessing an element by index is typically O(1). Searching an unsorted array is O(n), while inserting or deleting from the middle can require shifting elements.",
  },

  {
    title: "JavaScript",
    category: "programming",
    content:
      "JavaScript is a dynamically typed programming language widely used for web development. Modern JavaScript supports let, const, arrow functions, promises, async and await, modules, classes, destructuring, and higher-order functions.",
  },

  {
    title: "React",
    category: "frontend",
    content:
      "React is a component-based JavaScript library for building user interfaces. Applications are commonly divided into reusable components. State and props are used to manage and pass data, while hooks such as useState and useEffect manage component behavior.",
  },

  {
    title: "Node.js and Express",
    category: "backend",
    content:
      "Node.js allows JavaScript to run on the server. Express is a lightweight web framework used to build APIs and backend services. Express applications commonly use routes, controllers, middleware, services, and models.",
  },

  {
    title: "MongoDB",
    category: "database",
    content:
      "MongoDB is a document-oriented NoSQL database. Data is stored as BSON documents inside collections. MongoDB supports indexes, aggregation pipelines, transactions, and vector search for AI applications.",
  },

  {
    title: "Vector Databases",
    category: "ai",
    content:
      "A vector database stores numerical embeddings representing the semantic meaning of data. Vector similarity search can retrieve documents that are semantically related to a query. This is a core component of Retrieval Augmented Generation systems.",
  },

  {
    title: "Retrieval Augmented Generation",
    category: "ai",
    content:
      "RAG combines information retrieval with a large language model. A user's query is converted into an embedding, relevant documents are retrieved from a vector database, and those documents are supplied as context to the language model to generate a grounded answer.",
  },

  {
    title: "AI Coding Assistant",
    category: "ai",
    content:
      "An AI coding assistant can analyze source code, explain algorithms, identify bugs, suggest improvements, generate test cases, and provide hints. A production coding assistant can combine an LLM with repository context, problem metadata, submission history, and RAG.",
  },

  {
    title: "System Design Scalability",
    category: "system-design",
    content:
      "Scalable systems distribute workloads across multiple application instances. Common techniques include horizontal scaling, load balancing, caching, database indexing, replication, sharding, asynchronous queues, and rate limiting.",
  },

  {
    title: "Redis Caching",
    category: "system-design",
    content:
      "Redis is an in-memory data store commonly used for caching, sessions, rate limiting, distributed locks, and temporary data. Caching frequently accessed data can reduce database load and improve API latency.",
  },
];


const seedKnowledge = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected for AI knowledge seeding."
    );

    // Remove only documents created by this seed.
    await AIKnowledge.deleteMany({
      source: "codesync-seed",
    });

    console.log(
      "Old seed documents removed."
    );

    for (const item of knowledge) {
      console.log(
        `Creating embedding: ${item.title}`
      );

      const embedding =
        await createEmbedding(
          `${item.title}\n${item.content}`
        );

      await AIKnowledge.create({
        title: item.title,
        content: item.content,
        category: item.category,
        source: "codesync-seed",
        embedding,
        metadata: {
          type: "knowledge",
          version: 1,
        },
      });

      console.log(
        `✓ Stored: ${item.title}`
      );
    }

    console.log(
      `\nSuccessfully seeded ${knowledge.length} AI knowledge documents.`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "AI knowledge seeding failed:"
    );

    console.error(error);

    process.exit(1);
  }
};

seedKnowledge();