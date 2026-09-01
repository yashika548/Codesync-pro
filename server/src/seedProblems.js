const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Problem = require("./models/Problem");

dotenv.config();

const problems = [
  // =====================================================
  // ARRAYS — EASY
  // =====================================================

  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given an array of integers and a target value, return the indices of the two numbers that add up to the target.",
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "0 1", isHidden: false },
      { input: "3 2 4\n6", expectedOutput: "1 2", isHidden: true },
      { input: "3 3\n6", expectedOutput: "0 1", isHidden: true },
    ],
  },

  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given an integer array, determine whether any value appears at least twice.",
    testCases: [
      { input: "1 2 3 1", expectedOutput: "true", isHidden: false },
      { input: "1 2 3 4", expectedOutput: "false", isHidden: true },
      { input: "1 1 1 3", expectedOutput: "true", isHidden: true },
    ],
  },

  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Find the contiguous subarray with the largest sum.",
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isHidden: false },
      { input: "1", expectedOutput: "1", isHidden: true },
      { input: "5 4 -1 7 8", expectedOutput: "23", isHidden: true },
    ],
  },

  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given stock prices for each day, find the maximum profit possible by buying once and selling once.",
    testCases: [
      { input: "7 1 5 3 6 4", expectedOutput: "5", isHidden: false },
      { input: "7 6 4 3 1", expectedOutput: "0", isHidden: true },
      { input: "2 4 1", expectedOutput: "2", isHidden: true },
    ],
  },

  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Move all zeroes to the end of the array while maintaining the relative order of non-zero elements.",
    testCases: [
      { input: "0 1 0 3 12", expectedOutput: "1 3 12 0 0", isHidden: false },
      { input: "0", expectedOutput: "0", isHidden: true },
      { input: "1 0 2 0 3", expectedOutput: "1 2 3 0 0", isHidden: true },
    ],
  },

  // =====================================================
  // STRINGS — EASY
  // =====================================================

  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Given two strings, determine whether the second string is an anagram of the first.",
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true", isHidden: false },
      { input: "rat\ncar", expectedOutput: "false", isHidden: true },
      { input: "listen\nsilent", expectedOutput: "true", isHidden: true },
    ],
  },

  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Determine whether a string is a palindrome after converting uppercase letters to lowercase and removing non-alphanumeric characters.",
    testCases: [
      { input: "A man a plan a canal Panama", expectedOutput: "true", isHidden: false },
      { input: "race a car", expectedOutput: "false", isHidden: true },
      { input: "121", expectedOutput: "true", isHidden: true },
    ],
  },

  {
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Reverse the given string.",
    testCases: [
      { input: "hello", expectedOutput: "olleh", isHidden: false },
      { input: "CodeSync", expectedOutput: "cnySedoC", isHidden: true },
      { input: "abc", expectedOutput: "cba", isHidden: true },
    ],
  },

  {
    slug: "first-unique-character",
    title: "First Unique Character",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Find the index of the first non-repeating character in a string. Return -1 if none exists.",
    testCases: [
      { input: "leetcode", expectedOutput: "0", isHidden: false },
      { input: "loveleetcode", expectedOutput: "2", isHidden: true },
      { input: "aabb", expectedOutput: "-1", isHidden: true },
    ],
  },

  {
    slug: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Find the longest common prefix shared by all strings.",
    testCases: [
      { input: "flower flow flight", expectedOutput: "fl", isHidden: false },
      { input: "dog racecar car", expectedOutput: "", isHidden: true },
      { input: "interview internet internal", expectedOutput: "inter", isHidden: true },
    ],
  },

  // =====================================================
  // LINKED LIST — EASY
  // =====================================================

  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    description:
      "Reverse a singly linked list and return the new head.",
    testCases: [
      { input: "1 2 3 4 5", expectedOutput: "5 4 3 2 1", isHidden: false },
      { input: "1 2", expectedOutput: "2 1", isHidden: true },
      { input: "1", expectedOutput: "1", isHidden: true },
    ],
  },

  {
    slug: "middle-of-linked-list",
    title: "Middle of the Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    description:
      "Return the middle node of a singly linked list.",
    testCases: [
      { input: "1 2 3 4 5", expectedOutput: "3", isHidden: false },
      { input: "1 2 3 4 5 6", expectedOutput: "4", isHidden: true },
      { input: "1", expectedOutput: "1", isHidden: true },
    ],
  },

  {
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    description:
      "Merge two sorted linked lists into one sorted linked list.",
    testCases: [
      { input: "1 2 4\n1 3 4", expectedOutput: "1 1 2 3 4 4", isHidden: false },
      { input: "\n0", expectedOutput: "0", isHidden: true },
      { input: "2\n1", expectedOutput: "1 2", isHidden: true },
    ],
  },

  // =====================================================
  // STACK — EASY
  // =====================================================

  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks",
    description:
      "Determine whether every opening bracket has a corresponding closing bracket in the correct order.",
    testCases: [
      { input: "()", expectedOutput: "true", isHidden: false },
      { input: "()[]{}", expectedOutput: "true", isHidden: true },
      { input: "(]", expectedOutput: "false", isHidden: true },
    ],
  },

  {
    slug: "min-stack",
    title: "Min Stack",
    difficulty: "Easy",
    category: "Stacks",
    description:
      "Design a stack that supports push, pop, top and retrieving the minimum element in constant time.",
    testCases: [
      { input: "push 2\npush 1\ngetMin", expectedOutput: "1", isHidden: false },
      { input: "push 5\npush 3\ngetMin\npop\ngetMin", expectedOutput: "3\n5", isHidden: true },
    ],
  },

  // =====================================================
  // BINARY SEARCH — EASY
  // =====================================================

  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description:
      "Given a sorted array and a target, return the index of the target using binary search. Return -1 if it does not exist.",
    testCases: [
      { input: "1 3 5 7 9\n5", expectedOutput: "2", isHidden: false },
      { input: "1 3 5 7 9\n4", expectedOutput: "-1", isHidden: true },
      { input: "1\n1", expectedOutput: "0", isHidden: true },
    ],
  },

  // =====================================================
  // ARRAYS — MEDIUM
  // =====================================================

  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Return an array where each element is the product of all elements except the element at that index.",
    testCases: [
      { input: "1 2 3 4", expectedOutput: "24 12 8 6", isHidden: false },
      { input: "-1 1 0 -3 3", expectedOutput: "0 0 9 0 0", isHidden: true },
    ],
  },

  {
    slug: "three-sum",
    title: "3Sum",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Find all unique triplets in an array whose sum is zero.",
    testCases: [
      { input: "-1 0 1 2 -1 -4", expectedOutput: "-1 -1 2;-1 0 1", isHidden: false },
      { input: "0 1 1", expectedOutput: "", isHidden: true },
    ],
  },

  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Find two vertical lines that together with the x-axis form a container containing the most water.",
    testCases: [
      { input: "1 8 6 2 5 4 8 3 7", expectedOutput: "49", isHidden: false },
      { input: "1 1", expectedOutput: "1", isHidden: true },
    ],
  },

  {
    slug: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Count the number of continuous subarrays whose sum equals k.",
    testCases: [
      { input: "1 1 1\n2", expectedOutput: "2", isHidden: false },
      { input: "1 2 3\n3", expectedOutput: "2", isHidden: true },
    ],
  },

  {
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Find the length of the longest consecutive sequence in an unsorted array.",
    testCases: [
      { input: "100 4 200 1 3 2", expectedOutput: "4", isHidden: false },
      { input: "0 3 7 2 5 8 4 6 0 1", expectedOutput: "9", isHidden: true },
    ],
  },

  // =====================================================
  // SLIDING WINDOW — MEDIUM
  // =====================================================

  {
    slug: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    description:
      "Find the length of the longest substring without repeating characters.",
    testCases: [
      { input: "abcabcbb", expectedOutput: "3", isHidden: false },
      { input: "bbbbb", expectedOutput: "1", isHidden: true },
      { input: "pwwkew", expectedOutput: "3", isHidden: true },
    ],
  },

  {
    slug: "minimum-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Find the minimum length of a contiguous subarray whose sum is greater than or equal to target.",
    testCases: [
      { input: "7\n2 3 1 2 4 3", expectedOutput: "2", isHidden: false },
      { input: "4\n1 4 4", expectedOutput: "1", isHidden: true },
    ],
  },

  {
    slug: "permutation-in-string",
    title: "Permutation in String",
    difficulty: "Medium",
    category: "Strings",
    description:
      "Determine whether one string contains a permutation of another string.",
    testCases: [
      { input: "ab\neidbaooo", expectedOutput: "true", isHidden: false },
      { input: "ab\neidboaoo", expectedOutput: "false", isHidden: true },
    ],
  },

  // =====================================================
  // STRINGS — MEDIUM
  // =====================================================

  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Strings",
    description:
      "Group strings that are anagrams of each other.",
    testCases: [
      { input: "eat tea tan ate nat bat", expectedOutput: "bat;ate eat tea;nat tan", isHidden: false },
      { input: "a", expectedOutput: "a", isHidden: true },
    ],
  },

  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "Strings",
    description:
      "Return the longest palindromic substring.",
    testCases: [
      { input: "babad", expectedOutput: "bab", isHidden: false },
      { input: "cbbd", expectedOutput: "bb", isHidden: true },
    ],
  },

  {
    slug: "decode-string",
    title: "Decode String",
    difficulty: "Medium",
    category: "Strings",
    description:
      "Decode strings encoded using the pattern k[encoded_string].",
    testCases: [
      { input: "3[a]2[bc]", expectedOutput: "aaabcbc", isHidden: false },
      { input: "3[a2[c]]", expectedOutput: "accaccacc", isHidden: true },
    ],
  },

  // =====================================================
  // LINKED LIST — MEDIUM
  // =====================================================

  {
    slug: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Medium",
    category: "Linked Lists",
    description:
      "Determine whether a linked list contains a cycle.",
    testCases: [
      { input: "3 2 0 -4\n1", expectedOutput: "true", isHidden: false },
      { input: "1 2\n-1", expectedOutput: "false", isHidden: true },
    ],
  },

  {
    slug: "remove-nth-node",
    title: "Remove Nth Node From End",
    difficulty: "Medium",
    category: "Linked Lists",
    description:
      "Remove the nth node from the end of a linked list.",
    testCases: [
      { input: "1 2 3 4 5\n2", expectedOutput: "1 2 3 5", isHidden: false },
      { input: "1\n1", expectedOutput: "", isHidden: true },
    ],
  },

  // =====================================================
  // TREES — EASY / MEDIUM
  // =====================================================

  {
    slug: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description:
      "Return the maximum depth of a binary tree.",
    testCases: [
      { input: "3 9 20 null null 15 7", expectedOutput: "3", isHidden: false },
      { input: "1 null 2", expectedOutput: "2", isHidden: true },
    ],
  },

  {
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description:
      "Invert a binary tree by swapping every left and right subtree.",
    testCases: [
      { input: "4 2 7 1 3 6 9", expectedOutput: "4 7 2 9 6 3 1", isHidden: false },
      { input: "2 1 3", expectedOutput: "2 3 1", isHidden: true },
    ],
  },

  {
    slug: "binary-tree-level-order",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    description:
      "Return the level-order traversal of a binary tree.",
    testCases: [
      { input: "3 9 20 null null 15 7", expectedOutput: "3;9 20;15 7", isHidden: false },
      { input: "1", expectedOutput: "1", isHidden: true },
    ],
  },

  {
    slug: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    description:
      "Determine whether a binary tree is a valid binary search tree.",
    testCases: [
      { input: "2 1 3", expectedOutput: "true", isHidden: false },
      { input: "5 1 4 null null 3 6", expectedOutput: "false", isHidden: true },
    ],
  },

  // =====================================================
  // GRAPHS — MEDIUM
  // =====================================================

  {
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graphs",
    description:
      "Given a grid containing land and water, count the number of islands.",
    testCases: [
      { input: "11110\n11010\n11000\n00000", expectedOutput: "1", isHidden: false },
      { input: "11000\n11000\n00100\n00011", expectedOutput: "3", isHidden: true },
    ],
  },

  {
    slug: "clone-graph",
    title: "Clone Graph",
    difficulty: "Medium",
    category: "Graphs",
    description:
      "Return a deep copy of an undirected graph.",
    testCases: [
      { input: "1 2 4\n2 1 3\n3 2 4\n4 1 3", expectedOutput: "cloned", isHidden: false },
    ],
  },

  {
    slug: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graphs",
    description:
      "Determine whether all courses can be completed given prerequisite relationships.",
    testCases: [
      { input: "2\n1 0", expectedOutput: "true", isHidden: false },
      { input: "2\n1 0;0 1", expectedOutput: "false", isHidden: true },
    ],
  },

  // =====================================================
  // DYNAMIC PROGRAMMING — MEDIUM
  // =====================================================

  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description:
      "You can climb one or two steps at a time. Return the number of distinct ways to reach the top.",
    testCases: [
      { input: "2", expectedOutput: "2", isHidden: false },
      { input: "3", expectedOutput: "3", isHidden: true },
      { input: "5", expectedOutput: "8", isHidden: true },
    ],
  },

  {
    slug: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Determine the maximum amount of money that can be robbed without robbing two adjacent houses.",
    testCases: [
      { input: "1 2 3 1", expectedOutput: "4", isHidden: false },
      { input: "2 7 9 3 1", expectedOutput: "12", isHidden: true },
    ],
  },

  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Return the minimum number of coins required to make the given amount.",
    testCases: [
      { input: "1 2 5\n11", expectedOutput: "3", isHidden: false },
      { input: "2\n3", expectedOutput: "-1", isHidden: true },
      { input: "1\n0", expectedOutput: "0", isHidden: true },
    ],
  },

  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Find the length of the longest strictly increasing subsequence.",
    testCases: [
      { input: "10 9 2 5 3 7 101 18", expectedOutput: "4", isHidden: false },
      { input: "0 1 0 3 2 3", expectedOutput: "4", isHidden: true },
    ],
  },

  // =====================================================
  // HARD
  // =====================================================

  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Arrays",
    description:
      "Given an elevation map, calculate how much rain water can be trapped.",
    testCases: [
      { input: "0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", isHidden: false },
      { input: "4 2 0 3 2 5", expectedOutput: "9", isHidden: true },
    ],
  },

  {
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    category: "Strings",
    description:
      "Find the smallest substring of a string that contains all characters of another string.",
    testCases: [
      { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC", isHidden: false },
      { input: "a\naa", expectedOutput: "", isHidden: true },
    ],
  },

  {
    slug: "median-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Arrays",
    description:
      "Find the median of two sorted arrays with logarithmic time complexity.",
    testCases: [
      { input: "1 3\n2", expectedOutput: "2", isHidden: false },
      { input: "1 2\n3 4", expectedOutput: "2.5", isHidden: true },
    ],
  },

  {
    slug: "word-ladder",
    title: "Word Ladder",
    difficulty: "Hard",
    category: "Graphs",
    description:
      "Find the shortest transformation sequence from beginWord to endWord.",
    testCases: [
      {
        input: "hit\ncog\nhot dot dog lot log cog",
        expectedOutput: "5",
        isHidden: false,
      },
      {
        input: "hit\ncog\nhot dot dog lot log",
        expectedOutput: "0",
        isHidden: true,
      },
    ],
  },

  {
    slug: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description:
      "Find the minimum number of insertions, deletions, and substitutions required to transform one string into another.",
    testCases: [
      { input: "horse\nros", expectedOutput: "3", isHidden: false },
      { input: "intention\nexecution", expectedOutput: "5", isHidden: true },
    ],
  },

  {
    slug: "merge-k-sorted-lists",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    category: "Linked Lists",
    description:
      "Merge k sorted linked lists into one sorted linked list.",
    testCases: [
      { input: "1 4 5\n1 3 4\n2 6", expectedOutput: "1 1 2 3 4 4 5 6", isHidden: false },
      { input: "", expectedOutput: "", isHidden: true },
    ],
  },

  {
    slug: "serialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    category: "Trees",
    description:
      "Design an algorithm to serialize a binary tree into a string and deserialize it back.",
    testCases: [
      { input: "1 2 3 null null 4 5", expectedOutput: "1 2 3 null null 4 5", isHidden: false },
    ],
  },

  {
    slug: "n-queens",
    title: "N-Queens",
    difficulty: "Hard",
    category: "Backtracking",
    description:
      "Place n queens on an n×n chessboard so that no two queens attack each other.",
    testCases: [
      { input: "4", expectedOutput: "2", isHidden: false },
      { input: "1", expectedOutput: "1", isHidden: true },
    ],
  },

  {
    slug: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Determine whether a string can be segmented into one or more dictionary words.",
    testCases: [
      { input: "leetcode\nleet code", expectedOutput: "true", isHidden: false },
      { input: "catsandog\ncats dog sand and cat", expectedOutput: "false", isHidden: true },
    ],
  },

  {
    slug: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Determine whether an array can be partitioned into two subsets with equal sum.",
    testCases: [
      { input: "1 5 11 5", expectedOutput: "true", isHidden: false },
      { input: "1 2 3 5", expectedOutput: "false", isHidden: true },
    ],
  },

  {
    slug: "unique-paths",
    title: "Unique Paths",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Count the number of unique paths from the top-left to the bottom-right of an m×n grid.",
    testCases: [
      { input: "3 7", expectedOutput: "28", isHidden: false },
      { input: "3 2", expectedOutput: "3", isHidden: true },
    ],
  },

  {
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Determine whether you can reach the last index of an array.",
    testCases: [
      { input: "2 3 1 1 4", expectedOutput: "true", isHidden: false },
      { input: "3 2 1 0 4", expectedOutput: "false", isHidden: true },
    ],
  },

  {
    slug: "gas-station",
    title: "Gas Station",
    difficulty: "Medium",
    category: "Greedy",
    description:
      "Find the starting gas station index from which a car can complete the circuit.",
    testCases: [
      { input: "1 2 3 4 5\n3 4 5 1 2", expectedOutput: "3", isHidden: false },
      { input: "2 3 4\n3 4 3", expectedOutput: "-1", isHidden: true },
    ],
  },

  {
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    category: "Stacks",
    description:
      "For each day, find how many days you must wait until a warmer temperature.",
    testCases: [
      {
        input: "73 74 75 71 69 72 76 73",
        expectedOutput: "1 1 4 2 1 1 0 0",
        isHidden: false,
      },
      {
        input: "30 40 50 60",
        expectedOutput: "1 1 1 0",
        isHidden: true,
      },
    ],
  },

  {
    slug: "largest-rectangle-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    category: "Stacks",
    description:
      "Given bar heights in a histogram, find the largest rectangular area.",
    testCases: [
      { input: "2 1 5 6 2 3", expectedOutput: "10", isHidden: false },
      { input: "2 4", expectedOutput: "4", isHidden: true },
    ],
  },

  {
    slug: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    category: "Backtracking",
    description:
      "Given an integer array with unique elements, return all possible subsets.",
    testCases: [
      { input: "1 2 3", expectedOutput: "8", isHidden: false },
      { input: "0", expectedOutput: "2", isHidden: true },
    ],
  },

  {
    slug: "permutations",
    title: "Permutations",
    difficulty: "Medium",
    category: "Backtracking",
    description:
      "Return all possible permutations of an array containing distinct integers.",
    testCases: [
      { input: "1 2 3", expectedOutput: "6", isHidden: false },
      { input: "0 1", expectedOutput: "2", isHidden: true },
    ],
  },

  {
    slug: "combination-sum",
    title: "Combination Sum",
    difficulty: "Medium",
    category: "Backtracking",
    description:
      "Find all unique combinations of candidate numbers that sum to a target.",
    testCases: [
      { input: "2 3 6 7\n7", expectedOutput: "2", isHidden: false },
      { input: "2 3 5\n8", expectedOutput: "3", isHidden: true },
    ],
  },

  {
    slug: "generate-parentheses",
    title: "Generate Parentheses",
    difficulty: "Medium",
    category: "Backtracking",
    description:
      "Generate all combinations of n pairs of valid parentheses.",
    testCases: [
      { input: "3", expectedOutput: "5", isHidden: false },
      { input: "1", expectedOutput: "1", isHidden: true },
    ],
  },

  {
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description:
      "Search for a target in a rotated sorted array in O(log n) time.",
    testCases: [
      { input: "4 5 6 7 0 1 2\n0", expectedOutput: "4", isHidden: false },
      { input: "4 5 6 7 0 1 2\n3", expectedOutput: "-1", isHidden: true },
    ],
  },

  {
    slug: "kth-largest-element",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Find the kth largest element in an unsorted array.",
    testCases: [
      { input: "3 2 1 5 6 4\n2", expectedOutput: "5", isHidden: false },
      { input: "3 2 3 1 2 4 5 5 6\n4", expectedOutput: "4", isHidden: true },
    ],
  },

  {
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Hashing",
    description:
      "Return the k most frequent elements in an integer array.",
    testCases: [
      { input: "1 1 1 2 2 3\n2", expectedOutput: "1 2", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: true },
    ],
  },

  {
    slug: "implement-trie",
    title: "Implement Trie",
    difficulty: "Medium",
    category: "Data Structures",
    description:
      "Implement a trie data structure supporting insertion, search, and prefix queries.",
    testCases: [
      { input: "insert apple\nsearch apple\nstartsWith app", expectedOutput: "true\ntrue", isHidden: false },
    ],
  },
];






