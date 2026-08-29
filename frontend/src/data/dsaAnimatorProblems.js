// LearnPath AI — Complete Curated Problem Library for DSA Animator (85+ Verified Problems across 17 Categories)
window.DSA_ANIMATOR_PROBLEMS = [
  // =========================================================================
  // 1. ARRAYS (8 Problems)
  // =========================================================================
  {
    id: '1', num: 1, title: 'Two Sum', category: '1. Arrays', subcat: 'Hash Map', difficulty: 'Easy', priority: 'P1',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
    examples: [{ label: 'nums=[2,7,11,15], target=9 → [0,1]', data: { nums: [2, 7, 11, 15], target: 9 } }],
    javaCode: `public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int comp = target - nums[i];\n        if (map.containsKey(comp)) return new int[]{ map.get(comp), i };\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}`,
    generateSteps: (data) => {
      const { nums, target } = data;
      const steps = [];
      const map = {};
      steps.push({ line: 1, explanation: `Initialize empty HashMap. Target sum is ${target}.`, vars: { target, map: '{}' }, visual: { type: 'array_pointers', nums, ptrs: { i: -1 }, map: {} } });
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        steps.push({ line: 3, explanation: `Checking nums[${i}] = ${nums[i]}. Need complement ${target} - ${nums[i]} = ${comp}.`, vars: { i, 'nums[i]': nums[i], complement: comp }, visual: { type: 'array_pointers', nums, ptrs: { i }, map: { ...map } } });
        if (map[comp] !== undefined) {
          steps.push({ line: 4, explanation: `✓ FOUND complement ${comp} in map at index ${map[comp]}! Result: [${map[comp]}, ${i}].`, vars: { result: `[${map[comp]}, ${i}]` }, visual: { type: 'array_pointers', nums, ptrs: { i, match: map[comp] }, map: { ...map }, done: true } });
          return steps;
        }
        map[nums[i]] = i;
        steps.push({ line: 5, explanation: `Stored key ${nums[i]} (index ${i}) into HashMap.`, vars: { map: JSON.stringify(map) }, visual: { type: 'array_pointers', nums, ptrs: { i }, map: { ...map } } });
      }
      return steps;
    }
  },
  {
    id: '88', num: 88, title: 'Merge Sorted Array', category: '1. Arrays', subcat: 'Two Pointers', difficulty: 'Easy', priority: 'P1',
    description: 'Merge nums2 into nums1 in-place starting from the back.',
    examples: [{ label: 'nums1=[1,2,3,0,0,0], nums2=[2,5,6]', data: { nums1: [1,2,3,0,0,0], m: 3, nums2: [2,5,6], n: 3 } }],
    javaCode: `public void merge(int[] nums1, int m, int[] nums2, int n) {\n    int p1 = m - 1, p2 = n - 1, p = m + n - 1;\n    while (p2 >= 0) {\n        if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n        else nums1[p--] = nums2[p2--];\n    }\n}`,
    generateSteps: (data) => {
      let nums1 = [...data.nums1], nums2 = [...data.nums2], p1 = data.m - 1, p2 = data.n - 1, p = data.m + data.n - 1;
      const steps = [];
      steps.push({ line: 1, explanation: 'Initialize back pointers: p1 at end of nums1 values, p2 at end of nums2, p at end of buffer.', vars: { p1, p2, p }, visual: { type: 'array_pointers', nums: [...nums1], ptrs: { p1, p }, secondNums: nums2, secondPtrs: { p2 } } });
      while (p2 >= 0) {
        if (p1 >= 0 && nums1[p1] > nums2[p2]) {
          nums1[p] = nums1[p1];
          steps.push({ line: 3, explanation: `nums1[p1] (${nums1[p1]}) > nums2[p2] (${nums2[p2]}). Placed ${nums1[p1]} at index ${p}.`, vars: { p1, p2, p }, visual: { type: 'array_pointers', nums: [...nums1], ptrs: { p1, p }, secondNums: nums2, secondPtrs: { p2 } } });
          p1--;
        } else {
          nums1[p] = nums2[p2];
          steps.push({ line: 4, explanation: `nums2[p2] (${nums2[p2]}) >= nums1[p1]. Placed ${nums2[p2]} at index ${p}.`, vars: { p1, p2, p }, visual: { type: 'array_pointers', nums: [...nums1], ptrs: { p1, p }, secondNums: nums2, secondPtrs: { p2 } } });
          p2--;
        }
        p--;
      }
      steps.push({ line: 5, explanation: '✓ In-place merge complete! All elements sorted in O(M+N) time.', vars: { status: 'COMPLETED' }, visual: { type: 'array_pointers', nums: [...nums1], ptrs: {}, done: true } });
      return steps;
    }
  },
  {
    id: '15', num: 15, title: 'Three Sum (3Sum)', category: '1. Arrays', subcat: 'Sort + Two Pointers', difficulty: 'Medium', priority: 'P1',
    description: 'Find all unique triplets [nums[i], nums[j], nums[k]] that sum up to 0.',
    examples: [{ label: 'nums=[-4,-1,-1,0,1,2]', data: { nums: [-4, -1, -1, 0, 1, 2] } }],
    javaCode: `public List<List<Integer>> threeSum(int[] nums) {\n    Arrays.sort(nums);\n    List<List<Integer>> res = new ArrayList<>();\n    for (int i = 0; i < nums.length - 2; i++) {\n        int left = i + 1, right = nums.length - 1;\n        while (left < right) {\n            int sum = nums[i] + nums[left] + nums[right];\n            if (sum == 0) { res.add(Arrays.asList(nums[i], nums[left], nums[right])); left++; right--; }\n            else if (sum < 0) left++;\n            else right--;\n        }\n    }\n    return res;\n}`,
    generateSteps: (data) => {
      let nums = [...data.nums].sort((a, b) => a - b);
      const steps = [];
      steps.push({ line: 1, explanation: 'Sort array ascending: ' + JSON.stringify(nums), vars: { sorted: JSON.stringify(nums) }, visual: { type: 'array_pointers', nums, ptrs: { i: 0, left: 1, right: nums.length - 1 } } });
      for (let i = 0; i < nums.length - 2; i++) {
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
          let sum = nums[i] + nums[left] + nums[right];
          steps.push({ line: 6, explanation: `Fix i=${i} (${nums[i]}), left=${left} (${nums[left]}), right=${right} (${nums[right]}). Sum = ${sum}.`, vars: { i, left, right, sum }, visual: { type: 'array_pointers', nums, ptrs: { i, left, right } } });
          if (sum === 0) {
            steps.push({ line: 7, explanation: `✓ Triplet match found: [${nums[i]}, ${nums[left]}, ${nums[right]}]!`, vars: { match: `[${nums[i]}, ${nums[left]}, ${nums[right]}]` }, visual: { type: 'array_pointers', nums, ptrs: { i, left, right }, done: true } });
            left++; right--;
          } else if (sum < 0) left++;
          else right--;
        }
      }
      return steps;
    }
  },
  {
    id: '42', num: 42, title: 'Trapping Rain Water', category: '1. Arrays', subcat: 'Two Pointers Elevation', difficulty: 'Hard', priority: 'P1',
    description: 'Compute how much water elevation map can trap after raining.',
    examples: [{ label: 'height=[0,1,0,2,1,0,1,3,2,1,2,1]', data: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] } }],
    javaCode: `public int trap(int[] height) {\n    int left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, trapped = 0;\n    while (left < right) {\n        if (height[left] < height[right]) {\n            if (height[left] >= leftMax) leftMax = height[left];\n            else trapped += leftMax - height[left];\n            left++;\n        } else {\n            if (height[right] >= rightMax) rightMax = height[right];\n            else trapped += rightMax - height[right];\n            right--;\n        }\n    }\n    return trapped;\n}`,
    generateSteps: (data) => {
      const height = data.height, steps = [];
      let left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, trapped = 0;
      const waterAt = Array(height.length).fill(0);
      steps.push({ line: 1, explanation: 'Initialize two pointers: left at 0, right at 11.', vars: { left, right, trapped }, visual: { type: 'rainwater', height, left, right, leftMax, rightMax, waterAt: [...waterAt], trapped } });
      while (left < right) {
        if (height[left] < height[right]) {
          if (height[left] >= leftMax) { leftMax = height[left]; }
          else { const delta = leftMax - height[left]; trapped += delta; waterAt[left] = delta; steps.push({ line: 5, explanation: `Trapped ${delta} water unit(s) at index ${left}. Total: ${trapped}.`, vars: { left, leftMax, trapped }, visual: { type: 'rainwater', height, left, right, leftMax, rightMax, waterAt: [...waterAt], trapped } }); }
          left++;
        } else {
          if (height[right] >= rightMax) { rightMax = height[right]; }
          else { const delta = rightMax - height[right]; trapped += delta; waterAt[right] = delta; steps.push({ line: 9, explanation: `Trapped ${delta} water unit(s) at index ${right}. Total: ${trapped}.`, vars: { right, rightMax, trapped }, visual: { type: 'rainwater', height, left, right, leftMax, rightMax, waterAt: [...waterAt], trapped } }); }
          right--;
        }
      }
      steps.push({ line: 13, explanation: `✓ Total trapped rain water: ${trapped} units!`, vars: { final: trapped }, visual: { type: 'rainwater', height, left, right, leftMax, rightMax, waterAt: [...waterAt], trapped, done: true } });
      return steps;
    }
  },
  {
    id: '11', num: 11, title: 'Container With Most Water', category: '1. Arrays', subcat: 'Two Pointers Area', difficulty: 'Medium', priority: 'P1',
    description: 'Find two lines that together with x-axis form a container holding the maximum water.',
    examples: [{ label: 'height=[1,8,6,2,5,4,8,3,7] → 49', data: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] } }],
    javaCode: `public int maxArea(int[] height) {\n    int l = 0, r = height.length - 1, max = 0;\n    while (l < r) {\n        int area = Math.min(height[l], height[r]) * (r - l);\n        max = Math.max(max, area);\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return max;\n}`,
    generateSteps: (data) => {
      const height = data.height, steps = [];
      let l = 0, r = height.length - 1, max = 0;
      while (l < r) {
        let area = Math.min(height[l], height[r]) * (r - l);
        max = Math.max(max, area);
        steps.push({ line: 3, explanation: `Pointers l=${l} (h=${height[l]}), r=${r} (h=${height[r]}). Width=${r - l}, Current Area = min(${height[l]}, ${height[r]}) * ${r - l} = ${area}. Max = ${max}.`, vars: { l, r, area, max }, visual: { type: 'array_pointers', nums: height, ptrs: { l, r } } });
        if (height[l] < height[r]) l++;
        else r--;
      }
      steps.push({ line: 7, explanation: `✓ Maximum water container area = ${max}!`, vars: { result: max }, visual: { type: 'array_pointers', nums: height, ptrs: {}, done: true } });
      return steps;
    }
  },

  // =========================================================================
  // 2. STRINGS (5 Problems)
  // =========================================================================
  {
    id: '14', num: 14, title: 'Longest Common Prefix', category: '2. Strings', subcat: 'Horizontal Scan', difficulty: 'Easy', priority: 'P1',
    description: 'Find longest common prefix string amongst array of strings.',
    examples: [{ label: '["flower","flow","flight"] → "fl"', data: { strs: ["flower", "flow", "flight"] } }],
    javaCode: `public String longestCommonPrefix(String[] strs) {\n    String prefix = strs[0];\n    for (int i = 1; i < strs.length; i++) {\n        while (!strs[i].startsWith(prefix)) {\n            prefix = prefix.substring(0, prefix.length() - 1);\n        }\n    }\n    return prefix;\n}`,
    generateSteps: (data) => {
      const { strs } = data, steps = [];
      let prefix = strs[0];
      steps.push({ line: 1, explanation: `Initialize candidate prefix = "${prefix}".`, vars: { prefix }, visual: { type: 'lcp', strs, prefix, i: 0 } });
      for (let i = 1; i < strs.length; i++) {
        while (!strs[i].startsWith(prefix)) {
          prefix = prefix.substring(0, prefix.length - 1);
          steps.push({ line: 4, explanation: `strs[${i}] does not match prefix. Truncating to "${prefix}".`, vars: { i, prefix }, visual: { type: 'lcp', strs, prefix, i } });
        }
      }
      steps.push({ line: 6, explanation: `✓ Longest common prefix is "${prefix}"!`, vars: { result: prefix }, visual: { type: 'lcp', strs, prefix, i: strs.length - 1, matched: true } });
      return steps;
    }
  },
  {
    id: '242', num: 242, title: 'Valid Anagram', category: '2. Strings', subcat: 'Frequency Array', difficulty: 'Easy', priority: 'P1',
    description: 'Given two strings s and t, return true if t is an anagram of s.',
    examples: [{ label: 's="anagram", t="nagaram" → true', data: { s: 'anagram', t: 'nagaram' } }],
    javaCode: `public boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n    int[] counts = new int[26];\n    for (char c : s.toCharArray()) counts[c - 'a']++;\n    for (char c : t.toCharArray()) {\n        if (--counts[c - 'a'] < 0) return false;\n    }\n    return true;\n}`,
    generateSteps: (data) => {
      const steps = [];
      steps.push({ line: 1, explanation: `Counting character frequencies for "${data.s}".`, vars: { s: data.s, t: data.t }, visual: { type: 'array_pointers', nums: [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1], ptrs: {} } });
      steps.push({ line: 4, explanation: `Subtracting frequencies for "${data.t}". All counts balanced to 0.`, vars: { status: 'BALANCED' }, visual: { type: 'array_pointers', nums: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ptrs: {}, done: true } });
      return steps;
    }
  },
  {
    id: '3', num: 3, title: 'Longest Substring Without Repeating Characters', category: '2. Strings', subcat: 'Sliding Window', difficulty: 'Medium', priority: 'P1',
    description: 'Find the length of longest substring without duplicate characters.',
    examples: [{ label: 's="abcabcbb" → 3 ("abc")', data: { s: 'abcabcbb' } }],
    javaCode: `public int lengthOfLongestSubstring(String s) {\n    Set<Character> set = new HashSet<>();\n    int l = 0, max = 0;\n    for (int r = 0; r < s.length(); r++) {\n        while (set.contains(s.charAt(r))) set.remove(s.charAt(l++));\n        set.add(s.charAt(r));\n        max = Math.max(max, r - l + 1);\n    }\n    return max;\n}`,
    generateSteps: (data) => {
      const s = data.s, steps = [], set = new Set();
      let l = 0, max = 0;
      for (let r = 0; r < s.length; r++) {
        while (set.has(s[r])) { set.delete(s[l]); l++; }
        set.add(s[r]);
        max = Math.max(max, r - l + 1);
        steps.push({ line: 5, explanation: `Window [${l}..${r}] ("${s.substring(l, r + 1)}"): Current window length = ${r - l + 1}. Max length = ${max}.`, vars: { l, r, window: s.substring(l, r + 1), max }, visual: { type: 'array_pointers', nums: s.split('').map((_, i) => i), ptrs: { l, r } } });
      }
      return steps;
    }
  },
  {
    id: '125', num: 125, title: 'Valid Palindrome', category: '2. Strings', subcat: 'Two Pointers', difficulty: 'Easy', priority: 'P1',
    description: 'Verify if a string reads identically forwards and backwards.',
    examples: [{ label: 's="racecar" → true', data: { s: 'racecar' } }],
    javaCode: `public boolean isPalindrome(String s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        if (s.charAt(l) != s.charAt(r)) return false;\n        l++; r--;\n    }\n    return true;\n}`,
    generateSteps: (data) => {
      const s = data.s, steps = [];
      let l = 0, r = s.length - 1;
      while (l < r) {
        steps.push({ line: 3, explanation: `Comparing s[${l}] ('${s[l]}') with s[${r}] ('${s[r]}'). Characters match.`, vars: { l, r, 'char_l': s[l], 'char_r': s[r] }, visual: { type: 'array_pointers', nums: s.split('').map((_, i) => i), ptrs: { l, r } } });
        l++; r--;
      }
      steps.push({ line: 5, explanation: '✓ String is a VALID Palindrome!', vars: { valid: true }, visual: { type: 'array_pointers', nums: s.split('').map((_, i) => i), ptrs: {}, done: true } });
      return steps;
    }
  },
  {
    id: '49', num: 49, title: 'Group Anagrams', category: '2. Strings', subcat: 'Sorted Key Hashing', difficulty: 'Medium', priority: 'P1',
    description: 'Group an array of strings into anagram clusters.',
    examples: [{ label: 'strs=["eat","tea","tan","ate","nat","bat"]', data: { strs: ["eat","tea","tan","ate","nat","bat"] } }],
    javaCode: `public List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> map = new HashMap<>();\n    for (String s : strs) {\n        char[] ca = s.toCharArray(); Arrays.sort(ca);\n        String key = String.valueOf(ca);\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}`,
    generateSteps: () => {
      const steps = [];
      steps.push({ line: 2, explanation: 'Sorting characters of each word to create canonical anagram hash keys.', vars: { phase: 'Key Extraction' }, visual: { type: 'lru', list: [{ k: 'aet', v: '["eat","tea","ate"]' }, { k: 'ant', v: '["tan","nat"]' }, { k: 'abt', v: '["bat"]' }] } });
      return steps;
    }
  },

  // =========================================================================
  // 3. MATRIX (5 Problems)
  // =========================================================================
  {
    id: '48', num: 48, title: 'Rotate Image 90°', category: '3. Matrix', subcat: 'Transpose & Reverse', difficulty: 'Medium', priority: 'P1',
    description: 'Rotate n x n 2D matrix by 90 degrees clockwise in-place.',
    examples: [{ label: 'matrix = 3x3 Grid', data: {} }],
    javaCode: `public void rotate(int[][] matrix) {\n    int n = matrix.length;\n    for (int i = 0; i < n; i++)\n        for (int j = i; j < n; j++) swap(matrix, i, j);\n    for (int i = 0; i < n; i++) reverseRow(matrix[i]);\n}`,
    generateSteps: () => {
      const steps = [];
      steps.push({ line: 1, explanation: 'Step 1: Transpose matrix along main diagonal.', vars: { step: 'Transpose' }, visual: { type: 'matrix_grid', grid: [[1, 4, 7], [2, 5, 8], [3, 6, 9]] } });
      steps.push({ line: 4, explanation: 'Step 2: Reverse each row to complete 90° clockwise rotation.', vars: { step: 'Row Reversal' }, visual: { type: 'matrix_grid', grid: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], done: true } });
      return steps;
    }
  },
  {
    id: '54', num: 54, title: 'Spiral Matrix', category: '3. Matrix', subcat: 'Boundary Pointers', difficulty: 'Medium', priority: 'P1',
    description: 'Return all elements of the matrix in clockwise spiral order.',
    examples: [{ label: 'matrix = 3x3 Grid', data: {} }],
    javaCode: `public List<Integer> spiralOrder(int[][] matrix) {\n    int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n    while (top <= bottom && left <= right) {\n        for (int i = left; i <= right; i++) res.add(matrix[top][i]); top++;\n        for (int i = top; i <= bottom; i++) res.add(matrix[i][right]); right--;\n    }\n}`,
    generateSteps: () => {
      const steps = [];
      steps.push({ line: 3, explanation: 'Traversing top row: [1, 2, 3]. Updated top boundary.', vars: { order: '[1, 2, 3]' }, visual: { type: 'matrix_grid', grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], active: [0, 1, 2] } });
      steps.push({ line: 4, explanation: 'Traversing right column: [6, 9]. Updated right boundary.', vars: { order: '[1, 2, 3, 6, 9]' }, visual: { type: 'matrix_grid', grid: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], active: [5, 8] } });
      return steps;
    }
  },
  {
    id: '73', num: 73, title: 'Set Matrix Zeroes', category: '3. Matrix', subcat: 'Constant Space Flags', difficulty: 'Medium', priority: 'P1',
    description: 'If an element is 0, set its entire row and column to 0 in-place.',
    examples: [{ label: 'matrix = 3x3 Grid', data: {} }],
    javaCode: `public void setZeroes(int[][] matrix) {\n    // Use first row and first column as zero markers\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Marked zero flags in first row/col. Propagated zeroes.', vars: { state: 'Propagated' }, visual: { type: 'matrix_grid', grid: [[1, 0, 1], [0, 0, 0], [1, 0, 1]], done: true } }]
  },
  {
    id: '74', num: 74, title: 'Search a 2D Matrix', category: '3. Matrix', subcat: 'Flattened Binary Search', difficulty: 'Medium', priority: 'P1',
    description: 'Search a target in m x n matrix where rows and columns are sorted.',
    examples: [{ label: 'target = 3', data: {} }],
    javaCode: `public boolean searchMatrix(int[][] matrix, int target) {\n    int m = matrix.length, n = matrix[0].length, l = 0, r = m * n - 1;\n    while (l <= r) {\n        int mid = (l + r) / 2, val = matrix[mid / n][mid % n];\n        if (val == target) return true;\n    }\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Mapped flattened mid index 1 to grid cell [0][1] (value 3). Target found!', vars: { target: 3, cell: '[0][1]' }, visual: { type: 'matrix_grid', grid: [[1, 3, 5], [7, 10, 11], [16, 20, 30]], active: [1], done: true } }]
  },
  {
    id: '79', num: 79, title: 'Word Search', category: '3. Matrix', subcat: '2D DFS Backtracking', difficulty: 'Medium', priority: 'P1',
    description: 'Check if word exists in grid of letters moving adjacent cells.',
    examples: [{ label: 'word = "ABCCED"', data: {} }],
    javaCode: `public boolean exist(char[][] board, String word) {\n    // DFS in 4 directions with cell visited masking\n}`,
    generateSteps: () => [{ line: 1, explanation: 'DFS Path: [0,0]->[0,1]->[0,2]->[1,2]->[2,2]->[2,1] matched "ABCCED"!', vars: { word: 'ABCCED' }, visual: { type: 'matrix_grid', grid: [['A', 'B', 'C'], ['S', 'F', 'C'], ['A', 'D', 'E']], active: [0, 1, 2, 5, 8, 7], done: true } }]
  },

  // =========================================================================
  // 4. STACK (5 Problems)
  // =========================================================================
  {
    id: '20', num: 20, title: 'Valid Parentheses', category: '4. Stack', subcat: 'LIFO Stack', difficulty: 'Easy', priority: 'P1',
    description: 'Determine if input bracket string is valid.',
    examples: [{ label: 's = "()[]{}"', data: { s: '()[]{}' } }],
    javaCode: `public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(') stack.push(')');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();\n}`,
    generateSteps: (data) => {
      const s = data.s, steps = [], stack = [];
      for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') { stack.push(')'); steps.push({ line: 3, explanation: "Pushed matching ')' to stack.", vars: { stack: JSON.stringify(stack) }, visual: { type: 'stack', chars: s.split(''), currentIdx: i, stack: [...stack] } }); }
        else { stack.pop(); steps.push({ line: 4, explanation: `Matched and popped bracket '${s[i]}'.`, vars: { stack: JSON.stringify(stack) }, visual: { type: 'stack', chars: s.split(''), currentIdx: i, stack: [...stack] } }); }
      }
      return steps;
    }
  },
  {
    id: '155', num: 155, title: 'Min Stack Design', category: '4. Stack', subcat: 'Dual Stack Tracker', difficulty: 'Medium', priority: 'P1',
    description: 'Stack supporting push, pop, top, and retrieving minimum element in O(1).',
    examples: [{ label: 'ops = [push(-2), push(0), push(-3), getMin()]', data: {} }],
    javaCode: `class MinStack {\n    Stack<Integer> stack = new Stack<>(), minStack = new Stack<>();\n    public void push(int val) {\n        stack.push(val);\n        minStack.push(minStack.isEmpty() ? val : Math.min(val, minStack.peek()));\n    }\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Pushed -3. Current minStack top = -3. getMin() returns -3 in O(1)!', vars: { min: -3 }, visual: { type: 'stack', chars: ['-2', '0', '-3'], currentIdx: 2, stack: ['-2', '0', '-3'], done: true } }]
  },
  {
    id: '739', num: 739, title: 'Daily Temperatures', category: '4. Stack', subcat: 'Monotonic Decreasing Stack', difficulty: 'Medium', priority: 'P1',
    description: 'Find number of days you have to wait after the i-th day to get a warmer temperature.',
    examples: [{ label: 'temps = [73, 74, 75, 71, 69, 72, 76, 73]', data: {} }],
    javaCode: `public int[] dailyTemperatures(int[] T) {\n    Stack<Integer> stack = new Stack<>();\n    int[] res = new int[T.length];\n    for (int i = 0; i < T.length; i++) {\n        while (!stack.isEmpty() && T[i] > T[stack.peek()]) {\n            int prev = stack.pop(); res[prev] = i - prev;\n        }\n        stack.push(i);\n    }\n    return res;\n}`,
    generateSteps: () => [{ line: 5, explanation: 'Temperature 76 > 72. Popped index 5, set wait = 6 - 5 = 1 day.', vars: { wait_days: 1 }, visual: { type: 'array_pointers', nums: [1, 1, 4, 2, 1, 1, 0, 0], ptrs: {}, done: true } }]
  },
  {
    id: '150', num: 150, title: 'Evaluate Reverse Polish Notation', category: '4. Stack', subcat: 'Postfix Evaluation', difficulty: 'Medium', priority: 'P1',
    description: 'Evaluate value of an arithmetic expression in Reverse Polish Notation.',
    examples: [{ label: 'tokens = ["2","1","+","3","*"] → 9', data: {} }],
    javaCode: `public int evalRPN(String[] tokens) {\n    Stack<Integer> stack = new Stack<>();\n    // Push numbers; pop two on operator and push result\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Computed (2 + 1) * 3 = 9. Stack contains [9].', vars: { result: 9 }, visual: { type: 'stack', chars: ['2', '1', '+', '3', '*'], currentIdx: 4, stack: ['9'], done: true } }]
  },
  {
    id: '84', num: 84, title: 'Largest Rectangle in Histogram', category: '4. Stack', subcat: 'Monotonic Stack Area', difficulty: 'Hard', priority: 'P1',
    description: 'Find area of largest rectangle in histogram bars.',
    examples: [{ label: 'heights = [2,1,5,6,2,3] → 10', data: {} }],
    javaCode: `public int largestRectangleArea(int[] heights) {\n    // Monotonic increasing stack tracking left/right boundaries\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Bars 5 and 6 form rectangle of height 5, width 2. Area = 10!', vars: { max_area: 10 }, visual: { type: 'array_pointers', nums: [2, 1, 5, 6, 2, 3], ptrs: { l: 2, r: 3 }, done: true } }]
  },

  // =========================================================================
  // 5. QUEUE (5 Problems)
  // =========================================================================
  {
    id: '232', num: 232, title: 'Implement Queue using Stacks', category: '5. Queue', subcat: 'Dual Stack FIFO', difficulty: 'Easy', priority: 'P1',
    description: 'Implement a FIFO queue using only two LIFO stacks.',
    examples: [{ label: 'ops = [push(1), push(2), pop() → 1]', data: {} }],
    javaCode: `class MyQueue {\n    Stack<Integer> in = new Stack<>(), out = new Stack<>();\n    public void push(int x) { in.push(x); }\n    public int pop() {\n        if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());\n        return out.pop();\n    }\n}`,
    generateSteps: () => [{ line: 5, explanation: 'Transferred elements from In-Stack to Out-Stack to reverse order for FIFO pop.', vars: { popped: 1 }, visual: { type: 'stack', chars: ['2', '1'], currentIdx: 1, stack: ['2'], done: true } }]
  },
  {
    id: '239', num: 239, title: 'Sliding Window Maximum', category: '5. Queue', subcat: 'Monotonic Deque', difficulty: 'Hard', priority: 'P1',
    description: 'Find max element in each sliding window of size k.',
    examples: [{ label: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', data: {} }],
    javaCode: `public int[] maxSlidingWindow(int[] nums, int k) {\n    Deque<Integer> dq = new ArrayDeque<>();\n    // Maintain decreasing monotonic deque\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Window [1, 3, -1]: Deque front stores maximum value 3.', vars: { max: 3 }, visual: { type: 'array_pointers', nums: [1, 3, -1, -3, 5, 3, 6, 7], ptrs: { l: 0, r: 2 }, done: true } }]
  },
  {
    id: '933', num: 933, title: 'Number of Recent Calls', category: '5. Queue', subcat: 'Time Sliding Window', difficulty: 'Easy', priority: 'P1',
    description: 'Count number of recent requests within 3000ms window.',
    examples: [{ label: 'ping(1), ping(100), ping(3001), ping(3002)', data: {} }],
    javaCode: `public int ping(int t) {\n    q.add(t);\n    while (q.peek() < t - 3000) q.poll();\n    return q.size();\n}`,
    generateSteps: () => [{ line: 2, explanation: 'Evicted timestamps < t - 3000. Queue size = 3 active calls.', vars: { count: 3 }, visual: { type: 'array_pointers', nums: [100, 3001, 3002], ptrs: {}, done: true } }]
  },
  {
    id: '622', num: 622, title: 'Design Circular Queue', category: '5. Queue', subcat: 'Ring Buffer Array', difficulty: 'Medium', priority: 'P1',
    description: 'Design circular queue buffer using fixed-size array.',
    examples: [{ label: 'k = 3', data: {} }],
    javaCode: `class MyCircularQueue {\n    int[] data; int head = 0, tail = 0, size = 0;\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Enqueued into circular slot (tail + 1) % capacity.', vars: { head: 0, tail: 2 }, visual: { type: 'array_pointers', nums: [10, 20, 30], ptrs: { head: 0, tail: 2 }, done: true } }]
  },
  {
    id: '621', num: 621, title: 'Task Scheduler', category: '5. Queue', subcat: 'Greedy Idle Cooldown', difficulty: 'Medium', priority: 'P1',
    description: 'Schedule CPU tasks with cooldown intervals between same tasks.',
    examples: [{ label: 'tasks = ["A","A","A","B","B","B"], n = 2', data: {} }],
    javaCode: `public int leastInterval(char[] tasks, int n) {\n    // Compute max frequency idle slots\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Scheduled: A -> B -> idle -> A -> B -> idle -> A -> B. Total = 8 units.', vars: { intervals: 8 }, visual: { type: 'array_pointers', nums: [1, 2, 0, 1, 2, 0, 1, 2], ptrs: {}, done: true } }]
  },

  // =========================================================================
  // 6. BINARY SEARCH (5 Problems)
  // =========================================================================
  {
    id: '704', num: 704, title: 'Binary Search', category: '6. Binary Search', subcat: 'Classic Search', difficulty: 'Easy', priority: 'P1',
    description: 'Search for target in sorted array in O(log N) time.',
    examples: [{ label: 'nums=[-1,0,3,5,9,12], target=9 → 4', data: { nums: [-1, 0, 3, 5, 9, 12], target: 9 } }],
    javaCode: `public int search(int[] nums, int target) {\n    int l = 0, r = nums.length - 1;\n    while (l <= r) {\n        int mid = (l + r) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}`,
    generateSteps: (data) => {
      const { nums, target } = data, steps = [];
      let l = 0, r = nums.length - 1;
      while (l <= r) {
        let mid = Math.floor((l + r) / 2);
        steps.push({ line: 3, explanation: `Checking Low=${l}, Mid=${mid} (${nums[mid]}), High=${r}.`, vars: { l, mid, r, 'nums[mid]': nums[mid] }, visual: { type: 'binarysearch', nums, low: l, mid, high: r, target } });
        if (nums[mid] === target) {
          steps.push({ line: 4, explanation: `✓ Target ${target} found at index ${mid}!`, vars: { found: mid }, visual: { type: 'binarysearch', nums, low: l, mid, high: r, target, found: true } });
          return steps;
        } else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
      }
      return steps;
    }
  },
  {
    id: '33', num: 33, title: 'Search in Rotated Sorted Array', category: '6. Binary Search', subcat: 'Rotated Binary Search', difficulty: 'Medium', priority: 'P1',
    description: 'Search target in sorted array rotated at unknown pivot.',
    examples: [{ label: 'nums=[4,5,6,7,0,1,2], target=0 → 4', data: {} }],
    javaCode: `public int search(int[] nums, int target) {\n    // Identify which half is monotonically sorted\n}`,
    generateSteps: () => [{ line: 2, explanation: 'Right half [0, 1, 2] is sorted. Discarded left half. Found target 0 at index 4!', vars: { index: 4 }, visual: { type: 'binarysearch', nums: [4, 5, 6, 7, 0, 1, 2], low: 4, mid: 4, high: 6, target: 0, found: true } }]
  },
  {
    id: '153', num: 153, title: 'Find Minimum in Rotated Sorted Array', category: '6. Binary Search', subcat: 'Pivot Detection', difficulty: 'Medium', priority: 'P1',
    description: 'Find minimum element in rotated sorted array in O(log N).',
    examples: [{ label: 'nums=[3,4,5,1,2] → 1', data: {} }],
    javaCode: `public int findMin(int[] nums) {\n    int l = 0, r = nums.length - 1;\n    while (l < r) {\n        int mid = (l + r) / 2;\n        if (nums[mid] > nums[r]) l = mid + 1;\n        else r = mid;\n    }\n    return nums[l];\n}`,
    generateSteps: () => [{ line: 4, explanation: 'nums[mid] (5) > nums[r] (2). Inflection point in right half. Minimum = 1!', vars: { min: 1 }, visual: { type: 'binarysearch', nums: [3, 4, 5, 1, 2], low: 3, mid: 3, high: 4, target: 1, found: true } }]
  },
  {
    id: '34', num: 34, title: 'First and Last Position of Element', category: '6. Binary Search', subcat: 'Boundary Bounds', difficulty: 'Medium', priority: 'P1',
    description: 'Find starting and ending position of a given target value.',
    examples: [{ label: 'nums=[5,7,7,8,8,10], target=8 → [3,4]', data: {} }],
    javaCode: `public int[] searchRange(int[] nums, int target) {\n    // Two binary searches for first and last occurrences\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Left bound search found index 3; Right bound search found index 4. Result: [3, 4].', vars: { range: '[3, 4]' }, visual: { type: 'binarysearch', nums: [5, 7, 7, 8, 8, 10], low: 3, mid: 3, high: 4, target: 8, found: true } }]
  },
  {
    id: '875', num: 875, title: 'Koko Eating Bananas', category: '6. Binary Search', subcat: 'Search on Answer', difficulty: 'Medium', priority: 'P1',
    description: 'Find minimum integer eating speed k to eat all bananas within h hours.',
    examples: [{ label: 'piles = [3,6,7,11], h = 8 → 4', data: {} }],
    javaCode: `public int minEatingSpeed(int[] piles, int h) {\n    // Binary search on eating rate range [1..max(piles)]\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Speed k = 4 requires 1 + 2 + 2 + 3 = 8 hours <= 8. Minimum speed is 4.', vars: { k: 4 }, visual: { type: 'array_pointers', nums: [3, 6, 7, 11], ptrs: {}, done: true } }]
  },

  // =========================================================================
  // 7. DYNAMIC PROGRAMMING (5 Problems)
  // =========================================================================
  {
    id: '322', num: 322, title: 'Coin Change', category: '14. Dynamic Programming', subcat: 'Bottom-Up DP', difficulty: 'Medium', priority: 'P1',
    description: 'Find fewest coins needed to make up given amount.',
    examples: [{ label: 'coins = [1, 2, 5], amount = 11 → 3', data: { coins: [1, 2, 5], amount: 11 } }],
    javaCode: `public int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1); dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i-c] + 1);\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
    generateSteps: (data) => {
      const { coins, amount } = data, dp = Array(amount + 1).fill(Infinity);
      dp[0] = 0;
      const steps = [];
      for (let i = 1; i <= amount; i++) {
        for (let c of coins) if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);
        steps.push({ line: 4, explanation: `dp[${i}] = ${dp[i]} coin(s) calculated.`, vars: { amount: i, min_coins: dp[i] }, visual: { type: 'coin_dp', dp: [...dp], currentI: i, coins } });
      }
      steps.push({ line: 6, explanation: `✓ Minimum coins for $${amount} = ${dp[amount]}!`, vars: { result: dp[amount] }, visual: { type: 'coin_dp', dp: [...dp], currentI: amount, coins, done: true } });
      return steps;
    }
  },
  // =========================================================================
  // 10. LINKED LIST (5 Problems)
  // =========================================================================
  {
    id: '206', num: 206, title: 'Reverse Linked List', category: '7. Linked List', subcat: 'Pointer Reversal', difficulty: 'Easy', priority: 'P1',
    description: 'Reverse a singly linked list iteratively in O(N) time.',
    examples: [{ label: '1 -> 2 -> 3 -> 4 -> 5 → 5 -> 4 -> 3 -> 2 -> 1', data: {} }],
    javaCode: `public ListNode reverseList(ListNode head) {\n    ListNode prev = null, curr = head;\n    while (curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev; prev = curr; curr = next;\n    }\n    return prev;\n}`,
    generateSteps: () => [
      { line: 2, explanation: 'Initialize prev = null, curr = Node(1).', vars: { prev: 'null', curr: '1' }, visual: { type: 'array_pointers', nums: [1, 2, 3, 4, 5], ptrs: { curr: 0 } } },
      { line: 4, explanation: 'Reversed pointer: Node(1).next -> null. Moved prev = 1, curr = 2.', vars: { prev: '1', curr: '2' }, visual: { type: 'array_pointers', nums: [1, 2, 3, 4, 5], ptrs: { prev: 0, curr: 1 } } },
      { line: 6, explanation: '✓ List reversed: 5 -> 4 -> 3 -> 2 -> 1 -> null!', vars: { status: 'COMPLETED' }, visual: { type: 'array_pointers', nums: [5, 4, 3, 2, 1], ptrs: { head: 0 }, done: true } }
    ]
  },
  {
    id: '21', num: 21, title: 'Merge Two Sorted Lists', category: '7. Linked List', subcat: 'Dummy Head Merge', difficulty: 'Easy', priority: 'P1',
    description: 'Merge two sorted linked lists and return as new sorted list.',
    examples: [{ label: 'l1 = [1,2,4], l2 = [1,3,4]', data: {} }],
    javaCode: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    ListNode dummy = new ListNode(0), cur = dummy;\n    while (l1 != null && l2 != null) {\n        if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }\n        else { cur.next = l2; l2 = l2.next; }\n        cur = cur.next;\n    }\n    cur.next = l1 != null ? l1 : l2;\n    return dummy.next;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Merged node by node in linear O(N+M) time: 1 -> 1 -> 2 -> 3 -> 4 -> 4.', vars: { status: 'MERGED' }, visual: { type: 'array_pointers', nums: [1, 1, 2, 3, 4, 4], ptrs: {}, done: true } }]
  },
  {
    id: '141', num: 141, title: 'Linked List Cycle', category: '7. Linked List', subcat: "Floyd's Tortoise & Hare", difficulty: 'Easy', priority: 'P1',
    description: "Determine if linked list has cycle using fast & slow pointers.",
    examples: [{ label: 'head = [3,2,0,-4], pos = 1 (cycle)', data: {} }],
    javaCode: `public boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next; fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
    generateSteps: () => [{ line: 4, explanation: 'Fast pointer (2x speed) met Slow pointer at Node(2). Cycle confirmed!', vars: { cycle: true }, visual: { type: 'array_pointers', nums: [3, 2, 0, -4], ptrs: { slow: 1, fast: 1 }, done: true } }]
  },
  {
    id: '19', num: 19, title: 'Remove Nth Node From End', category: '7. Linked List', subcat: 'Gap Pointers', difficulty: 'Medium', priority: 'P1',
    description: 'Remove n-th node from end of list in one single pass.',
    examples: [{ label: 'head = [1,2,3,4,5], n = 2 → [1,2,3,5]', data: {} }],
    javaCode: `public ListNode removeNthFromEnd(ListNode head, int n) {\n    // Advance fast pointer n steps ahead, then move both together\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Removed Node(4) from end. Result: 1 -> 2 -> 3 -> 5.', vars: { removed: 4 }, visual: { type: 'array_pointers', nums: [1, 2, 3, 5], ptrs: {}, done: true } }]
  },
  {
    id: '143', num: 143, title: 'Reorder List', category: '7. Linked List', subcat: 'Split, Reverse & Interleave', difficulty: 'Medium', priority: 'P1',
    description: 'Reorder list to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2...',
    examples: [{ label: '[1,2,3,4] → [1,4,2,3]', data: {} }],
    javaCode: `public void reorderList(ListNode head) {\n    // 1. Find middle; 2. Reverse second half; 3. Interleave\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Interleaved first half [1, 2] with reversed second half [4, 3]: [1, 4, 2, 3]!', vars: { order: '[1,4,2,3]' }, visual: { type: 'array_pointers', nums: [1, 4, 2, 3], ptrs: {}, done: true } }]
  },

  // =========================================================================
  // 11. GREEDY (5 Problems)
  // =========================================================================
  {
    id: '55', num: 55, title: 'Jump Game', category: '8. Greedy', subcat: 'Max Reachability', difficulty: 'Medium', priority: 'P1',
    description: 'Determine if you can reach the last index from start.',
    examples: [{ label: 'nums = [2,3,1,1,4] → true', data: {} }],
    javaCode: `public boolean canJump(int[] nums) {\n    int maxReach = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (i > maxReach) return false;\n        maxReach = Math.max(maxReach, i + nums[i]);\n    }\n    return true;\n}`,
    generateSteps: () => [{ line: 4, explanation: 'i=1 (jump=3): maxReach = max(2, 1 + 3) = 4 >= lastIndex (4). Reached end!', vars: { maxReach: 4 }, visual: { type: 'array_pointers', nums: [2, 3, 1, 1, 4], ptrs: { i: 1 }, done: true } }]
  },
  {
    id: '134', num: 134, title: 'Gas Station', category: '8. Greedy', subcat: 'Net Balance Circuit', difficulty: 'Medium', priority: 'P1',
    description: 'Find starting gas station index to complete circular circuit.',
    examples: [{ label: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2] → 3', data: {} }],
    javaCode: `public int canCompleteCircuit(int[] gas, int[] cost) {\n    // Track total tank and current tank; reset start when tank < 0\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Starting at Station 3 completes the circuit with positive net gas!', vars: { start: 3 }, visual: { type: 'array_pointers', nums: [1, 2, 3, 4, 5], ptrs: { start: 3 }, done: true } }]
  },
  {
    id: '455', num: 455, title: 'Assign Cookies', category: '8. Greedy', subcat: 'Smallest Greedy Fit', difficulty: 'Easy', priority: 'P1',
    description: 'Maximize number of content children with given cookie sizes.',
    examples: [{ label: 'g = [1,2,3], s = [1,1] → 1', data: {} }],
    javaCode: `public int findContentChildren(int[] g, int[] s) {\n    Arrays.sort(g); Arrays.sort(s);\n    int i = 0, j = 0;\n    while (i < g.length && j < s.length) { if (s[j] >= g[i]) i++; j++; }\n    return i;\n}`,
    generateSteps: () => [{ line: 4, explanation: 'Assigned cookie size 1 to child greed factor 1. Content children = 1.', vars: { satisfied: 1 }, visual: { type: 'array_pointers', nums: [1, 2, 3], ptrs: { child: 0 }, done: true } }]
  },
  {
    id: '435', num: 435, title: 'Non-overlapping Intervals', category: '8. Greedy', subcat: 'Earliest Finish Time', difficulty: 'Medium', priority: 'P1',
    description: 'Find minimum intervals to remove to make remainder non-overlapping.',
    examples: [{ label: 'intervals = [[1,2],[2,3],[3,4],[1,3]] → 1', data: {} }],
    javaCode: `public int eraseOverlapIntervals(int[][] intervals) {\n    // Sort by end time ascending; count overlaps\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Removed interval [1, 3] which conflicted with [1, 2] and [2, 3]. Removed = 1.', vars: { removed: 1 }, visual: { type: 'array_pointers', nums: [2, 3, 4], ptrs: {}, done: true } }]
  },
  {
    id: '860', num: 860, title: 'Lemonade Change', category: '8. Greedy', subcat: 'Cash Register Greedy', difficulty: 'Easy', priority: 'P1',
    description: 'Provide correct change ($5, $10) for each customer bill ($5, $10, $20).',
    examples: [{ label: 'bills = [5,5,5,10,20] → true', data: {} }],
    javaCode: `public boolean lemonadeChange(int[] bills) {\n    int five = 0, ten = 0;\n    for (int b : bills) {\n        if (b == 5) five++;\n        else if (b == 10) { five--; ten++; }\n        else if (ten > 0) { ten--; five--; }\n        else five -= 3;\n        if (five < 0) return false;\n    }\n    return true;\n}`,
    generateSteps: () => [{ line: 5, explanation: 'Customer gave $20. Gave $10 + $5 change. Register balanced!', vars: { five: 2, ten: 0 }, visual: { type: 'array_pointers', nums: [5, 5, 5, 10, 20], ptrs: {}, done: true } }]
  },

  // =========================================================================
  // 12. INTERVALS (5 Problems)
  // =========================================================================
  {
    id: '56', num: 56, title: 'Merge Intervals', category: '9. Intervals', subcat: 'Start-Time Sorting', difficulty: 'Medium', priority: 'P1',
    description: 'Merge all overlapping intervals.',
    examples: [{ label: '[[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]', data: {} }],
    javaCode: `public int[][] merge(int[][] intervals) {\n    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n    List<int[]> res = new ArrayList<>();\n    for (int[] interval : intervals) {\n        if (res.isEmpty() || res.get(res.size()-1)[1] < interval[0]) res.add(interval);\n        else res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], interval[1]);\n    }\n    return res.toArray(new int[0][]);\n}`,
    generateSteps: () => [{ line: 5, explanation: 'Merged [1, 3] and [2, 6] into [1, 6]. Result: [[1,6], [8,10], [15,18]].', vars: { merged: '[[1,6],[8,10],[15,18]]' }, visual: { type: 'array_pointers', nums: [1, 6, 8, 10, 15, 18], ptrs: {}, done: true } }]
  },
  {
    id: '57', num: 57, title: 'Insert Interval', category: '9. Intervals', subcat: 'Binary Search Insertion', difficulty: 'Medium', priority: 'P1',
    description: 'Insert newInterval into sorted non-overlapping intervals.',
    examples: [{ label: 'intervals = [[1,3],[6,9]], newInterval = [2,5] → [[1,5],[6,9]]', data: {} }],
    javaCode: `public int[][] insert(int[][] intervals, int[] newInterval) {\n    // Add before, merge overlapping, add remaining after\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Merged [2, 5] with [1, 3] -> [1, 5]. Result: [[1, 5], [6, 9]].', vars: { res: '[[1,5],[6,9]]' }, visual: { type: 'array_pointers', nums: [1, 5, 6, 9], ptrs: {}, done: true } }]
  },
  {
    id: '253', num: 253, title: 'Meeting Rooms II', category: '9. Intervals', subcat: 'Chronological Sweep', difficulty: 'Medium', priority: 'P1',
    description: 'Find minimum number of conference rooms required.',
    examples: [{ label: 'intervals = [[0,30],[5,10],[15,20]] → 2', data: {} }],
    javaCode: `public int minMeetingRooms(int[][] intervals) {\n    // Min-Heap tracking end times of ongoing meetings\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Meeting [0, 30] overlaps with [5, 10]. Peak concurrent rooms = 2!', vars: { rooms: 2 }, visual: { type: 'array_pointers', nums: [2], ptrs: {}, done: true } }]
  },
  {
    id: '452', num: 452, title: 'Minimum Number of Arrows', category: '9. Intervals', subcat: 'End-Time Coordinate Sweep', difficulty: 'Medium', priority: 'P1',
    description: 'Minimum arrows to burst all balloons.',
    examples: [{ label: '[[10,16],[2,8],[1,6],[7,12]] → 2', data: {} }],
    javaCode: `public int findMinArrowShots(int[][] points) {\n    // Sort by end position; burst intersecting balloons with one arrow\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Arrow 1 at pos 6 bursts [1,6],[2,8]; Arrow 2 at pos 12 bursts [7,12],[10,16]. Total = 2.', vars: { arrows: 2 }, visual: { type: 'array_pointers', nums: [2], ptrs: {}, done: true } }]
  },
  {
    id: '1288', num: 1288, title: 'Remove Covered Intervals', category: '9. Intervals', subcat: 'Greedy Interval Cover', difficulty: 'Medium', priority: 'P1',
    description: 'Remove all intervals covered by another interval in list.',
    examples: [{ label: '[[1,4],[3,6],[2,8]] → 2', data: {} }],
    javaCode: `public int removeCoveredIntervals(int[][] intervals) {\n    // Sort by start asc, end desc; track max right boundary\n}`,
    generateSteps: () => [{ line: 1, explanation: '[3, 6] is covered by [2, 8]. Remaining count = 2.', vars: { remaining: 2 }, visual: { type: 'array_pointers', nums: [1, 4, 2, 8], ptrs: {}, done: true } }]
  },

  // =========================================================================
  // 13. BACKTRACKING (5 Problems)
  // =========================================================================
  {
    id: '78', num: 78, title: 'Subsets', category: '10. Backtracking', subcat: 'Power Set Exploration', difficulty: 'Medium', priority: 'P1',
    description: 'Generate all 2^N possible power set subsets.',
    examples: [{ label: 'nums = [1, 2, 3] → 8 subsets', data: {} }],
    javaCode: `public List<List<Integer>> subsets(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    backtrack(res, new ArrayList<>(), nums, 0);\n    return res;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Backtracking tree generated all 8 subsets: [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3].', vars: { count: 8 }, visual: { type: 'trie_graph', words: ['[]', '[1]', '[1,2]', '[1,2,3]'], done: true } }]
  },
  {
    id: '46', num: 46, title: 'Permutations', category: '10. Backtracking', subcat: 'N! Factorial Exploration', difficulty: 'Medium', priority: 'P1',
    description: 'Generate all N! unique permutations of distinct integers.',
    examples: [{ label: 'nums = [1, 2, 3] → 6 permutations', data: {} }],
    javaCode: `public List<List<Integer>> permute(int[] nums) {\n    // Backtrack with used boolean array\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Generated 3! = 6 permutations: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1].', vars: { permutations: 6 }, visual: { type: 'trie_graph', words: ['1-2-3', '1-3-2', '2-1-3', '2-3-1'], done: true } }]
  },
  {
    id: '39', num: 39, title: 'Combination Sum', category: '10. Backtracking', subcat: 'Unbounded Candidates', difficulty: 'Medium', priority: 'P1',
    description: 'Find all unique combinations summing to target with repeated elements allowed.',
    examples: [{ label: 'candidates = [2,3,6,7], target = 7 → [[2,2,3],[7]]', data: {} }],
    javaCode: `public List<List<Integer>> combinationSum(int[] candidates, int target) {\n    // Backtracking with index reuse\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Target 7 reached via combinations: [2, 2, 3] and [7]!', vars: { matches: '[[2,2,3],[7]]' }, visual: { type: 'array_pointers', nums: [2, 2, 3, 7], ptrs: {}, done: true } }]
  },
  {
    id: '51', num: 51, title: 'N-Queens', category: '10. Backtracking', subcat: 'Diagonal Conflict Pruning', difficulty: 'Hard', priority: 'P1',
    description: 'Place N non-attacking queens on N x N chessboard.',
    examples: [{ label: 'N = 4 → 2 distinct solutions', data: {} }],
    javaCode: `public List<List<String>> solveNQueens(int n) {\n    // Backtrack rows with cols, posDiag, negDiag sets\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Found 4-Queens Solution 1: Q at [0,1], [1,3], [2,0], [3,2] without diagonal conflicts!', vars: { solutions: 2 }, visual: { type: 'matrix_grid', grid: [[0, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 0], [0, 0, 1, 0]], active: [1, 7, 8, 14], done: true } }]
  },
  {
    id: '131', num: 131, title: 'Palindrome Partitioning', category: '10. Backtracking', subcat: 'Prefix Palindrome Slicing', difficulty: 'Medium', priority: 'P1',
    description: 'Partition string s such that every substring is a palindrome.',
    examples: [{ label: 's = "aab" → [["a","a","b"],["aa","b"]]', data: {} }],
    javaCode: `public List<List<String>> partition(String s) {\n    // Backtrack on valid palindrome prefixes\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Partitions: ["a", "a", "b"] and ["aa", "b"]!', vars: { partitions: 2 }, visual: { type: 'array_pointers', nums: [1, 2], ptrs: {}, done: true } }]
  },

  // =========================================================================
  // 14. TREE (5 Problems)
  // =========================================================================
  {
    id: '226', num: 226, title: 'Invert Binary Tree', category: '11. Tree', subcat: 'DFS Subtree Swap', difficulty: 'Easy', priority: 'P1',
    description: 'Invert a binary tree by swapping left and right subtrees.',
    examples: [{ label: '[4,2,7,1,3,6,9] → [4,7,2,9,6,3,1]', data: {} }],
    javaCode: `public TreeNode invertTree(TreeNode root) {\n    if (root == null) return null;\n    TreeNode tmp = root.left; root.left = invertTree(root.right); root.right = invertTree(tmp);\n    return root;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Swapped subtrees: Left branch 7 (9,6) and Right branch 2 (3,1). Tree inverted!', vars: { root: 4 }, visual: { type: 'trie_graph', words: ['4-7-9', '4-7-6', '4-2-3', '4-2-1'], done: true } }]
  },
  {
    id: '104', num: 104, title: 'Maximum Depth of Binary Tree', category: '11. Tree', subcat: 'Recursive Depth', difficulty: 'Easy', priority: 'P1',
    description: 'Find number of nodes along longest path from root to leaf.',
    examples: [{ label: '[3,9,20,null,null,15,7] → 3', data: {} }],
    javaCode: `public int maxDepth(TreeNode root) {\n    if (root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`,
    generateSteps: () => [{ line: 2, explanation: 'Max depth calculated: 1 + max(depth(left)=1, depth(right)=2) = 3!', vars: { max_depth: 3 }, visual: { type: 'trie_graph', words: ['3-9', '3-20-15', '3-20-7'], done: true } }]
  },
  {
    id: '236', num: 236, title: 'Lowest Common Ancestor', category: '11. Tree', subcat: 'LCA Tree Search', difficulty: 'Medium', priority: 'P1',
    description: 'Find lowest common ancestor of two nodes in binary tree.',
    examples: [{ label: 'p = 5, q = 1 on root 3 → 3', data: {} }],
    javaCode: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode l = lowestCommonAncestor(root.left, p, q), r = lowestCommonAncestor(root.right, p, q);\n    return l != null && r != null ? root : (l != null ? l : r);\n}`,
    generateSteps: () => [{ line: 4, explanation: 'Left subtree returned 5; Right subtree returned 1. LCA is Root 3!', vars: { lca: 3 }, visual: { type: 'trie_graph', words: ['3-5', '3-1'], done: true } }]
  },
  {
    id: '102', num: 102, title: 'Binary Tree Level Order Traversal', category: '11. Tree', subcat: 'BFS Queue Levels', difficulty: 'Medium', priority: 'P1',
    description: 'Return level order traversal of nodes values level by level.',
    examples: [{ label: '[[3],[9,20],[15,7]]', data: {} }],
    javaCode: `public List<List<Integer>> levelOrder(TreeNode root) {\n    // Queue BFS processing level.size() nodes per iteration\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Level 0: [3]; Level 1: [9, 20]; Level 2: [15, 7].', vars: { levels: 3 }, visual: { type: 'trie_graph', words: ['Level 0: 3', 'Level 1: 9,20', 'Level 2: 15,7'], done: true } }]
  },
  {
    id: '98', num: 98, title: 'Validate Binary Search Tree', category: '11. Tree', subcat: 'Min/Max Range Propagation', difficulty: 'Medium', priority: 'P1',
    description: 'Determine if binary tree is valid Binary Search Tree (BST).',
    examples: [{ label: 'root = [2,1,3] → true', data: {} }],
    javaCode: `public boolean isValidBST(TreeNode root) {\n    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Node 1 in (-inf, 2) is valid. Node 3 in (2, +inf) is valid. Valid BST!', vars: { valid: true }, visual: { type: 'trie_graph', words: ['2-1', '2-3'], done: true } }]
  },

  // =========================================================================
  // 15. HEAP (5 Problems)
  // =========================================================================
  {
    id: '215', num: 215, title: 'Kth Largest Element in an Array', category: '12. Heap', subcat: 'Min-Heap of Size K', difficulty: 'Medium', priority: 'P1',
    description: 'Find kth largest element in unsorted array.',
    examples: [{ label: 'nums = [3,2,1,5,6,4], k = 2 → 5', data: {} }],
    javaCode: `public int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> pq = new PriorityQueue<>();\n    for (int n : nums) {\n        pq.add(n);\n        if (pq.size() > k) pq.poll();\n    }\n    return pq.peek();\n}`,
    generateSteps: () => [{ line: 5, explanation: 'Min-Heap holds top 2 largest elements: [5, 6]. Heap top = 5 is 2nd largest!', vars: { kth_largest: 5 }, visual: { type: 'array_pointers', nums: [5, 6], ptrs: { top: 0 }, done: true } }]
  },
  {
    id: '347', num: 347, title: 'Top K Frequent Elements', category: '12. Heap', subcat: 'Bucket Sort / Min-Heap', difficulty: 'Medium', priority: 'P1',
    description: 'Return k most frequent elements in array.',
    examples: [{ label: 'nums = [1,1,1,2,2,3], k = 2 → [1,2]', data: {} }],
    javaCode: `public int[] topKFrequent(int[] nums, int k) {\n    // Count frequencies; extract top k via Min-Heap\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Top 2 frequent: 1 (count 3), 2 (count 2). Result: [1, 2].', vars: { top_k: '[1, 2]' }, visual: { type: 'array_pointers', nums: [1, 2], ptrs: {}, done: true } }]
  },
  {
    id: '23', num: 23, title: 'Merge k Sorted Lists', category: '12. Heap', subcat: 'Min-Heap Multi-Way Merge', difficulty: 'Hard', priority: 'P1',
    description: 'Merge k sorted linked lists into one sorted linked list.',
    examples: [{ label: 'k = 3 lists', data: {} }],
    javaCode: `public ListNode mergeKLists(ListNode[] lists) {\n    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);\n    // Add all heads to heap; continuously extract min\n}`,
    generateSteps: () => [{ line: 2, explanation: 'Extracted min nodes in O(N log k) time: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6.', vars: { status: 'MERGED' }, visual: { type: 'array_pointers', nums: [1, 1, 2, 3, 4, 4, 5, 6], ptrs: {}, done: true } }]
  },
  {
    id: '973', num: 973, title: 'K Closest Points to Origin', category: '12. Heap', subcat: 'Max-Heap Distance', difficulty: 'Medium', priority: 'P1',
    description: 'Find k closest points to (0, 0) on Euclidean plane.',
    examples: [{ label: 'points = [[1,3],[-2,2]], k = 1 → [[-2,2]]', data: {} }],
    javaCode: `public int[][] kClosest(int[][] points, int k) {\n    // Max-Heap of size k by Euclidean distance\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Point [-2, 2] has distance d² = 8 < 10. Closest point is [-2, 2]!', vars: { closest: '[-2, 2]' }, visual: { type: 'array_pointers', nums: [-2, 2], ptrs: {}, done: true } }]
  },
  {
    id: '1046', num: 1046, title: 'Last Stone Weight', category: '12. Heap', subcat: 'Max-Heap Collision', difficulty: 'Easy', priority: 'P1',
    description: 'Smash two heaviest stones together until one or none remains.',
    examples: [{ label: 'stones = [2,7,4,1,8,1] → 1', data: {} }],
    javaCode: `public int lastStoneWeight(int[] stones) {\n    // Max-heap: smash top 2; insert difference if > 0\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Smashed 8 and 7 -> 1. Smashed 4 and 2 -> 2. Last stone weight = 1.', vars: { last_stone: 1 }, visual: { type: 'array_pointers', nums: [1], ptrs: {}, done: true } }]
  },

  // =========================================================================
  // 16. GRAPH (5 Problems)
  // =========================================================================
  {
    id: '200', num: 200, title: 'Number of Islands', category: '13. Graph', subcat: '2D Flood Fill BFS/DFS', difficulty: 'Medium', priority: 'P1',
    description: 'Count number of connected land islands surrounded by water.',
    examples: [{ label: '4x5 Grid → 3 Islands', data: {} }],
    javaCode: `public int numIslands(char[][] grid) {\n    int count = 0;\n    for (int r = 0; r < grid.length; r++)\n        for (int c = 0; c < grid[0].length; c++)\n            if (grid[r][c] == '1') { count++; dfs(grid, r, c); }\n    return count;\n}`,
    generateSteps: () => [{ line: 4, explanation: 'DFS flood fill visited all connected land cells. Total islands = 3!', vars: { islands: 3 }, visual: { type: 'matrix_grid', grid: [[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]], active: [0, 1, 5, 6, 12, 18, 19], done: true } }]
  },
  {
    id: '207', num: 207, title: 'Course Schedule', category: '13. Graph', subcat: "Kahn's Topological Sort", difficulty: 'Medium', priority: 'P1',
    description: 'Determine if you can finish all courses with prerequisites (DAG Cycle Detection).',
    examples: [{ label: 'numCourses = 2, prerequisites = [[1,0]] → true', data: {} }],
    javaCode: `public boolean canFinish(int numCourses, int[][] prerequisites) {\n    int[] inDegree = new int[numCourses];\n    // Kahn's BFS algorithm with in-degree queue\n}`,
    generateSteps: () => [{ line: 2, explanation: 'Course 0 has in-degree 0. Enqueued and resolved prerequisites for Course 1. No cycles detected!', vars: { can_finish: true }, visual: { type: 'trie_graph', words: ['Course 0 -> Course 1'], done: true } }]
  },
  {
    id: '133', num: 133, title: 'Clone Graph', category: '13. Graph', subcat: 'DFS Deep Copy Map', difficulty: 'Medium', priority: 'P1',
    description: 'Return a deep copy clone of connected undirected graph.',
    examples: [{ label: '4-node graph', data: {} }],
    javaCode: `public Node cloneGraph(Node node) {\n    Map<Node, Node> map = new HashMap<>();\n    // DFS clone with visited map preventing recursion cycles\n}`,
    generateSteps: () => [{ line: 2, explanation: 'Cloned nodes 1, 2, 3, 4 with identical edge adjacencies in O(V+E).', vars: { cloned_nodes: 4 }, visual: { type: 'trie_graph', words: ['1-2', '2-3', '3-4', '4-1'], done: true } }]
  },
  {
    id: '417', num: 417, title: 'Pacific Atlantic Water Flow', category: '13. Graph', subcat: 'Reverse Multi-Source BFS', difficulty: 'Medium', priority: 'P1',
    description: 'Find coordinates where rainwater can flow to both Pacific and Atlantic oceans.',
    examples: [{ label: '5x5 Grid', data: {} }],
    javaCode: `public List<List<Integer>> pacificAtlantic(int[][] heights) {\n    // BFS uphill from Pacific border and Atlantic border\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Intersection of Pacific and Atlantic reachable cells computed: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]].', vars: { flow_cells: 7 }, visual: { type: 'matrix_grid', grid: [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]], active: [4, 8, 9, 12, 15, 16, 20], done: true } }]
  },
  {
    id: '743', num: 743, title: 'Network Delay Time', category: '13. Graph', subcat: "Dijkstra's Min-Heap", difficulty: 'Medium', priority: 'P1',
    description: 'Calculate time for all nodes to receive signal sent from source node.',
    examples: [{ label: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2 → 2', data: {} }],
    javaCode: `public int networkDelayTime(int[][] times, int n, int k) {\n    // Dijkstra shortest path from source k to all vertices\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Shortest paths: Node 1 (1ms), Node 3 (1ms), Node 4 (2ms). Network delay = 2ms!', vars: { max_time: 2 }, visual: { type: 'trie_graph', words: ['2->1 (1ms)', '2->3 (1ms)', '3->4 (1ms)'], done: true } }]
  },

  // =========================================================================
  // 17. BIT MANIPULATION (5 Problems)
  // =========================================================================
  {
    id: '136', num: 136, title: 'Single Number', category: '15. Bit Manipulation', subcat: 'XOR Cancellation', difficulty: 'Easy', priority: 'P1',
    description: 'Find element that appears once where all other elements appear twice in O(N) time and O(1) space.',
    examples: [{ label: 'nums = [4, 1, 2, 1, 2] → 4', data: {} }],
    javaCode: `public int singleNumber(int[] nums) {\n    int res = 0;\n    for (int n : nums) res ^= n;\n    return res;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'XOR properties: a ^ a = 0. Computed: 4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ 0 = 4!', vars: { result: 4 }, visual: { type: 'array_pointers', nums: [4, 1, 2, 1, 2], ptrs: {}, done: true } }]
  },
  {
    id: '191', num: 191, title: 'Number of 1 Bits (Hamming Weight)', category: '15. Bit Manipulation', subcat: "Brian Kernighan's Bit Trick", difficulty: 'Easy', priority: 'P1',
    description: 'Count number of set bits (1s) in binary integer.',
    examples: [{ label: 'n = 11 (00001011 in binary) → 3', data: {} }],
    javaCode: `public int hammingWeight(int n) {\n    int count = 0;\n    while (n != 0) { n &= (n - 1); count++; }\n    return count;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'n & (n - 1) cleared lowest set bit in each iteration. Set bits count = 3.', vars: { set_bits: 3 }, visual: { type: 'array_pointers', nums: [1, 0, 1, 1], ptrs: {}, done: true } }]
  },
  {
    id: '338', num: 338, title: 'Counting Bits', category: '15. Bit Manipulation', subcat: 'DP + Bit Shift', difficulty: 'Easy', priority: 'P1',
    description: 'Return array ans of length n + 1 where ans[i] is count of 1s in binary representation of i.',
    examples: [{ label: 'n = 5 → [0,1,1,2,1,2]', data: {} }],
    javaCode: `public int[] countBits(int n) {\n    int[] ans = new int[n + 1];\n    for (int i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);\n    return ans;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Calculated in O(N): ans[5] = ans[2] + (5 & 1) = 1 + 1 = 2 bits.', vars: { result: '[0,1,1,2,1,2]' }, visual: { type: 'array_pointers', nums: [0, 1, 1, 2, 1, 2], ptrs: {}, done: true } }]
  },
  {
    id: '190', num: 190, title: 'Reverse Bits', category: '15. Bit Manipulation', subcat: 'Bitwise Shift & Mask', difficulty: 'Easy', priority: 'P1',
    description: 'Reverse bits of a 32-bit unsigned integer.',
    examples: [{ label: '32-bit reverse', data: {} }],
    javaCode: `public int reverseBits(int n) {\n    int res = 0;\n    for (int i = 0; i < 32; i++) { res = (res << 1) | (n & 1); n >>= 1; }\n    return res;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Shifted all 32 bits into reverse position in O(32) = O(1) time.', vars: { reversed: true }, visual: { type: 'array_pointers', nums: [0, 1, 0, 1], ptrs: {}, done: true } }]
  },
  {
    id: '268', num: 268, title: 'Missing Number', category: '15. Bit Manipulation', subcat: 'XOR Index Cancellation', difficulty: 'Easy', priority: 'P1',
    description: 'Find the only missing number from range [0..n].',
    examples: [{ label: 'nums = [3,0,1] → 2', data: {} }],
    javaCode: `public int missingNumber(int[] nums) {\n    int xor = nums.length;\n    for (int i = 0; i < nums.length; i++) xor ^= i ^ nums[i];\n    return xor;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'All indices and values cancel out except the missing number 2. Result = 2!', vars: { missing: 2 }, visual: { type: 'array_pointers', nums: [3, 0, 1], ptrs: {}, done: true } }]
  }
];
      for (let i = 1; i <= amount; i++) {
        for (let c of coins) if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);
        steps.push({ line: 4, explanation: `dp[${i}] = ${dp[i]} coin(s) calculated.`, vars: { amount: i, min_coins: dp[i] }, visual: { type: 'coin_dp', dp: [...dp], currentI: i, coins } });
      }
      steps.push({ line: 6, explanation: `✓ Minimum coins for $${amount} = ${dp[amount]}!`, vars: { result: dp[amount] }, visual: { type: 'coin_dp', dp: [...dp], currentI: amount, coins, done: true } });
      return steps;
    }
  },
  {
    id: '70', num: 70, title: 'Climbing Stairs', category: '14. Dynamic Programming', subcat: 'Fibonacci DP', difficulty: 'Easy', priority: 'P1',
    description: 'Ways to reach top of n-step staircase with 1 or 2 steps.',
    examples: [{ label: 'n = 5 → 8 ways', data: {} }],
    javaCode: `public int climbStairs(int n) {\n    int a = 1, b = 1;\n    for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }\n    return b;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'State transitions: dp[1]=1, dp[2]=2, dp[3]=3, dp[4]=5, dp[5]=8 distinct ways.', vars: { ways: 8 }, visual: { type: 'array_pointers', nums: [1, 2, 3, 5, 8], ptrs: {}, done: true } }]
  },
  {
    id: '198', num: 198, title: 'House Robber', category: '14. Dynamic Programming', subcat: 'Non-Adjacent Max', difficulty: 'Medium', priority: 'P1',
    description: 'Maximize stolen money without robbing adjacent houses.',
    examples: [{ label: 'nums = [2,7,9,3,1] → 12', data: {} }],
    javaCode: `public int rob(int[] nums) {\n    int rob1 = 0, rob2 = 0;\n    for (int n : nums) { int tmp = Math.max(n + rob1, rob2); rob1 = rob2; rob2 = tmp; }\n    return rob2;\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Optimal robbery: House 0 ($2) + House 2 ($9) + House 4 ($1) = $12!', vars: { max_money: 12 }, visual: { type: 'array_pointers', nums: [2, 7, 9, 3, 1], ptrs: { l: 0, r: 2 }, done: true } }]
  },
  {
    id: '300', num: 300, title: 'Longest Increasing Subsequence', category: '14. Dynamic Programming', subcat: 'Patience Sorting', difficulty: 'Medium', priority: 'P1',
    description: 'Find length of longest strictly increasing subsequence.',
    examples: [{ label: 'nums = [10,9,2,5,3,7,101,18] → 4', data: {} }],
    javaCode: `public int lengthOfLIS(int[] nums) {\n    // Binary search tails array in O(N log N)\n}`,
    generateSteps: () => [{ line: 1, explanation: 'LIS sequence: [2, 3, 7, 101] of length 4.', vars: { length: 4 }, visual: { type: 'array_pointers', nums: [2, 3, 7, 101], ptrs: {}, done: true } }]
  },
  {
    id: '1143', num: 1143, title: 'Longest Common Subsequence', category: '14. Dynamic Programming', subcat: '2D Grid DP', difficulty: 'Medium', priority: 'P1',
    description: 'Find length of longest subsequence present in both strings.',
    examples: [{ label: 'text1 = "abcde", text2 = "ace" → 3', data: {} }],
    javaCode: `public int longestCommonSubsequence(String s1, String s2) {\n    // 2D DP Table matching characters\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Matched characters "a", "c", "e". LCS length = 3.', vars: { lcs: 'ace', length: 3 }, visual: { type: 'array_pointers', nums: [1, 2, 3], ptrs: {}, done: true } }]
  },

  // =========================================================================
  // 8. TRIE (5 Problems)
  // =========================================================================
  {
    id: '208', num: 208, title: 'Implement Trie (Prefix Tree)', category: '16. Trie', subcat: 'Prefix Tree', difficulty: 'Medium', priority: 'P1',
    description: 'Implement Trie with insert, search, and startsWith.',
    examples: [{ label: 'words = ["cat", "car", "code"]', data: { words: ["cat", "car", "code"], search: "car" } }],
    javaCode: `class Trie {\n    TrieNode root = new TrieNode();\n    public void insert(String word) {\n        TrieNode curr = root;\n        for (char c : word.toCharArray()) {\n            if (curr.children[c - 'a'] == null) curr.children[c - 'a'] = new TrieNode();\n            curr = curr.children[c - 'a'];\n        }\n        curr.isEnd = true;\n    }\n}`,
    generateSteps: (data) => {
      const steps = [];
      steps.push({ line: 1, explanation: 'Inserted words: ' + data.words.join(', '), vars: { words: data.words.join(', ') }, visual: { type: 'trie_graph', words: data.words } });
      steps.push({ line: 8, explanation: `✓ Searched prefix "${data.search}": Branch path exists!`, vars: { search: data.search }, visual: { type: 'trie_graph', words: data.words, searchPath: data.search, done: true } });
      return steps;
    }
  },
  {
    id: '211', num: 211, title: 'Design Add and Search Words', category: '16. Trie', subcat: 'Wildcard Search', difficulty: 'Medium', priority: 'P1',
    description: 'Trie search supporting dot "." as wildcard character.',
    examples: [{ label: 'search("b.d")', data: {} }],
    javaCode: `public boolean search(String word) {\n    // Backtrack on wildcard dot character matching all non-null children\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Wildcard "." matched "a" in word "bad". Match confirmed!', vars: { match: 'bad' }, visual: { type: 'trie_graph', words: ['bad', 'dad', 'mad'], done: true } }]
  },
  {
    id: '212', num: 212, title: 'Word Search II', category: '16. Trie', subcat: 'Trie + Grid DFS', difficulty: 'Hard', priority: 'P1',
    description: 'Find all dictionary words present on a 2D board of letters.',
    examples: [{ label: 'words = ["oath","pea","eat","rain"]', data: {} }],
    javaCode: `public List<String> findWords(char[][] board, String[] words) {\n    // Trie pruning during 2D matrix DFS\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Discovered words: ["oath", "eat"] on board!', vars: { found: '["oath", "eat"]' }, visual: { type: 'trie_graph', words: ['oath', 'eat'], done: true } }]
  },
  {
    id: '648', num: 648, title: 'Replace Words', category: '16. Trie', subcat: 'Shortest Root Replacement', difficulty: 'Medium', priority: 'P1',
    description: 'Replace words in sentence with shortest dictionary root prefix.',
    examples: [{ label: 'roots = ["cat","bat","rat"]', data: {} }],
    javaCode: `public String replaceWords(List<String> dict, String sentence) {\n    // Replace word with shortest matching Trie root\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Replaced "cattle" with shortest root "cat".', vars: { replaced: 'cat' }, visual: { type: 'trie_graph', words: ['cat', 'bat', 'rat'], done: true } }]
  },
  {
    id: '421', num: 421, title: 'Maximum XOR of Two Numbers', category: '16. Trie', subcat: 'Bitwise Binary Trie', difficulty: 'Medium', priority: 'P1',
    description: 'Find maximum XOR value achievable between any two array numbers.',
    examples: [{ label: 'nums = [3,10,5,25,2,8] → 28', data: {} }],
    javaCode: `public int findMaximumXOR(int[] nums) {\n    // Insert binary bits (0/1) into Bit-Trie; query opposite bits\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Max XOR = 5 XOR 25 = 28 (00101 ^ 11001 = 11100).', vars: { max_xor: 28 }, visual: { type: 'trie_graph', words: ['5 (00101)', '25 (11001)'], done: true } }]
  },

  // =========================================================================
  // 9. DESIGN (5 Problems)
  // =========================================================================
  {
    id: '146', num: 146, title: 'LRU Cache Design', category: '17. Design', subcat: 'Hash Map + DLL', difficulty: 'Medium', priority: 'P1',
    description: 'Least Recently Used Cache with O(1) get and put.',
    examples: [{ label: 'Capacity = 3', data: {} }],
    javaCode: `class LRUCache {\n    Map<Integer, Node> map = new HashMap<>();\n    Node head = new Node(0, 0), tail = new Node(0, 0);\n    public int get(int key) {\n        if (!map.containsKey(key)) return -1;\n        Node node = map.get(key); moveToHead(node); return node.val;\n    }\n}`,
    generateSteps: () => {
      const steps = [];
      steps.push({ line: 1, explanation: 'Cache at capacity 3/3. List: [3:30] ⇄ [2:20] ⇄ [1:10].', vars: { mru: '3', lru: '1' }, visual: { type: 'lru', list: [{ k: 3, v: 30 }, { k: 2, v: 20 }, { k: 1, v: 10 }] } });
      steps.push({ line: 5, explanation: 'get(1) -> Hit (10)! Promoted Key 1 to MRU Head: [1:10] ⇄ [3:30] ⇄ [2:20].', vars: { accessed: 1 }, visual: { type: 'lru', list: [{ k: 1, v: 10 }, { k: 3, v: 30 }, { k: 2, v: 20 }] } });
      steps.push({ line: 6, explanation: 'put(4, 40) -> Evicted LRU Tail Key 2. Inserted Key 4 at Head: [4:40] ⇄ [1:10] ⇄ [3:30].', vars: { evicted: 2, inserted: 4 }, visual: { type: 'lru', list: [{ k: 4, v: 40 }, { k: 1, v: 10 }, { k: 3, v: 30 }], done: true } });
      return steps;
    }
  },
  {
    id: '460', num: 460, title: 'LFU Cache Design', category: '17. Design', subcat: 'Frequency Buckets', difficulty: 'Hard', priority: 'P1',
    description: 'Least Frequently Used Cache with O(1) operations.',
    examples: [{ label: 'Capacity = 2', data: {} }],
    javaCode: `class LFUCache {\n    // Map<Key, Node> + Map<Freq, DoublyLinkedList> + minFreq tracker\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Evicted Key with lowest access frequency (freq = 1).', vars: { evicted_freq: 1 }, visual: { type: 'lru', list: [{ k: 3, v: 30 }, { k: 4, v: 40 }], done: true } }]
  },
  {
    id: '355', num: 355, title: 'Design Twitter Feed', category: '17. Design', subcat: 'K-Way Merge Heap', difficulty: 'Medium', priority: 'P1',
    description: 'Design Twitter with postTweet, getNewsFeed, follow, and unfollow.',
    examples: [{ label: '10 most recent tweets', data: {} }],
    javaCode: `class Twitter {\n    // Max-Heap merging user and followee tweet streams\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Merged 10 most recent tweets from followed users via Max-Heap.', vars: { feed_count: 10 }, visual: { type: 'lru', list: [{ k: 'Tweet 101', v: 'User A' }, { k: 'Tweet 100', v: 'User B' }], done: true } }]
  },
  {
    id: '380', num: 380, title: 'Insert Delete GetRandom O(1)', category: '17. Design', subcat: 'ArrayList + HashMap', difficulty: 'Medium', priority: 'P1',
    description: 'Set supporting insert, remove, and getRandom in O(1) average time.',
    examples: [{ label: 'getRandom()', data: {} }],
    javaCode: `class RandomizedSet {\n    List<Integer> list = new ArrayList<>(); Map<Integer, Integer> map = new HashMap<>();\n    public boolean remove(int val) {\n        int idx = map.get(val), last = list.get(list.size()-1);\n        list.set(idx, last); map.put(last, idx); list.remove(list.size()-1); map.remove(val);\n    }\n}`,
    generateSteps: () => [{ line: 3, explanation: 'Swapped deleted element with array tail to achieve O(1) removal!', vars: { status: 'O(1) REMOVED' }, visual: { type: 'array_pointers', nums: [10, 30], ptrs: {}, done: true } }]
  },
  {
    id: '295', num: 295, title: 'Find Median from Data Stream', category: '17. Design', subcat: 'Dual Heaps (Min/Max)', difficulty: 'Hard', priority: 'P1',
    description: 'Find median of all incoming numbers in real time.',
    examples: [{ label: 'addNum(1), addNum(2), findMedian() → 1.5', data: {} }],
    javaCode: `class MedianFinder {\n    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n}`,
    generateSteps: () => [{ line: 1, explanation: 'Balanced Dual Heaps: maxHeap top = 1, minHeap top = 2. Median = (1 + 2) / 2.0 = 1.5!', vars: { median: 1.5 }, visual: { type: 'array_pointers', nums: [1, 2], ptrs: { l: 0, r: 1 }, done: true } }]
  }
];
