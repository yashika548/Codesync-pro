const knowledgeData = [
  {
    title: "Hash Map",
    category: "DSA",
    content:
      "A hash map stores key-value pairs and provides average O(1) lookup, insertion, and deletion. It is useful when a problem requires fast lookup of previously seen values.",
  },

  {
    title: "Two Sum",
    category: "DSA",
    content:
      "The Two Sum problem can be solved efficiently using a hash map. Iterate through the array and for each number check whether target - number already exists in the map. This gives O(n) average time complexity and O(n) space complexity.",
  },

  {
    title: "Two Pointer",
    category: "DSA",
    content:
      "The two pointer technique uses two indices that move through a data structure, commonly an array or string. It is useful for sorted arrays, pair-sum problems, removing duplicates, and finding ranges efficiently.",
  },

  {
    title: "Sliding Window",
    category: "DSA",
    content:
      "Sliding window maintains a dynamic range over an array or string. Instead of repeatedly processing the same elements, the window expands and contracts while maintaining the required condition. Many sliding window problems can be solved in O(n).",
  },

  {
    title: "Binary Search",
    category: "DSA",
    content:
      "Binary search repeatedly divides a sorted search space in half. Its time complexity is O(log n). It can be used to find an element in a sorted array or search for an optimal answer over a monotonic search space.",
  },

  {
    title: "Big O Notation",
    category: "Computer Science",
    content:
      "Big O notation describes how an algorithm's time or space requirements grow as input size increases. Common complexities include O(1), O(log n), O(n), O(n log n), and O(n²).",
  },

  {
    title: "Arrays",
    category: "DSA",
    content:
      "An array stores elements in contiguous indexed positions. Accessing an element by index is O(1), while insertion or deletion in the middle can require shifting elements and may take O(n).",
  },

  {
    title: "Strings",
    category: "DSA",
    content:
      "String problems often involve frequency counting, two pointers, sliding windows, hashing, sorting, or dynamic programming. Choosing the correct technique depends on the constraints and required operations.",
  },

  {
    title: "Linked List",
    category: "DSA",
    content:
      "A linked list consists of nodes where each node stores data and a reference to another node. Accessing an arbitrary position takes O(n), while insertion or deletion can be O(1) when the relevant node or pointer is already available.",
  },

  {
    title: "Dynamic Programming",
    category: "DSA",
    content:
      "Dynamic programming solves problems with overlapping subproblems and optimal substructure. Common approaches include memoization and tabulation. A DP solution usually defines a state, transition, base cases, and iteration or recursion strategy.",
  },

  {
    title: "Time Complexity",
    category: "Interview",
    content:
      "Time complexity estimates how execution time grows with input size. When analyzing an algorithm, identify loops, nested loops, recursion, sorting, searching, and operations on data structures.",
  },

  {
    title: "Space Complexity",
    category: "Interview",
    content:
      "Space complexity measures additional memory required by an algorithm as input size grows. Consider auxiliary arrays, hash maps, recursion stacks, objects, and other dynamically allocated structures.",
  },
];

module.exports = knowledgeData;