// =====================================================
// SEED DATABASE
// =====================================================

// =====================================================
// NORMALIZE PROBLEMS BEFORE INSERT
// =====================================================

const normalizeProblem = (problem) => {
  // Convert existing testCases into frontend-friendly examples.
  const examples = (problem.testCases || [])
    .filter((testCase) => !testCase.isHidden)
    .map((testCase) => ({
      input: testCase.input || "",
      output: testCase.expectedOutput || "",
    }));

  // Every problem gets at least one example.
  if (examples.length === 0 && problem.testCases?.length > 0) {
    examples.push({
      input: problem.testCases[0].input || "",
      output: problem.testCases[0].expectedOutput || "",
    });
  }

  // Generic constraints for now.
  // You can later replace these with problem-specific constraints.
  const constraints = [
    "Input values follow the format described in the examples.",
    "Return the correct output for all valid inputs.",
    "Your solution should handle edge cases correctly.",
  ];

  // Starter code.
  // The user can immediately start coding in Monaco.
  const starterCode = {
    javascript: `// ${problem.title}

const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();

// Write your solution here.

`,
    
    typescript: `// ${problem.title}

const fs = require("fs");

const input: string = fs.readFileSync(0, "utf8").trim();

// Write your solution here.

`,

    python: `# ${problem.title}

import sys

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
    vector<string> lines;

    while (getline(cin, line)) {
        lines.push_back(line);
    }

    // Write your solution here.

    return 0;
}
`,
  };

  return {
    ...problem,

    category: problem.category || "Arrays",

    examples,

    constraints,

    starterCode,
  };
};


// =====================================================
// SEED DATABASE
// =====================================================

const seedProblems = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from your .env file."
      );
    }

    // Connect directly to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    // Clear existing problems
    await Problem.deleteMany({});

    // Normalize every problem before inserting
    const normalizedProblems = problems.map(
      normalizeProblem
    );

    // Insert all problems
    await Problem.insertMany(normalizedProblems);

    console.log(
      `✅ ${normalizedProblems.length} problems seeded successfully.`
    );

    // Show some useful information
    console.log(
      "✅ Problems now contain examples, constraints and starterCode."
    );

    // Close MongoDB connection
    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {
    console.error(
      "❌ Problem seeding failed:",
      error
    );

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error(
        "MongoDB disconnect failed:",
        disconnectError
      );
    }

    process.exit(1);
  }
};

seedProblems();