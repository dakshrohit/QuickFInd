# QuickFind: Algorithm Visualizer & Benchmarker

QuickFind is a frontend web application designed to demonstrate, benchmark, and visualize the performance of various Data Structures and Algorithms (DSA) used in real-world autocomplete and string-matching systems. 

Instead of just running algorithms in the console, this project provides a highly interactive UI to visualize the classic **Space-Time Tradeoff** in computer science.

##  Features

### 1. Algorithm Benchmarking
Compare the execution times of different algorithms as they search through thousands of geographic locations. The app uses `performance.now()` to track execution times and renders a live, dynamically updating bar chart using **Chart.js**.

**Supported Algorithms:**
*   **Single String Hashing:** Polynomial rolling hash function (Rabin-Karp style).
*   **Double String Hashing:** Utilizes two hash functions to minimize collision probability.
*   **Knuth-Morris-Pratt (KMP):** Exact string matching using a Longest Prefix Suffix (LPS) array to skip redundant comparisons.
*   **Trie (Prefix Tree):** A highly optimized tree data structure for prefix-based searches.

### 2. Interactive Visualizer Mode
Ever wonder how these algorithms actually work under the hood? Toggle the **Visualizer Mode** to slow the algorithms down and watch them execute step-by-step:
*   Watch the **Hashing** algorithms slide their windows across strings and compute hashes in real-time.
*   Watch **KMP** build its LPS array and use it to skip characters during a mismatch.
*   Watch the **Trie** dynamically build a DOM-based tree and traverse its nodes character by character.

### 3. Typo Tolerance (Fuzzy Searching)
If a user makes a typo (e.g., typing "Wshington"), exact-match algorithms will fail. QuickFind implements the **Levenshtein Distance** (Dynamic Programming) algorithm as a fallback. If exact matches fail, it calculates the edit distance and suggests the closest matches.

### 4. Memory Profiling (Space Complexity)
While the Trie algorithm is lightning fast, it consumes significantly more memory than hashing. QuickFind recursively traverses the Trie structure, counts the instantiated nodes, and estimates the RAM footprint to physically demonstrate the **Time vs. Space Tradeoff**.

##  Tech Stack
*   **HTML5 & CSS3** (Vanilla)
*   **JavaScript** (Vanilla JS, ES6+)
*   **Chart.js** (Data Visualization)

##  How to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/QuickFind.git
   ```
2. Navigate to the directory:
   ```bash
   cd QuickFind
   ```
3. Open `index.html` in any modern web browser.
   *Note: Because the app fetches data from a local `data.json` file, you may need to serve it using a local server (like VS Code Live Server or Python's `http.server`) to avoid CORS issues.*

##  Lessons Learned
Building this project solidified my understanding of:
*   Asymptotic Analysis (Big-O Time and Space Complexity).
*   Dynamic Programming and optimal substructure.
*   DOM manipulation and asynchronous JavaScript (`async/await`, Promises).
