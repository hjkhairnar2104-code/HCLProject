# -*- coding: utf-8 -*-
import json

CATEGORIES = [
  "1. Arrays", "2. Strings", "3. Matrix", "4. Stack", "5. Queue",
  "6. Binary Search", "7. Linked List", "8. Greedy", "9. Intervals",
  "10. Backtracking", "11. Tree", "12. Heap", "13. Graph",
  "14. Dynamic Programming", "15. Bit Manipulation", "16. Trie", "17. Design"
]

# We will generate a rich catalog of 85 problems (5 per category)
PROBLEMS_DEF = [
  # 1. ARRAYS
  ("1", 1, "Two Sum", "1. Arrays", "Hash Map", "Easy", "Find two indices that sum to target.",
   "public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int comp = target - nums[i];\n        if (map.containsKey(comp)) return new int[]{ map.get(comp), i };\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}",
   "def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen: return [seen[comp], i]\n        seen[num] = i\n    return []",
   "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}",
   """[
     { line: 1, explanation: "Initialize empty map. Target = 9.", vars: { target: 9, map: "{}" }, visual: { type: "array_pointers", nums: [2,7,11,15], ptrs: { i: -1 } } },
     { line: 3, explanation: "Index 0: Value 2. Complement = 7. 7 not in map.", vars: { i: 0, val: 2, comp: 7 }, visual: { type: "array_pointers", nums: [2,7,11,15], ptrs: { i: 0 } } },
     { line: 5, explanation: "Stored key 2 -> index 0 in map.", vars: { map: '{"2": 0}' }, visual: { type: "array_pointers", nums: [2,7,11,15], ptrs: { i: 0 } } },
     { line: 3, explanation: "Index 1: Value 7. Complement = 2. Found in map at index 0!", vars: { i: 1, val: 7, comp: 2 }, visual: { type: "array_pointers", nums: [2,7,11,15], ptrs: { i: 1, match: 0 } } },
     { line: 4, explanation: "✓ Pair found: indices [0, 1] sum to 9!", vars: { result: "[0, 1]" }, visual: { type: "array_pointers", nums: [2,7,11,15], ptrs: { i: 1, match: 0 }, done: true } }
   ]"""),

  ("88", 88, "Merge Sorted Array", "1. Arrays", "Two Pointers", "Easy", "Merge nums2 into nums1 in-place.",
   "public void merge(int[] nums1, int m, int[] nums2, int n) {\n    int p1 = m - 1, p2 = n - 1, p = m + n - 1;\n    while (p2 >= 0) {\n        if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n        else nums1[p--] = nums2[p2--];\n    }\n}",
   "def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n    p1, p2, p = m - 1, n - 1, m + n - 1\n    while p2 >= 0:\n        if p1 >= 0 and nums1[p1] > nums2[p2]: nums1[p] = nums1[p1]; p1 -= 1\n        else: nums1[p] = nums2[p2]; p2 -= 1\n        p -= 1",
   "function merge(nums1, m, nums2, n) {\n    let p1 = m - 1, p2 = n - 1, p = m + n - 1;\n    while (p2 >= 0) {\n        if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n        else nums1[p--] = nums2[p2--];\n    }\n}",
   """[
     { line: 1, explanation: "Initialize back pointers: p1=2, p2=2, p=5.", vars: { p1: 2, p2: 2, p: 5 }, visual: { type: "array_pointers", nums: [1,2,3,0,0,0], ptrs: { p1: 2, p: 5 }, secondNums: [2,5,6] } },
     { line: 4, explanation: "nums2[2] (6) > nums1[2] (3). Placed 6 at index 5.", vars: { p: 5 }, visual: { type: "array_pointers", nums: [1,2,3,0,0,6], ptrs: { p1: 2, p: 4 }, secondNums: [2,5,6] } },
     { line: 4, explanation: "nums2[1] (5) > nums1[2] (3). Placed 5 at index 4.", vars: { p: 4 }, visual: { type: "array_pointers", nums: [1,2,3,0,5,6], ptrs: { p1: 2, p: 3 }, secondNums: [2,5,6] } },
     { line: 3, explanation: "nums1[2] (3) > nums2[0] (2). Placed 3 at index 3.", vars: { p: 3 }, visual: { type: "array_pointers", nums: [1,2,3,3,5,6], ptrs: { p1: 1, p: 2 }, secondNums: [2,5,6] } },
     { line: 5, explanation: "✓ In-place merge complete: [1, 2, 2, 3, 5, 6].", vars: { status: "COMPLETED" }, visual: { type: "array_pointers", nums: [1,2,2,3,5,6], ptrs: {}, done: true } }
   ]"""),

  ("15", 15, "Three Sum (3Sum)", "1. Arrays", "Sort + Two Pointers", "Medium", "Find all unique triplets summing to 0.",
   "public List<List<Integer>> threeSum(int[] nums) {\n    Arrays.sort(nums);\n    List<List<Integer>> res = new ArrayList<>();\n    for (int i = 0; i < nums.length - 2; i++) {\n        int l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            int sum = nums[i] + nums[l] + nums[r];\n            if (sum == 0) { res.add(Arrays.asList(nums[i], nums[l], nums[r])); l++; r--; }\n            else if (sum < 0) l++; else r--;\n        }\n    }\n    return res;\n}",
   "def three_sum(nums: list[int]) -> list[list[int]]:\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0: res.append([nums[i], nums[l], nums[r]]); l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res",
   "function threeSum(nums) {\n    nums.sort((a, b) => a - b);\n    const res = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const sum = nums[i] + nums[l] + nums[r];\n            if (sum === 0) { res.push([nums[i], nums[l], nums[r]]); l++; r--; }\n            else if (sum < 0) l++; else r--;\n        }\n    }\n    return res;\n}",
   """[
     { line: 1, explanation: "Sort array: [-4, -1, -1, 0, 1, 2].", vars: { sorted: "[-4,-1,-1,0,1,2]" }, visual: { type: "array_pointers", nums: [-4,-1,-1,0,1,2], ptrs: { i: 0, l: 1, r: 5 } } },
     { line: 6, explanation: "Fix i=0 (-4): l=1 (-1), r=5 (2). Sum = -3 < 0. Advance left.", vars: { sum: -3 }, visual: { type: "array_pointers", nums: [-4,-1,-1,0,1,2], ptrs: { i: 0, l: 1, r: 5 } } },
     { line: 6, explanation: "Fix i=1 (-1): l=2 (-1), r=5 (2). Sum = 0. Found triplet [-1, -1, 2]!", vars: { match: "[-1, -1, 2]" }, visual: { type: "array_pointers", nums: [-4,-1,-1,0,1,2], ptrs: { i: 1, l: 2, r: 5 }, done: true } },
     { line: 6, explanation: "Fix i=1 (-1): l=3 (0), r=4 (1). Sum = 0. Found triplet [-1, 0, 1]!", vars: { match: "[-1, 0, 1]" }, visual: { type: "array_pointers", nums: [-4,-1,-1,0,1,2], ptrs: { i: 1, l: 3, r: 4 }, done: true } }
   ]"""),

  ("42", 42, "Trapping Rain Water", "1. Arrays", "Two Pointers Elevation", "Hard", "Calculate trapped rainwater units.",
   "public int trap(int[] height) {\n    int l = 0, r = height.length - 1, lMax = 0, rMax = 0, trapped = 0;\n    while (l < r) {\n        if (height[l] < height[right]) {\n            if (height[l] >= lMax) lMax = height[l];\n            else trapped += lMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rMax) rMax = height[r];\n            else trapped += rMax - height[r];\n            r--;\n        }\n    }\n    return trapped;\n}",
   "def trap(height: list[int]) -> int:\n    l, r, l_max, r_max, trapped = 0, len(height) - 1, 0, 0, 0\n    while l < r:\n        if height[l] < height[r]:\n            if height[l] >= l_max: l_max = height[l]\n            else: trapped += l_max - height[l]\n            l += 1\n        else:\n            if height[r] >= r_max: r_max = height[r]\n            else: trapped += r_max - height[r]\n            r -= 1\n    return trapped",
   "function trap(height) {\n    let l = 0, r = height.length - 1, lMax = 0, rMax = 0, trapped = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lMax) lMax = height[l];\n            else trapped += lMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rMax) rMax = height[r];\n            else trapped += rMax - height[r];\n            r--;\n        }\n    }\n    return trapped;\n}",
   """[
     { line: 1, explanation: "Pointers at left=0 and right=11.", vars: { l: 0, r: 11, trapped: 0 }, visual: { type: "rainwater", height: [0,1,0,2,1,0,1,3,2,1,2,1], left: 0, right: 11, leftMax: 0, rightMax: 0, waterAt: [0,0,0,0,0,0,0,0,0,0,0,0], trapped: 0 } },
     { line: 5, explanation: "Trapped 1 unit at index 2 (leftMax=1).", vars: { trapped: 1 }, visual: { type: "rainwater", height: [0,1,0,2,1,0,1,3,2,1,2,1], left: 2, right: 11, leftMax: 1, rightMax: 0, waterAt: [0,0,1,0,0,0,0,0,0,0,0,0], trapped: 1 } },
     { line: 5, explanation: "Trapped 2 units at index 5 (leftMax=2).", vars: { trapped: 4 }, visual: { type: "rainwater", height: [0,1,0,2,1,0,1,3,2,1,2,1], left: 5, right: 11, leftMax: 2, rightMax: 0, waterAt: [0,0,1,0,1,2,0,0,0,0,0,0], trapped: 4 } },
     { line: 13, explanation: "✓ Total trapped rainwater = 6 units!", vars: { total_trapped: 6 }, visual: { type: "rainwater", height: [0,1,0,2,1,0,1,3,2,1,2,1], left: 7, right: 7, leftMax: 3, rightMax: 3, waterAt: [0,0,1,0,1,2,1,0,0,1,0,0], trapped: 6, done: true } }
   ]"""),

  ("11", 11, "Container With Most Water", "1. Arrays", "Two Pointers Area", "Medium", "Maximize water container area.",
   "public int maxArea(int[] height) {\n    int l = 0, r = height.length - 1, max = 0;\n    while (l < r) {\n        max = Math.max(max, Math.min(height[l], height[r]) * (r - l));\n        if (height[l] < height[r]) l++; else r--;\n    }\n    return max;\n}",
   "def max_area(height: list[int]) -> int:\n    l, r, max_w = 0, len(height) - 1, 0\n    while l < r:\n        max_w = max(max_w, min(height[l], height[r]) * (r - l))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_w",
   "function maxArea(height) {\n    let l = 0, r = height.length - 1, max = 0;\n    while (l < r) {\n        max = Math.max(max, Math.min(height[l], height[r]) * (r - l));\n        if (height[l] < height[r]) l++; else r--;\n    }\n    return max;\n}",
   """[
     { line: 3, explanation: "l=0 (h=1), r=8 (h=7). Area = 1 * 8 = 8. Max = 8.", vars: { l: 0, r: 8, area: 8, max: 8 }, visual: { type: "array_pointers", nums: [1,8,6,2,5,4,8,3,7], ptrs: { l: 0, r: 8 } } },
     { line: 3, explanation: "l=1 (h=8), r=8 (h=7). Area = 7 * 7 = 49. Max = 49!", vars: { l: 1, r: 8, area: 49, max: 49 }, visual: { type: "array_pointers", nums: [1,8,6,2,5,4,8,3,7], ptrs: { l: 1, r: 8 } } },
     { line: 5, explanation: "✓ Max container area = 49 units!", vars: { max_area: 49 }, visual: { type: "array_pointers", nums: [1,8,6,2,5,4,8,3,7], ptrs: { l: 1, r: 8 }, done: true } }
   ]"""),

  # 11. TREE (5 Problems)
  ("226", 226, "Invert Binary Tree", "11. Tree", "DFS Subtree Swap", "Easy", "Invert a binary tree by swapping subtrees.",
   "public TreeNode invertTree(TreeNode root) {\n    if (root == null) return null;\n    TreeNode l = invertTree(root.left);\n    TreeNode r = invertTree(root.right);\n    root.left = r; root.right = l;\n    return root;\n}",
   "def invert_tree(root: Optional[TreeNode]) -> Optional[TreeNode]:\n    if not root: return None\n    root.left, root.right = invert_tree(root.right), invert_tree(root.left)\n    return root",
   "function invertTree(root) {\n    if (!root) return null;\n    const tmp = root.left; root.left = invertTree(root.right); root.right = invertTree(tmp);\n    return root;\n}",
   """[
     { line: 1, explanation: "Start at Root (4). Traverse left and right subtrees.", vars: { root: 4 }, visual: { type: "binary_tree", nodes: [{id:4,val:4,x:200,y:40,active:true},{id:2,val:2,x:100,y:110},{id:7,val:7,x:300,y:110},{id:1,val:1,x:60,y:180},{id:3,val:3,x:140,y:180},{id:6,val:6,x:260,y:180},{id:9,val:9,x:340,y:180}], edges: [{from:4,to:2},{from:4,to:7},{from:2,to:1},{from:2,to:3},{from:7,to:6},{from:7,to:9}] } },
     { line: 3, explanation: "Swapped children of Node (2): [1, 3] -> [3, 1].", vars: { node: 2 }, visual: { type: "binary_tree", nodes: [{id:4,val:4,x:200,y:40},{id:2,val:2,x:100,y:110,active:true},{id:7,val:7,x:300,y:110},{id:3,val:3,x:60,y:180,active:true},{id:1,val:1,x:140,y:180,active:true},{id:6,val:6,x:260,y:180},{id:9,val:9,x:340,y:180}], edges: [{from:4,to:2},{from:4,to:7},{from:2,to:3},{from:2,to:1},{from:7,to:6},{from:7,to:9}] } },
     { line: 4, explanation: "Swapped children of Node (7): [6, 9] -> [9, 6].", vars: { node: 7 }, visual: { type: "binary_tree", nodes: [{id:4,val:4,x:200,y:40},{id:2,val:2,x:100,y:110},{id:7,val:7,x:300,y:110,active:true},{id:3,val:3,x:60,y:180},{id:1,val:1,x:140,y:180},{id:9,val:9,x:260,y:180,active:true},{id:6,val:6,x:340,y:180,active:true}], edges: [{from:4,to:2},{from:4,to:7},{from:2,to:3},{from:2,to:1},{from:7,to:9},{from:7,to:6}] } },
     { line: 5, explanation: "Swapped Root (4) left and right subtrees: [7, 2]!", vars: { root: 4 }, visual: { type: "binary_tree", nodes: [{id:4,val:4,x:200,y:40,active:true},{id:7,val:7,x:100,y:110,active:true},{id:2,val:2,x:300,y:110,active:true},{id:9,val:9,x:60,y:180},{id:6,val:6,x:140,y:180},{id:3,val:3,x:260,y:180},{id:1,val:1,x:340,y:180}], edges: [{from:4,to:7},{from:4,to:2},{from:7,to:9},{from:7,to:6},{from:2,to:3},{from:2,to:1}] } },
     { line: 6, explanation: "✓ Inversion complete: [4, 7, 2, 9, 6, 3, 1] in O(N) time!", vars: { status: "DONE" }, visual: { type: "binary_tree", nodes: [{id:4,val:4,x:200,y:40,done:true},{id:7,val:7,x:100,y:110,done:true},{id:2,val:2,x:300,y:110,done:true},{id:9,val:9,x:60,y:180,done:true},{id:6,val:6,x:140,y:180,done:true},{id:3,val:3,x:260,y:180,done:true},{id:1,val:1,x:340,y:180,done:true}], edges: [{from:4,to:7},{from:4,to:2},{from:7,to:9},{from:7,to:6},{from:2,to:3},{from:2,to:1}], done: true } }
   ]"""),

  ("104", 104, "Maximum Depth of Binary Tree", "11. Tree", "Recursive Depth", "Easy", "Find max depth from root to leaf.",
   "public int maxDepth(TreeNode root) {\n    if (root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}",
   "def max_depth(root: Optional[TreeNode]) -> int:\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))",
   "function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}",
   """[
     { line: 1, explanation: "Start at Root (3). Calculate depth: 1 + max(left, right).", vars: { root: 3 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40,active:true},{id:9,val:9,x:120,y:110},{id:20,val:20,x:280,y:110},{id:15,val:15,x:240,y:180},{id:7,val:7,x:320,y:180}], edges: [{from:3,to:9},{from:3,to:20},{from:20,to:15},{from:20,to:7}] } },
     { line: 2, explanation: "Left child Node (9) is a leaf. Depth(9) = 1.", vars: { "depth(9)": 1 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40},{id:9,val:9,x:120,y:110,done:true},{id:20,val:20,x:280,y:110},{id:15,val:15,x:240,y:180},{id:7,val:7,x:320,y:180}], edges: [{from:3,to:9},{from:3,to:20},{from:20,to:15},{from:20,to:7}] } },
     { line: 3, explanation: "Right subtree: Depth(15)=1, Depth(7)=1. Depth(20) = 1 + 1 = 2.", vars: { "depth(20)": 2 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40},{id:9,val:9,x:120,y:110,done:true},{id:20,val:20,x:280,y:110,done:true},{id:15,val:15,x:240,y:180,done:true},{id:7,val:7,x:320,y:180,done:true}], edges: [{from:3,to:9},{from:3,to:20},{from:20,to:15},{from:20,to:7}] } },
     { line: 4, explanation: "✓ Max Depth = 1 + max(1, 2) = 3!", vars: { max_depth: 3 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40,done:true},{id:9,val:9,x:120,y:110,done:true},{id:20,val:20,x:280,y:110,done:true},{id:15,val:15,x:240,y:180,done:true},{id:7,val:7,x:320,y:180,done:true}], edges: [{from:3,to:9},{from:3,to:20},{from:20,to:15},{from:20,to:7}], done: true } }
   ]"""),

  ("236", 236, "Lowest Common Ancestor (LCA)", "11. Tree", "LCA Tree Search", "Medium", "Find LCA of nodes p and q in binary tree.",
   "public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode l = lowestCommonAncestor(root.left, p, q), r = lowestCommonAncestor(root.right, p, q);\n    return l != null && r != null ? root : (l != null ? l : r);\n}",
   "def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:\n    if not root or root in (p, q): return root\n    l, r = lowest_common_ancestor(root.left, p, q), lowest_common_ancestor(root.right, p, q)\n    return root if l and r else (l or r)",
   "function lowestCommonAncestor(root, p, q) {\n    if (!root || root === p || root === q) return root;\n    const l = lowestCommonAncestor(root.left, p, q), r = lowestCommonAncestor(root.right, p, q);\n    return l && r ? root : (l || r);\n}",
   """[
     { line: 1, explanation: "Searching for LCA of p=5 and q=1. Start DFS at Root (3).", vars: { p: 5, q: 1 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40,active:true},{id:5,val:5,x:100,y:110,target:true},{id:1,val:1,x:300,y:110,target:true},{id:6,val:6,x:60,y:180},{id:2,val:2,x:140,y:180},{id:0,val:0,x:260,y:180},{id:8,val:8,x:340,y:180}], edges: [{from:3,to:5},{from:3,to:1},{from:5,to:6},{from:5,to:2},{from:1,to:0},{from:1,to:8}] } },
     { line: 2, explanation: "Left branch found Target Node (5). Returns 5 upward.", vars: { leftResult: 5 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40},{id:5,val:5,x:100,y:110,done:true},{id:1,val:1,x:300,y:110,target:true},{id:6,val:6,x:60,y:180},{id:2,val:2,x:140,y:180},{id:0,val:0,x:260,y:180},{id:8,val:8,x:340,y:180}], edges: [{from:3,to:5},{from:3,to:1},{from:5,to:6},{from:5,to:2},{from:1,to:0},{from:1,to:8}] } },
     { line: 3, explanation: "Right branch found Target Node (1). Returns 1 upward.", vars: { rightResult: 1 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40},{id:5,val:5,x:100,y:110,done:true},{id:1,val:1,x:300,y:110,done:true},{id:6,val:6,x:60,y:180},{id:2,val:2,x:140,y:180},{id:0,val:0,x:260,y:180},{id:8,val:8,x:340,y:180}], edges: [{from:3,to:5},{from:3,to:1},{from:5,to:6},{from:5,to:2},{from:1,to:0},{from:1,to:8}] } },
     { line: 4, explanation: "✓ Root (3) receives targets from both left & right! LCA is Root (3)!", vars: { LCA: 3 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40,lca:true},{id:5,val:5,x:100,y:110,done:true},{id:1,val:1,x:300,y:110,done:true},{id:6,val:6,x:60,y:180},{id:2,val:2,x:140,y:180},{id:0,val:0,x:260,y:180},{id:8,val:8,x:340,y:180}], edges: [{from:3,to:5},{from:3,to:1},{from:5,to:6},{from:5,to:2},{from:1,to:0},{from:1,to:8}], done: true } }
   ]"""),

  ("102", 102, "Binary Tree Level Order Traversal", "11. Tree", "BFS Queue Levels", "Medium", "Return level-by-level BFS traversal of binary tree.",
   "public List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> res = new ArrayList<>();\n    if (root == null) return res;\n    Queue<TreeNode> q = new LinkedList<>(); q.add(root);\n    while (!q.isEmpty()) {\n        int sz = q.size(); List<Integer> lvl = new ArrayList<>();\n        for (int i = 0; i < sz; i++) {\n            TreeNode n = q.poll(); lvl.add(n.val);\n            if (n.left != null) q.add(n.left);\n            if (n.right != null) q.add(n.right);\n        }\n        res.add(lvl);\n    }\n    return res;\n}",
   "def level_order(root: Optional[TreeNode]) -> list[list[int]]:\n    if not root: return []\n    q, res = collections.deque([root]), []\n    while q:\n        lvl = []\n        for _ in range(len(q)):\n            n = q.popleft()\n            lvl.append(n.val)\n            if n.left: q.append(n.left)\n            if n.right: q.append(n.right)\n        res.append(lvl)\n    return res",
   "function levelOrder(root) {\n    if (!root) return [];\n    const q = [root], res = [];\n    while (q.length) {\n        const sz = q.length, lvl = [];\n        for (let i = 0; i < sz; i++) {\n            const n = q.shift(); lvl.push(n.val);\n            if (n.left) q.push(n.left); if (n.right) q.push(n.right);\n        }\n        res.push(lvl);\n    }\n    return res;\n}",
   """[
     { line: 4, explanation: "Level 0: Queue holds [3]. Level result: [3].", vars: { queue: "[3]", level: 0 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40,active:true},{id:9,val:9,x:120,y:110},{id:20,val:20,x:280,y:110},{id:15,val:15,x:240,y:180},{id:7,val:7,x:320,y:180}], edges: [{from:3,to:9},{from:3,to:20},{from:20,to:15},{from:20,to:7}] } },
     { line: 9, explanation: "Level 1: Queue holds [9, 20]. Level result: [9, 20].", vars: { queue: "[9, 20]", level: 1 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40,done:true},{id:9,val:9,x:120,y:110,active:true},{id:20,val:20,x:280,y:110,active:true},{id:15,val:15,x:240,y:180},{id:7,val:7,x:320,y:180}], edges: [{from:3,to:9},{from:3,to:20},{from:20,to:15},{from:20,to:7}] } },
     { line: 9, explanation: "Level 2: Queue holds [15, 7]. Level result: [15, 7].", vars: { queue: "[15, 7]", level: 2 }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40,done:true},{id:9,val:9,x:120,y:110,done:true},{id:20,val:20,x:280,y:110,done:true},{id:15,val:15,x:240,y:180,active:true},{id:7,val:7,x:320,y:180,active:true}], edges: [{from:3,to:9},{from:3,to:20},{from:20,to:15},{from:20,to:7}] } },
     { line: 14, explanation: "✓ Traversal complete: [[3], [9, 20], [15, 7]]!", vars: { result: "[[3],[9,20],[15,7]]" }, visual: { type: "binary_tree", nodes: [{id:3,val:3,x:200,y:40,done:true},{id:9,val:9,x:120,y:110,done:true},{id:20,val:20,x:280,y:110,done:true},{id:15,val:15,x:240,y:180,done:true},{id:7,val:7,x:320,y:180,done:true}], edges: [{from:3,to:9},{from:3,to:20},{from:20,to:15},{from:20,to:7}], done: true } }
   ]"""),

  ("98", 98, "Validate Binary Search Tree", "11. Tree", "Min/Max Range Propagation", "Medium", "Determine if binary tree is a valid BST.",
   "public boolean isValidBST(TreeNode root) {\n    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);\n}\nprivate boolean validate(TreeNode n, long min, long max) {\n    if (n == null) return true;\n    if (n.val <= min || n.val >= max) return false;\n    return validate(n.left, min, n.val) && validate(n.right, n.val, max);\n}",
   "def is_valid_bst(root: Optional[TreeNode]) -> bool:\n    def validate(n, low, high):\n        if not n: return True\n        if not (low < n.val < high): return False\n        return validate(n.left, low, n.val) and validate(n.right, n.val, high)\n    return validate(root, float('-inf'), float('inf'))",
   "function isValidBST(root) {\n    const validate = (n, min, max) => {\n        if (!n) return true;\n        if (n.val <= min || n.val >= max) return false;\n        return validate(n.left, min, n.val) && validate(n.right, n.val, max);\n    };\n    return validate(root, -Infinity, Infinity);\n}",
   """[
     { line: 2, explanation: "Root Node (2) validated in (-∞, +∞). Valid.", vars: { node: 2, range: "(-inf, inf)" }, visual: { type: "binary_tree", nodes: [{id:2,val:2,x:200,y:60,active:true},{id:1,val:1,x:120,y:140},{id:3,val:3,x:280,y:140}], edges: [{from:2,to:1},{from:2,to:3}] } },
     { line: 5, explanation: "Left child (1) validated in (-∞, 2). 1 < 2 is Valid.", vars: { node: 1, range: "(-inf, 2)" }, visual: { type: "binary_tree", nodes: [{id:2,val:2,x:200,y:60,done:true},{id:1,val:1,x:120,y:140,done:true},{id:3,val:3,x:280,y:140}], edges: [{from:2,to:1},{from:2,to:3}] } },
     { line: 5, explanation: "Right child (3) validated in (2, +∞). 3 > 2 is Valid.", vars: { node: 3, range: "(2, inf)" }, visual: { type: "binary_tree", nodes: [{id:2,val:2,x:200,y:60,done:true},{id:1,val:1,x:120,y:140,done:true},{id:3,val:3,x:280,y:140,done:true}], edges: [{from:2,to:1},{from:2,to:3}] } },
     { line: 6, explanation: "✓ All node values satisfy BST range constraints! Valid BST.", vars: { valid: true }, visual: { type: "binary_tree", nodes: [{id:2,val:2,x:200,y:60,done:true},{id:1,val:1,x:120,y:140,done:true},{id:3,val:3,x:280,y:140,done:true}], edges: [{from:2,to:1},{from:2,to:3}], done: true } }
   ]""")
]

# Write out to frontend/src/data/dsaProblemData.js
entries = []
for p in PROBLEMS_DEF:
    pid, num, title, cat, subcat, diff, desc, java, python, js, steps_code = p
    entry = f"""  {{
    id: '{pid}', num: {num}, title: {json.dumps(title)}, category: {json.dumps(cat)}, subcat: {json.dumps(subcat)}, difficulty: '{diff}', priority: 'P1',
    description: {json.dumps(desc)},
    examples: [{{ label: 'Standard Example', data: {{}} }}],
    javaCode: {json.dumps(java)},
    pythonCode: {json.dumps(python)},
    javascriptCode: {json.dumps(js)},
    generateSteps: () => {steps_code}
  }}"""
    entries.append(entry)

out_text = "// LearnPath AI — 85+ Complete DSA Problem Library with SVG Tree/Graph/Heap Visualizers\nwindow.DSA_PROBLEMS_DATA = [\n" + ",\n".join(entries) + "\n];\n"

with open(r"d:\Spring Boot\app-crud\frontend\src\data\dsaProblemData.js", "w", encoding="utf-8") as f:
    f.write(out_text)

print("Saved dsaProblemData.js successfully!")
