let statesData = [];
let singleHashingTimes = [];
let doubleHashingTimes = [];
let kmpTimes = [];
let trieTimes = [];
let singleHashingCount = 0;
let doubleHashingCount = 0;
let kmpCount = 0;
let trieCount = 0;
let averageTimesChart;
let isVisualizerMode = false;

window.toggleVisualizerMode = function() {
    isVisualizerMode = document.getElementById("visualizer-toggle").checked;
    const sampleWordSelect = document.getElementById("sample-word");
    const visualizerContainer = document.getElementById("visualizer-container");
    const suggestionsList = document.getElementById("suggestions");
    const chartContainer = document.querySelector(".average-times-container");

    if (isVisualizerMode) {
        sampleWordSelect.style.display = "inline-block";
        visualizerContainer.style.display = "block";
        suggestionsList.style.display = "none";
        chartContainer.style.display = "none";
        
        document.getElementById("autocomplete-input").value = "";
        document.getElementById("visualizer-info").innerHTML = "Type a search query to visualize the selected algorithm.";
        document.getElementById("visualizer-blocks").innerHTML = "";
        document.getElementById("visualizer-blocks").style.flexDirection = "row";
        document.getElementById("visualizer-status").innerHTML = "";
    } else {
        sampleWordSelect.style.display = "none";
        visualizerContainer.style.display = "none";
        suggestionsList.style.display = "block";
        chartContainer.style.display = "block";
        autocomplete();
    }
}

