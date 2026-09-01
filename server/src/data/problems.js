// server/src/data/problems.js

const problems = [

  // =====================================================
  // ARRAYS
  // =====================================================

  {
    id: "two-sum",
    title: "Two Sum",
    category: "Arrays",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]"
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    starterCode: {
      javascript:
`function twoSum(nums, target) {

  // Write your solution here

}`,
      typescript:
`function twoSum(nums: number[], target: number): number[] {

  // Write your solution here

}`,
      python:
`def two_sum(nums, target):

    # Write your solution here
    pass`,
      java:
`class Solution {
    public int[] twoSum(int[] nums, int target) {

        // Write your solution here

    }
}`,
      cpp:
`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    category: "Arrays",
    difficulty: "Easy",
    description:
      "Given an array prices where prices[i] is the price of a stock on day i, find the maximum profit you can achieve by buying on one day and selling on a later day.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5"
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0"
      }
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {

  // Write your solution here

}`,
      typescript: `function maxProfit(prices: number[]): number {

  // Write your solution here

}`,
      python: `def max_profit(prices):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    category: "Arrays",
    difficulty: "Easy",
    description:
      "Given an integer array nums, return true if any value appears at least twice and false if every element is distinct.",
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true"
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    starterCode: {
      javascript: `function containsDuplicate(nums) {

  // Write your solution here

}`,
      typescript: `function containsDuplicate(nums: number[]): boolean {

  // Write your solution here

}`,
      python: `def contains_duplicate(nums):

    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    category: "Arrays",
    difficulty: "Medium",
    description:
      "Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6"
      },
      {
        input: "nums = [1]",
        output: "1"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {

  // Write your solution here

}`,
      typescript: `function maxSubArray(nums: number[]): number {

  // Write your solution here

}`,
      python: `def max_sub_array(nums):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    category: "Arrays",
    difficulty: "Medium",
    description:
      "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i].",
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]"
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30"
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {

  // Write your solution here

}`,
      typescript: `function productExceptSelf(nums: number[]): number[] {

  // Write your solution here

}`,
      python: `def product_except_self(nums):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "3sum",
    title: "3Sum",
    category: "Arrays",
    difficulty: "Medium",
    description:
      "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that the three numbers add up to zero.",
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]"
      }
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    starterCode: {
      javascript: `function threeSum(nums) {

  // Write your solution here

}`,
      typescript: `function threeSum(nums: number[]): number[][] {

  // Write your solution here

}`,
      python: `def three_sum(nums):

    # Write your solution here
    pass`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    category: "Arrays",
    difficulty: "Medium",
    description:
      "Given an integer array height representing vertical lines, find two lines that together with the x-axis form a container containing the most water.",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49"
      },
      {
        input: "height = [1,1]",
        output: "1"
      }
    ],
    constraints: [
      "2 <= height.length <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    starterCode: {
      javascript: `function maxArea(height) {

  // Write your solution here

}`,
      typescript: `function maxArea(height: number[]): number {

  // Write your solution here

}`,
      python: `def max_area(height):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int maxArea(int[] height) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "merge-intervals",
    title: "Merge Intervals",
    category: "Arrays",
    difficulty: "Medium",
    description:
      "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]"
      }
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2"
    ],
    starterCode: {
      javascript: `function merge(intervals) {

  // Write your solution here

}`,
      typescript: `function merge(intervals: number[][]): number[][] {

  // Write your solution here

}`,
      python: `def merge(intervals):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    category: "Arrays",
    difficulty: "Hard",
    description:
      "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6"
      }
    ],
    constraints: [
      "1 <= height.length <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    starterCode: {
      javascript: `function trap(height) {

  // Write your solution here

}`,
      typescript: `function trap(height: number[]): number {

  // Write your solution here

}`,
      python: `def trap(height):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int trap(int[] height) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {

        // Write your solution here

    }
};`
    }
  },


  // =====================================================
  // STRINGS
  // =====================================================

  {
    id: "valid-anagram",
    title: "Valid Anagram",
    category: "Strings",
    difficulty: "Easy",
    description:
      "Given two strings s and t, return true if t is an anagram of s and false otherwise.",
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true"
      },
      {
        input: 's = "rat", t = "car"',
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters"
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {

  // Write your solution here

}`,
      typescript: `function isAnagram(s: string, t: string): boolean {

  // Write your solution here

}`,
      python: `def is_anagram(s, t):

    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    category: "Strings",
    difficulty: "Easy",
    description:
      "Given a string s, return true if it is a palindrome after converting uppercase letters to lowercase and removing non-alphanumeric characters.",
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true"
      },
      {
        input: 's = "race a car"',
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5"
    ],
    starterCode: {
      javascript: `function isPalindrome(s) {

  // Write your solution here

}`,
      typescript: `function isPalindrome(s: string): boolean {

  // Write your solution here

}`,
      python: `def is_palindrome(s):

    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isPalindrome(String s) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    category: "Strings",
    difficulty: "Medium",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3"
      },
      {
        input: 's = "bbbbb"',
        output: "1"
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4"
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {

  // Write your solution here

}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {

  // Write your solution here

}`,
      python: `def length_of_longest_substring(s):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    category: "Strings",
    difficulty: "Medium",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"'
      },
      {
        input: 's = "cbbd"',
        output: '"bb"'
      }
    ],
    constraints: [
      "1 <= s.length <= 1000"
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {

  // Write your solution here

}`,
      typescript: `function longestPalindrome(s: string): string {

  // Write your solution here

}`,
      python: `def longest_palindrome(s):

    # Write your solution here
    pass`,
      java: `class Solution {
    public String longestPalindrome(String s) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    string longestPalindrome(string s) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "minimum-window-substring",
    title: "Minimum Window Substring",
    category: "Strings",
    difficulty: "Hard",
    description:
      "Given strings s and t, return the minimum window substring of s that contains every character in t.",
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"'
      }
    ],
    constraints: [
      "1 <= s.length, t.length <= 10^5"
    ],
    starterCode: {
      javascript: `function minWindow(s, t) {

  // Write your solution here

}`,
      typescript: `function minWindow(s: string, t: string): string {

  // Write your solution here

}`,
      python: `def min_window(s, t):

    # Write your solution here
    pass`,
      java: `class Solution {
    public String minWindow(String s, String t) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    string minWindow(string s, string t) {

        // Write your solution here

    }
};`
    }
  },


  // =====================================================
  // HASHING
  // =====================================================

  {
    id: "group-anagrams",
    title: "Group Anagrams",
    category: "Hashing",
    difficulty: "Medium",
    description:
      "Given an array of strings strs, group the anagrams together.",
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["eat","tea","ate"],["tan","nat"],["bat"]]'
      }
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100"
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {

  // Write your solution here

}`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {

  // Write your solution here

}`,
      python: `def group_anagrams(strs):

    # Write your solution here
    pass`,
      java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    category: "Hashing",
    difficulty: "Medium",
    description:
      "Given an integer array nums and an integer k, return the k most frequent elements.",
    examples: [
      {
        input: "nums = [1,1,1,2,2,3], k = 2",
        output: "[1,2]"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "1 <= k <= number of unique elements"
    ],
    starterCode: {
      javascript: `function topKFrequent(nums, k) {

  // Write your solution here

}`,
      typescript: `function topKFrequent(nums: number[], k: number): number[] {

  // Write your solution here

}`,
      python: `def top_k_frequent(nums, k):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {

        // Write your solution here

    }
};`
    }
  },


  // =====================================================
  // LINKED LIST
  // =====================================================

  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    category: "Linked List",
    difficulty: "Easy",
    description:
      "Given the head of a singly linked list, reverse the list and return its head.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]"
      }
    ],
    constraints: [
      "0 <= number of nodes <= 5000"
    ],
    starterCode: {
      javascript: `function reverseList(head) {

  // Write your solution here

}`,
      typescript: `function reverseList(head: ListNode | null): ListNode | null {

  // Write your solution here

}`,
      python: `def reverse_list(head):

    # Write your solution here
    pass`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "middle-of-linked-list",
    title: "Middle of the Linked List",
    category: "Linked List",
    difficulty: "Easy",
    description:
      "Given the head of a singly linked list, return the middle node of the linked list.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[3,4,5]"
      }
    ],
    constraints: [
      "1 <= number of nodes <= 100"
    ],
    starterCode: {
      javascript: `function middleNode(head) {

  // Write your solution here

}`,
      typescript: `function middleNode(head: ListNode | null): ListNode | null {

  // Write your solution here

}`,
      python: `def middle_node(head):

    # Write your solution here
    pass`,
      java: `class Solution {
    public ListNode middleNode(ListNode head) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    ListNode* middleNode(ListNode* head) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    category: "Linked List",
    difficulty: "Medium",
    description:
      "Given the head of a linked list, determine if the linked list contains a cycle.",
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true"
      },
      {
        input: "head = [1], pos = -1",
        output: "false"
      }
    ],
    constraints: [
      "0 <= number of nodes <= 10^4"
    ],
    starterCode: {
      javascript: `function hasCycle(head) {

  // Write your solution here

}`,
      typescript: `function hasCycle(head: ListNode | null): boolean {

  // Write your solution here

}`,
      python: `def has_cycle(head):

    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean hasCycle(ListNode head) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool hasCycle(ListNode* head) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    category: "Linked List",
    difficulty: "Easy",
    description:
      "Merge two sorted linked lists and return the merged list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      }
    ],
    constraints: [
      "0 <= list length <= 50"
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {

  // Write your solution here

}`,
      typescript: `function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {

  // Write your solution here

}`,
      python: `def merge_two_lists(list1, list2):

    # Write your solution here
    pass`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "lru-cache",
    title: "LRU Cache",
    category: "Linked List",
    difficulty: "Hard",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used cache.",
    examples: [
      {
        input: "LRUCache(2), put(1,1), put(2,2), get(1), put(3,3)",
        output: "1"
      }
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4"
    ],
    starterCode: {
      javascript: `class LRUCache {

  constructor(capacity) {
    // Write your solution here
  }

  get(key) {
    // Write your solution here
  }

  put(key, value) {
    // Write your solution here
  }
}`,
      typescript: `class LRUCache {

  constructor(capacity: number) {
    // Write your solution here
  }

  get(key: number): number {
    return -1;
  }

  put(key: number, value: number): void {
    // Write your solution here
  }
}`,
      python: `class LRUCache:

    def __init__(self, capacity):
        # Write your solution here
        pass

    def get(self, key):
        pass

    def put(self, key, value):
        pass`,
      java: `class LRUCache {

    public LRUCache(int capacity) {
        // Write your solution here
    }

    public int get(int key) {
        return -1;
    }

    public void put(int key, int value) {
        // Write your solution here
    }
}`,
      cpp: `class LRUCache {
public:

    LRUCache(int capacity) {
        // Write your solution here
    }

    int get(int key) {
        return -1;
    }

    void put(int key, int value) {
        // Write your solution here
    }
};`
    }
  },


  // =====================================================
  // STACK & QUEUE
  // =====================================================

  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    category: "Stack & Queue",
    difficulty: "Easy",
    description:
      "Given a string containing parentheses, determine if the input string is valid.",
    examples: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "([)]"',
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4"
    ],
    starterCode: {
      javascript: `function isValid(s) {

  // Write your solution here

}`,
      typescript: `function isValid(s: string): boolean {

  // Write your solution here

}`,
      python: `def is_valid(s):

    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "min-stack",
    title: "Min Stack",
    category: "Stack & Queue",
    difficulty: "Medium",
    description:
      "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    examples: [
      {
        input: "push(-2), push(0), push(-3), getMin()",
        output: "-3"
      }
    ],
    constraints: [
      "-2^31 <= value <= 2^31 - 1",
      "Methods must run in O(1) time."
    ],
    starterCode: {
      javascript: `class MinStack {

  constructor() {
    // Write your solution here
  }

  push(val) {}

  pop() {}

  top() {}

  getMin() {}
}`,
      typescript: `class MinStack {

  constructor() {
    // Write your solution here
  }

  push(val: number): void {}

  pop(): void {}

  top(): number {}

  getMin(): number {}
}`,
      python: `class MinStack:

    def __init__(self):
        pass

    def push(self, val):
        pass

    def pop(self):
        pass

    def top(self):
        pass

    def get_min(self):
        pass`,
      java: `class MinStack {

    public MinStack() {
        // Write your solution here
    }

    public void push(int val) {}

    public void pop() {}

    public int top() {
        return 0;
    }

    public int getMin() {
        return 0;
    }
}`,
      cpp: `class MinStack {
public:

    MinStack() {
        // Write your solution here
    }

    void push(int val) {}

    void pop() {}

    int top() {
        return 0;
    }

    int getMin() {
        return 0;
    }
};`
    }
  },

  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    category: "Stack & Queue",
    difficulty: "Medium",
    description:
      "Given an array of daily temperatures, return an array where answer[i] is the number of days until a warmer temperature.",
    examples: [
      {
        input: "temperatures = [73,74,75,71,69,72,76,73]",
        output: "[1,1,4,2,1,1,0,0]"
      }
    ],
    constraints: [
      "1 <= temperatures.length <= 10^5"
    ],
    starterCode: {
      javascript: `function dailyTemperatures(temperatures) {

  // Write your solution here

}`,
      typescript: `function dailyTemperatures(temperatures: number[]): number[] {

  // Write your solution here

}`,
      python: `def daily_temperatures(temperatures):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    category: "Stack & Queue",
    difficulty: "Hard",
    description:
      "Given an array of integers representing the heights of histogram bars, return the area of the largest rectangle.",
    examples: [
      {
        input: "heights = [2,1,5,6,2,3]",
        output: "10"
      }
    ],
    constraints: [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4"
    ],
    starterCode: {
      javascript: `function largestRectangleArea(heights) {

  // Write your solution here

}`,
      typescript: `function largestRectangleArea(heights: number[]): number {

  // Write your solution here

}`,
      python: `def largest_rectangle_area(heights):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int largestRectangleArea(int[] heights) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {

        // Write your solution here

    }
};`
    }
  },


  // =====================================================
  // BINARY SEARCH
  // =====================================================

  {
    id: "binary-search",
    title: "Binary Search",
    category: "Binary Search",
    difficulty: "Easy",
    description:
      "Given a sorted array of integers nums and a target value, return the index of target or -1 if target does not exist.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "All values are unique."
    ],
    starterCode: {
      javascript: `function search(nums, target) {

  // Write your solution here

}`,
      typescript: `function search(nums: number[], target: number): number {

  // Write your solution here

}`,
      python: `def search(nums, target):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    category: "Binary Search",
    difficulty: "Medium",
    description:
      "Given a rotated sorted array of distinct integers, return the index of target if it exists, otherwise return -1.",
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4"
      }
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "All values are unique."
    ],
    starterCode: {
      javascript: `function search(nums, target) {

  // Write your solution here

}`,
      typescript: `function search(nums: number[], target: number): number {

  // Write your solution here

}`,
      python: `def search(nums, target):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    category: "Binary Search",
    difficulty: "Medium",
    description:
      "Given a rotated sorted array of unique integers, return the minimum element.",
    examples: [
      {
        input: "nums = [3,4,5,1,2]",
        output: "1"
      }
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "All values are unique."
    ],
    starterCode: {
      javascript: `function findMin(nums) {

  // Write your solution here

}`,
      typescript: `function findMin(nums: number[]): number {

  // Write your solution here

}`,
      python: `def find_min(nums):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int findMin(int[] nums) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    category: "Binary Search",
    difficulty: "Hard",
    description:
      "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.0"
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.5"
      }
    ],
    constraints: [
      "nums1.length + nums2.length >= 1",
      "Both arrays are sorted."
    ],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {

  // Write your solution here

}`,
      typescript: `function findMedianSortedArrays(
  nums1: number[],
  nums2: number[]
): number {

  // Write your solution here

}`,
      python: `def find_median_sorted_arrays(nums1, nums2):

    # Write your solution here
    pass`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    double findMedianSortedArrays(
        vector<int>& nums1,
        vector<int>& nums2
    ) {

        // Write your solution here

    }
};`
    }
  },


  // =====================================================
  // TREES
  // =====================================================

  {
    id: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    category: "Trees",
    difficulty: "Easy",
    description:
      "Given the root of a binary tree, return its maximum depth.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3"
      }
    ],
    constraints: [
      "0 <= number of nodes <= 10^4"
    ],
    starterCode: {
      javascript: `function maxDepth(root) {

  // Write your solution here

}`,
      typescript: `function maxDepth(root: TreeNode | null): number {

  // Write your solution here

}`,
      python: `def max_depth(root):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    category: "Trees",
    difficulty: "Easy",
    description:
      "Given the root of a binary tree, invert the tree and return its root.",
    examples: [
      {
        input: "root = [4,2,7,1,3,6,9]",
        output: "[4,7,2,9,6,3,1]"
      }
    ],
    constraints: [
      "0 <= number of nodes <= 100"
    ],
    starterCode: {
      javascript: `function invertTree(root) {

  // Write your solution here

}`,
      typescript: `function invertTree(root: TreeNode | null): TreeNode | null {

  // Write your solution here

}`,
      python: `def invert_tree(root):

    # Write your solution here
    pass`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    category: "Trees",
    difficulty: "Medium",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]"
      }
    ],
    constraints: [
      "0 <= number of nodes <= 2000"
    ],
    starterCode: {
      javascript: `function levelOrder(root) {

  // Write your solution here

}`,
      typescript: `function levelOrder(root: TreeNode | null): number[][] {

  // Write your solution here

}`,
      python: `def level_order(root):

    # Write your solution here
    pass`,
      java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    category: "Trees",
    difficulty: "Medium",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree.",
    examples: [
      {
        input: "root = [2,1,3]",
        output: "true"
      },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false"
      }
    ],
    constraints: [
      "1 <= number of nodes <= 10^4"
    ],
    starterCode: {
      javascript: `function isValidBST(root) {

  // Write your solution here

}`,
      typescript: `function isValidBST(root: TreeNode | null): boolean {

  // Write your solution here

}`,
      python: `def is_valid_bst(root):

    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isValidBST(TreeNode root) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool isValidBST(TreeNode* root) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "lowest-common-ancestor-bst",
    title: "Lowest Common Ancestor of a Binary Search Tree",
    category: "Trees",
    difficulty: "Medium",
    description:
      "Given a binary search tree and two nodes p and q, find their lowest common ancestor.",
    examples: [
      {
        input: "root = [6,2,8,0,4,7,9], p = 2, q = 8",
        output: "6"
      }
    ],
    constraints: [
      "All node values are unique."
    ],
    starterCode: {
      javascript: `function lowestCommonAncestor(root, p, q) {

  // Write your solution here

}`,
      typescript: `function lowestCommonAncestor(
  root: TreeNode,
  p: TreeNode,
  q: TreeNode
): TreeNode {

  // Write your solution here

}`,
      python: `def lowest_common_ancestor(root, p, q):

    # Write your solution here
    pass`,
      java: `class Solution {
    public TreeNode lowestCommonAncestor(
        TreeNode root,
        TreeNode p,
        TreeNode q
    ) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    TreeNode* lowestCommonAncestor(
        TreeNode* root,
        TreeNode* p,
        TreeNode* q
    ) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    category: "Trees",
    difficulty: "Hard",
    description:
      "Given the root of a binary tree, return the maximum path sum of any non-empty path.",
    examples: [
      {
        input: "root = [1,2,3]",
        output: "6"
      },
      {
        input: "root = [-10,9,20,null,null,15,7]",
        output: "42"
      }
    ],
    constraints: [
      "1 <= number of nodes <= 3 * 10^4",
      "-1000 <= Node.val <= 1000"
    ],
    starterCode: {
      javascript: `function maxPathSum(root) {

  // Write your solution here

}`,
      typescript: `function maxPathSum(root: TreeNode | null): number {

  // Write your solution here

}`,
      python: `def max_path_sum(root):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int maxPathSum(TreeNode root) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int maxPathSum(TreeNode* root) {

        // Write your solution here

    }
};`
    }
  },


  // =====================================================
  // GRAPHS
  // =====================================================

  {
    id: "number-of-islands",
    title: "Number of Islands",
    category: "Graphs",
    difficulty: "Medium",
    description:
      "Given a 2D grid of '1's and '0's, return the number of islands.",
    examples: [
      {
        input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        output: "2"
      }
    ],
    constraints: [
      "1 <= rows, columns <= 300"
    ],
    starterCode: {
      javascript: `function numIslands(grid) {

  // Write your solution here

}`,
      typescript: `function numIslands(grid: string[][]): number {

  // Write your solution here

}`,
      python: `def num_islands(grid):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int numIslands(char[][] grid) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "clone-graph",
    title: "Clone Graph",
    category: "Graphs",
    difficulty: "Medium",
    description:
      "Given a reference of a node in a connected undirected graph, return a deep copy of the graph.",
    examples: [
      {
        input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        output: "[[2,4],[1,3],[2,4],[1,3]]"
      }
    ],
    constraints: [
      "The graph contains between 0 and 100 nodes."
    ],
    starterCode: {
      javascript: `function cloneGraph(node) {

  // Write your solution here

}`,
      typescript: `function cloneGraph(node: Node | null): Node | null {

  // Write your solution here

}`,
      python: `def clone_graph(node):

    # Write your solution here
    pass`,
      java: `class Solution {
    public Node cloneGraph(Node node) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    Node* cloneGraph(Node* node) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "course-schedule",
    title: "Course Schedule",
    category: "Graphs",
    difficulty: "Medium",
    description:
      "There are a total of numCourses courses. Determine if you can finish all courses given prerequisite relationships.",
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true"
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false"
      }
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000"
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {

  // Write your solution here

}`,
      typescript: `function canFinish(
  numCourses: number,
  prerequisites: number[][]
): boolean {

  // Write your solution here

}`,
      python: `def can_finish(num_courses, prerequisites):

    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean canFinish(
        int numCourses,
        int[][] prerequisites
    ) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool canFinish(
        int numCourses,
        vector<vector<int>>& prerequisites
    ) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "network-delay-time",
    title: "Network Delay Time",
    category: "Graphs",
    difficulty: "Medium",
    description:
      "Given a directed weighted graph, return the time it takes for all nodes to receive a signal sent from a given node.",
    examples: [
      {
        input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
        output: "2"
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "1 <= times.length <= 6000"
    ],
    starterCode: {
      javascript: `function networkDelayTime(times, n, k) {

  // Write your solution here

}`,
      typescript: `function networkDelayTime(
  times: number[][],
  n: number,
  k: number
): number {

  // Write your solution here

}`,
      python: `def network_delay_time(times, n, k):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int networkDelayTime(
        int[][] times,
        int n,
        int k
    ) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int networkDelayTime(
        vector<vector<int>>& times,
        int n,
        int k
    ) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "word-ladder",
    title: "Word Ladder",
    category: "Graphs",
    difficulty: "Hard",
    description:
      "Given beginWord, endWord and a dictionary of words, return the number of words in the shortest transformation sequence.",
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog"',
        output: "5"
      }
    ],
    constraints: [
      "1 <= word length <= 10",
      "All words have the same length."
    ],
    starterCode: {
      javascript: `function ladderLength(beginWord, endWord, wordList) {

  // Write your solution here

}`,
      typescript: `function ladderLength(
  beginWord: string,
  endWord: string,
  wordList: string[]
): number {

  // Write your solution here

}`,
      python: `def ladder_length(begin_word, end_word, word_list):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int ladderLength(
        String beginWord,
        String endWord,
        List<String> wordList
    ) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int ladderLength(
        string beginWord,
        string endWord,
        vector<string>& wordList
    ) {

        // Write your solution here

    }
};`
    }
  },


  // =====================================================
  // DYNAMIC PROGRAMMING
  // =====================================================

  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    category: "Dynamic Programming",
    difficulty: "Easy",
    description:
      "You are climbing a staircase. Each time you can climb either 1 or 2 steps. Return the number of distinct ways to reach the top.",
    examples: [
      {
        input: "n = 2",
        output: "2"
      },
      {
        input: "n = 3",
        output: "3"
      }
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    starterCode: {
      javascript: `function climbStairs(n) {

  // Write your solution here

}`,
      typescript: `function climbStairs(n: number): number {

  // Write your solution here

}`,
      python: `def climb_stairs(n):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int climbStairs(int n) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "coin-change",
    title: "Coin Change",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description:
      "Given an integer array coins and an integer amount, return the fewest number of coins needed to make up that amount.",
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3"
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1"
      }
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "0 <= amount <= 10^4"
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {

  // Write your solution here

}`,
      typescript: `function coinChange(
  coins: number[],
  amount: number
): number {

  // Write your solution here

}`,
      python: `def coin_change(coins, amount):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description:
      "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    examples: [
      {
        input: "nums = [10,9,2,5,3,7,101,18]",
        output: "4"
      }
    ],
    constraints: [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    starterCode: {
      javascript: `function lengthOfLIS(nums) {

  // Write your solution here

}`,
      typescript: `function lengthOfLIS(nums: number[]): number {

  // Write your solution here

}`,
      python: `def length_of_lis(nums):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "word-break",
    title: "Word Break",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description:
      "Given a string s and a dictionary wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true"
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000"
    ],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {

  // Write your solution here

}`,
      typescript: `function wordBreak(
  s: string,
  wordDict: string[]
): boolean {

  // Write your solution here

}`,
      python: `def word_break(s, word_dict):

    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean wordBreak(
        String s,
        List<String> wordDict
    ) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    bool wordBreak(
        string s,
        vector<string>& wordDict
    ) {

        // Write your solution here

    }
};`
    }
  },

  {
    id: "edit-distance",
    title: "Edit Distance",
    category: "Dynamic Programming",
    difficulty: "Hard",
    description:
      "Given two strings word1 and word2, return the minimum number of operations required to convert word1 into word2.",
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3"
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: "5"
      }
    ],
    constraints: [
      "0 <= word1.length, word2.length <= 500"
    ],
    starterCode: {
      javascript: `function minDistance(word1, word2) {

  // Write your solution here

}`,
      typescript: `function minDistance(
  word1: string,
  word2: string
): number {

  // Write your solution here

}`,
      python: `def min_distance(word1, word2):

    # Write your solution here
    pass`,
      java: `class Solution {
    public int minDistance(
        String word1,
        String word2
    ) {

        // Write your solution here

    }
}`,
      cpp: `class Solution {
public:
    int minDistance(
        string word1,
        string word2
    ) {

        // Write your solution here

    }
};`
    }
  }

];

module.exports = problems;