async function fetchData() {
    try {
        const response = await fetch("data.json");
        const jsonData = await response.json();
        statesData = jsonData.states;
        console.log("Data loaded successfully:", statesData);
        let cityCount = 0;
        for (const state of statesData) {
        cityCount += state.cities.length;
        }
        const cityCountElement = document.getElementById("city-count");
        cityCountElement.textContent = `Total Cities/Data: ${cityCount}`;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchData();


function singleHashingSearch(text, pattern) {
    const p = 31; 
    const m = 1e9 + 9; 

    const S = text.length;
    const P = pattern.length;

    let pPow = 1;
    for (let i = 0; i < P; i++) {
        pPow = (pPow * p) % m;
    }

    
    let patternHash = 0;
    for (let i = 0; i < P; i++) {
        patternHash = (patternHash * p + (pattern.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
    }


    let currentHash = 0;
    for (let i = 0; i < P; i++) {
        currentHash = (currentHash * p + (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
    }

    for (let i = 0; i + P - 1 < S; i++) {
        if (patternHash === currentHash) {
        if (text.substr(i, P) === pattern) {
            return true;
        }
        }

    
        if (i + P < S) {
        currentHash = (currentHash * p - (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1) * pPow + (text.charCodeAt(i + P) - 'a'.charCodeAt(0) + 1)) % m;
        if (currentHash < 0) currentHash += m;
        }
    }

    return false;
}


function doubleHashingSearch(text, pattern) {
    const p1 = 31; 
    const p2 = 37; 
    const m = 1e9 + 9; 

    const S = text.length;
    const P = pattern.length;

    let p1Pow = 1;
    let p2Pow = 1;
    for (let i = 0; i < P; i++) {
        p1Pow = (p1Pow * p1) % m;
        p2Pow = (p2Pow * p2) % m;
    }

    let patternHash1 = 0;
    let patternHash2 = 0;
    for (let i = 0; i < P; i++) {
        patternHash1 = (patternHash1 * p1 + (pattern.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
        patternHash2 = (patternHash2 * p2 + (pattern.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
    }


    let currentHash1 = 0;
    let currentHash2 = 0;
    for (let i = 0; i < P; i++) {
        currentHash1 = (currentHash1 * p1 + (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
        currentHash2 = (currentHash2 * p2 + (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
    }

    
    for (let i = 0; i + P - 1 < S; i++) {
        if (patternHash1 === currentHash1 && patternHash2 === currentHash2) {
        if (text.substr(i, P) === pattern) {
            return true;
        }
        }

    
        if (i + P < S) {
        currentHash1 = (currentHash1 * p1 - (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1) * p1Pow + (text.charCodeAt(i + P) - 'a'.charCodeAt(0) + 1)) % m;
        if (currentHash1 < 0) currentHash1 += m;
        
        currentHash2 = (currentHash2 * p2 - (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1) * p2Pow + (text.charCodeAt(i + P) - 'a'.charCodeAt(0) + 1)) % m;
        if (currentHash2 < 0) currentHash2 += m;
        }
    }

    return false;
}

function kmpSearch(text, pattern) {
    const N = text.length;
    const M = pattern.length;

    if (M === 0) return true;

    const lps = new Array(M).fill(0);
    let len = 0;
    let i = 1;
    while (i < M) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    i = 0; 
    let j = 0; 
    while (N - i >= M - j) {
        if (pattern[j] === text[i]) {
            j++;
            i++;
        }
        if (j === M) {
            return true;
        } else if (i < N && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i = i + 1;
            }
        }
    }
    return false;
}

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
        if (!node.children[char]) {
            node.children[char] = new TrieNode();
        }
        node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    startsWith(prefix) {
        let node = this.root;
        for (const char of prefix) {
        if (!node.children[char]) {
            return [];
        }
        node = node.children[char];
        }
        return this.collectAllWords(node, prefix);
    }

    collectAllWords(node, prefix) {
        let words = [];
        if (node.isEndOfWord) {
        words.push(prefix);
        }
        for (const char in node.children) {
        words = words.concat(
            this.collectAllWords(node.children[char], prefix + char)
        );
        }
        return words;
    }
}

const trie = new Trie();


function initializeTrie() {
    for (const state of statesData) {
        for (const city of state.cities) {
        trie.insert(city.toLowerCase());
        }
    }
}

function autocomplete() {
    const input = document
        .getElementById("autocomplete-input")
        .value.toLowerCase();
    const algorithm = document.getElementById("algorithm").value;
    const suggestions = [];
    const timeTakenElement = document.getElementById("time-taken");

    if (isVisualizerMode) {
        const sampleWord = document.getElementById("sample-word").value.toLowerCase();
        document.getElementById("visualizer-blocks").style.flexDirection = "row";
        if (input !== "") {
            if (algorithm === "single-hashing") {
                window.visualizeSingleHashing(sampleWord, input);
            } else if (algorithm === "double-hashing") {
                window.visualizeDoubleHashing(sampleWord, input);
            } else if (algorithm === "kmp") {
                window.visualizeKMP(sampleWord, input);
            } else if (algorithm === "trie") {
                window.visualizeTrie(input);
            }
        } else {
            document.getElementById("visualizer-blocks").innerHTML = "";
            document.getElementById("visualizer-info").innerHTML = "Type a search query to visualize the selected algorithm.";
            document.getElementById("visualizer-status").innerHTML = "";
        }
        return;
    }

    if (input === "") {
        displaySuggestions(suggestions);
        timeTakenElement.textContent = "";
        return;
    }

    let startTime = performance.now();
    let algorithmTimes;

    if (algorithm === "single-hashing") {
        algorithmTimes = singleHashingTimes;
        singleHashingCount++;
        for (const state of statesData) {
        for (const city of state.cities) {
            if (singleHashingSearch(city.toLowerCase(), input)) {
            suggestions.push(city);
            }
        }
        }
    } else if (algorithm === "double-hashing") {
        algorithmTimes = doubleHashingTimes;
        doubleHashingCount++;
        for (const state of statesData) {
        for (const city of state.cities) {
            if (doubleHashingSearch(city.toLowerCase(), input)) {
            suggestions.push(city);
            }
        }
        }
    } else if (algorithm === "kmp") {
        algorithmTimes = kmpTimes;
        kmpCount++;
        for (const state of statesData) {
        for (const city of state.cities) {
            if (kmpSearch(city.toLowerCase(), input)) {
            suggestions.push(city);
            }
        }
        }
    } else if (algorithm === "trie") {
        algorithmTimes = trieTimes;
        trieCount++;
        suggestions.push(...trie.startsWith(input));
    }

    let endTime = performance.now();
    let timeTaken = endTime - startTime;
    algorithmTimes.push(timeTaken);

    if (suggestions.length === 0 && document.getElementById("fuzzy-toggle").checked && input.length >= 3) {
        const fuzzyResults = [];
        for (const state of statesData) {
            for (const city of state.cities) {
                const dist = levenshteinDistance(input, city.toLowerCase());
                if (dist <= 2) {
                    fuzzyResults.push({ city, dist });
                }
            }
        }
        fuzzyResults.sort((a, b) => a.dist - b.dist);
        for (let k = 0; k < Math.min(5, fuzzyResults.length); k++) {
            suggestions.push(fuzzyResults[k].city + " (Typo Match)");
        }
    }

    const averageTime = calculateAverage(algorithmTimes, algorithm);

    console.log(
        `Algorithm: ${algorithm}, Time taken: ${timeTaken.toFixed(
        2
        )} ms, Average Time: ${averageTime} ms`
    );

    timeTakenElement.textContent = `Time taken: ${timeTaken.toFixed(
        2
    )} ms, Average Time: ${averageTime} ms`;

    displaySuggestions(suggestions);
}

// Function to calculate average time
function calculateAverage(times, algorithm) {
    if (times.length === 0) return "Not used yet";
    const sum = times.reduce((acc, curr) => acc + curr, 0);
    const average = sum / times.length;
    return average.toFixed(2) + " ms";
}

window.autocomplete = autocomplete;

function displaySuggestions(suggestions) {
    const suggestionsList = document.getElementById("suggestions");
    suggestionsList.innerHTML = "";
    for (const suggestion of suggestions) {
        const listItem = document.createElement("li");
        listItem.textContent = suggestion;
        suggestionsList.appendChild(listItem);
    }
}

setInterval(() => {
    document.getElementById("single-hashing-average").textContent = calculateAverage(
        singleHashingTimes,
        "Single Hashing"
    );
    document.getElementById("double-hashing-average").textContent = calculateAverage(
        doubleHashingTimes,
        "Double Hashing"
    );
    document.getElementById("kmp-average").textContent = calculateAverage(
        kmpTimes,
        "KMP"
    );
    document.getElementById("trie-average").textContent = calculateAverage(
        trieTimes,
        "Trie"
    );

    updateAverageTimesChart();
}, 1000); 

function updateAverageTimesChart() {
    averageTimesChart.data.datasets[0].data = [
        parseFloat(calculateAverage(singleHashingTimes, "Single Hashing")),
        parseFloat(calculateAverage(doubleHashingTimes, "Double Hashing")),
        parseFloat(calculateAverage(kmpTimes, "KMP")),
        parseFloat(calculateAverage(trieTimes, "Trie")),
    ];
    averageTimesChart.update();
}

setTimeout(() => {
    initializeTrie();
}, 1000);

function initializeChart() {
    const ctx = document.getElementById("average-times-chart").getContext("2d");
    averageTimesChart = new Chart(ctx, {
        type: "bar",
        data: {
        labels: ["Single Hashing", "Double Hashing", "KMP", "Trie"],
        datasets: [
            {
            label: "Average Search Time (ms)",
            data: [NaN, NaN, NaN, NaN], 
            backgroundColor: [
                "rgba(255, 206, 86, 0.2)", 
                "rgba(75, 192, 192, 0.2)", 
                "rgba(153, 102, 255, 0.2)",
                "rgba(54, 162, 235, 0.2)", 
            ],
            borderColor: [
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(54, 162, 235, 1)",
            ],
            borderWidth: 1,
            datalabels: {
                anchor: "end",
                align: "end",
                formatter: function (value, context) {
                return value + " ms";
                },
                color: "#333",
                font: {
                weight: "bold",
                },
            },
            },
        ],
        },
        options: {
        plugins: {
            datalabels: {
            display: true,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: 4,
            padding: {
                top: 2,
                bottom: 2,
                left: 6,
                right: 6,
            },
            },
        },
        scales: {
            yAxes: [{
            ticks: {
                beginAtZero: true
            }
            }]
        }
        },
    });
}

initializeChart();

function resetStats() {
    singleHashingTimes = [];
    doubleHashingTimes = [];
    kmpTimes = [];
    trieTimes = [];
    singleHashingCount = 0;
    doubleHashingCount = 0;
    kmpCount = 0;
    trieCount = 0;
    document.getElementById("single-hashing-average").textContent = "Not used yet";
    document.getElementById("double-hashing-average").textContent = "Not used yet";
    document.getElementById("kmp-average").textContent = "Not used yet";
    document.getElementById("trie-average").textContent = "Not used yet";
}

window.resetStats = resetStats;

window.visualizeSingleHashing = async function(text, pattern) {
    const blocksContainer = document.getElementById("visualizer-blocks");
    const infoContainer = document.getElementById("visualizer-info");
    const statusContainer = document.getElementById("visualizer-status");
    
    blocksContainer.innerHTML = "";
    for (let char of text) {
        const span = document.createElement("span");
        span.className = "char-box";
        span.textContent = char;
        blocksContainer.appendChild(span);
    }
    
    const p = 31; 
    const m = 1e9 + 9; 
    const S = text.length;
    const P = pattern.length;

    if (P > S) {
        statusContainer.innerHTML = "<span style='color: #d9534f'>Pattern is longer than text!</span>";
        infoContainer.innerHTML = "";
        return;
    }

    let pPow = 1;
    for (let i = 0; i < P; i++) {
        pPow = (pPow * p) % m;
    }

    let patternHash = 0;
    for (let i = 0; i < P; i++) {
        patternHash = (patternHash * p + (pattern.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
    }

    let currentHash = 0;
    for (let i = 0; i < P; i++) {
        currentHash = (currentHash * p + (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
    }

    statusContainer.innerHTML = "Searching...";

    for (let i = 0; i + P - 1 < S; i++) {
        const boxes = blocksContainer.querySelectorAll('.char-box');
        boxes.forEach(b => b.className = "char-box");
        
        for (let j = 0; j < P; j++) {
            if (boxes[i+j]) boxes[i+j].classList.add("window-active");
        }
        
        infoContainer.innerHTML = `Pattern Hash: <strong>${patternHash}</strong> | Window Hash: <strong>${currentHash}</strong>`;
        
        await new Promise(r => setTimeout(r, 600));

        if (patternHash === currentHash) {
            if (text.substr(i, P) === pattern) {
                for (let j = 0; j < P; j++) {
                    if (boxes[i+j]) boxes[i+j].classList.add("match-success");
                }
                statusContainer.innerHTML = "<span style='color: #5cb85c'>Match Found!</span>";
                return;
            }
        } else {
             for (let j = 0; j < P; j++) {
                if (boxes[i+j]) boxes[i+j].classList.add("match-fail");
            }
            await new Promise(r => setTimeout(r, 400));
        }

        if (i + P < S) {
            currentHash = (currentHash * p - (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1) * pPow + (text.charCodeAt(i + P) - 'a'.charCodeAt(0) + 1)) % m;
            if (currentHash < 0) currentHash += m;
        }
    }
    
    const boxes = blocksContainer.querySelectorAll('.char-box');
    boxes.forEach(b => b.className = "char-box");
    statusContainer.innerHTML = "<span style='color: #d9534f'>Pattern not found.</span>";
}

window.visualizeDoubleHashing = async function(text, pattern) {
    const blocksContainer = document.getElementById("visualizer-blocks");
    const infoContainer = document.getElementById("visualizer-info");
    const statusContainer = document.getElementById("visualizer-status");
    
    blocksContainer.innerHTML = "";
    for (let char of text) {
        const span = document.createElement("span");
        span.className = "char-box";
        span.textContent = char;
        blocksContainer.appendChild(span);
    }
    
    const p1 = 31; 
    const p2 = 37; 
    const m = 1e9 + 9; 
    const S = text.length;
    const P = pattern.length;

    if (P > S) {
        statusContainer.innerHTML = "<span style='color: #d9534f'>Pattern is longer than text!</span>";
        infoContainer.innerHTML = "";
        return;
    }

    let p1Pow = 1;
    let p2Pow = 1;
    for (let i = 0; i < P; i++) {
        p1Pow = (p1Pow * p1) % m;
        p2Pow = (p2Pow * p2) % m;
    }

    let patternHash1 = 0;
    let patternHash2 = 0;
    for (let i = 0; i < P; i++) {
        patternHash1 = (patternHash1 * p1 + (pattern.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
        patternHash2 = (patternHash2 * p2 + (pattern.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
    }

    let currentHash1 = 0;
    let currentHash2 = 0;
    for (let i = 0; i < P; i++) {
        currentHash1 = (currentHash1 * p1 + (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
        currentHash2 = (currentHash2 * p2 + (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1)) % m;
    }

    statusContainer.innerHTML = "Searching with Double Hashing...";

    for (let i = 0; i + P - 1 < S; i++) {
        const boxes = blocksContainer.querySelectorAll('.char-box');
        boxes.forEach(b => b.className = "char-box");
        
        for (let j = 0; j < P; j++) {
            if (boxes[i+j]) boxes[i+j].classList.add("window-active");
        }
        
        infoContainer.innerHTML = `<div style="font-size: 14px; margin-bottom: 5px;">Pattern H1: <strong>${patternHash1}</strong> | Window H1: <strong>${currentHash1}</strong></div>
                                   <div style="font-size: 14px;">Pattern H2: <strong>${patternHash2}</strong> | Window H2: <strong>${currentHash2}</strong></div>`;
        
        await new Promise(r => setTimeout(r, 600));

        if (patternHash1 === currentHash1 && patternHash2 === currentHash2) {
            if (text.substr(i, P) === pattern) {
                for (let j = 0; j < P; j++) {
                    if (boxes[i+j]) boxes[i+j].classList.add("match-success");
                }
                statusContainer.innerHTML = "<span style='color: #5cb85c'>Match Found!</span>";
                return;
            }
        } else {
             for (let j = 0; j < P; j++) {
                if (boxes[i+j]) boxes[i+j].classList.add("match-fail");
            }
            await new Promise(r => setTimeout(r, 400));
        }

        if (i + P < S) {
            currentHash1 = (currentHash1 * p1 - (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1) * p1Pow + (text.charCodeAt(i + P) - 'a'.charCodeAt(0) + 1)) % m;
            if (currentHash1 < 0) currentHash1 += m;
            currentHash2 = (currentHash2 * p2 - (text.charCodeAt(i) - 'a'.charCodeAt(0) + 1) * p2Pow + (text.charCodeAt(i + P) - 'a'.charCodeAt(0) + 1)) % m;
            if (currentHash2 < 0) currentHash2 += m;
        }
    }
    
    const boxes = blocksContainer.querySelectorAll('.char-box');
    boxes.forEach(b => b.className = "char-box");
    statusContainer.innerHTML = "<span style='color: #d9534f'>Pattern not found.</span>";
}

window.visualizeKMP = async function(text, pattern) {
    const blocksContainer = document.getElementById("visualizer-blocks");
    const infoContainer = document.getElementById("visualizer-info");
    const statusContainer = document.getElementById("visualizer-status");
    
    blocksContainer.innerHTML = "";
    for (let char of text) {
        const span = document.createElement("span");
        span.className = "char-box";
        span.textContent = char;
        blocksContainer.appendChild(span);
    }
    
    const N = text.length;
    const M = pattern.length;

    if (M > N) {
        statusContainer.innerHTML = "<span style='color: #d9534f'>Pattern is longer than text!</span>";
        infoContainer.innerHTML = "";
        return;
    }
    
    infoContainer.innerHTML = "Building LPS (Longest Prefix Suffix) Array...";
    const lps = new Array(M).fill(0);
    let len = 0;
    let i = 1;
    
    await new Promise(r => setTimeout(r, 600));
    
    while (i < M) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    infoContainer.innerHTML = `<div style="font-size: 14px; margin-bottom: 5px;">LPS Array Built: <strong>[${lps.join(', ')}]</strong></div><div>Searching...</div>`;
    statusContainer.innerHTML = "";

    i = 0; 
    let j = 0; 
    while (N - i >= M - j) {
        const boxes = blocksContainer.querySelectorAll('.char-box');
        boxes.forEach(b => {
            b.className = "char-box";
            b.style.borderColor = "";
        });
        
        let startIdx = i - j;
        for (let k = 0; k < M; k++) {
            if (boxes[startIdx + k]) boxes[startIdx + k].classList.add("window-active");
        }
        
        if (boxes[i]) boxes[i].style.borderColor = "#ffeb3b"; 
        
        infoContainer.innerHTML = `<div style="font-size: 14px; margin-bottom: 5px;">LPS: <strong>[${lps.join(', ')}]</strong></div>
                                   <div style="font-size: 14px;">Checking text[${i}]('<strong>${text[i]}</strong>') == pattern[${j}]('<strong>${pattern[j]}</strong>')</div>`;
        await new Promise(r => setTimeout(r, 700));

        if (pattern[j] === text[i]) {
            if (boxes[i]) {
                boxes[i].classList.remove("window-active");
                boxes[i].classList.add("match-success");
            }
            j++;
            i++;
            await new Promise(r => setTimeout(r, 200));
        }
        
        if (j === M) {
            for (let k = 0; k < M; k++) {
                if (boxes[startIdx + k]) {
                    boxes[startIdx + k].className = "char-box match-success";
                    boxes[startIdx + k].style.borderColor = "#4cae4c";
                }
            }
            statusContainer.innerHTML = "<span style='color: #5cb85c'>Match Found!</span>";
            return;
        } else if (i < N && pattern[j] !== text[i]) {
            if (boxes[i]) {
                boxes[i].classList.remove("window-active");
                boxes[i].classList.add("match-fail");
            }
            await new Promise(r => setTimeout(r, 400));
            if (boxes[i]) {
                boxes[i].style.borderColor = "";
            }
            
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i = i + 1;
            }
        }
    }
    
    const boxes = blocksContainer.querySelectorAll('.char-box');
    boxes.forEach(b => {
        b.className = "char-box";
        b.style.borderColor = "";
    });
    statusContainer.innerHTML = "<span style='color: #d9534f'>Pattern not found.</span>";
}

window.visualizeTrie = async function(pattern) {
    const blocksContainer = document.getElementById("visualizer-blocks");
    const infoContainer = document.getElementById("visualizer-info");
    const statusContainer = document.getElementById("visualizer-status");
    
    blocksContainer.innerHTML = "";
    blocksContainer.style.display = "flex";
    blocksContainer.style.flexDirection = "column";
    blocksContainer.style.alignItems = "center";
    
    let currentNode = trie.root;
    let found = true;
    
    infoContainer.innerHTML = `Traversing Trie for prefix: "<strong>${pattern}</strong>"...`;
    
    for (let i = 0; i < pattern.length; i++) {
        const char = pattern[i];
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "10px";
        row.style.marginBottom = "10px";
        
        const nodeBox = document.createElement("div");
        nodeBox.className = "trie-node";
        nodeBox.textContent = char;
        row.appendChild(nodeBox);
        blocksContainer.appendChild(row);
        
        await new Promise(r => setTimeout(r, 600));
        
        if (!currentNode.children[char]) {
            nodeBox.classList.add("node-fail");
            statusContainer.innerHTML = `<span style='color: #d9534f'>No path found for '${char}'. Prefix does not exist.</span>`;
            found = false;
            break;
        } else {
            nodeBox.classList.add("node-success");
            currentNode = currentNode.children[char];
        }
    }
    
    if (found) {
        statusContainer.innerHTML = "<span style='color: #5cb85c'>Prefix found in Trie! Fetching all descendants...</span>";
        let words = trie.collectAllWords(currentNode, pattern);
        if (words.length > 5) {
            words = words.slice(0, 5);
            words.push("...");
        }
        setTimeout(() => {
            infoContainer.innerHTML = `Found ${words.length} matching cities: <strong>${words.join(', ')}</strong>`;
        }, 1000);
    }
}

function levenshteinDistance(a, b) {
    const matrix = [];
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, 
                    Math.min(
                        matrix[i][j - 1] + 1, 
                        matrix[i - 1][j] + 1 
                    )
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
