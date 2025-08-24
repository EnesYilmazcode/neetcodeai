// NeetCode Complexity Analyzer - Floating UI Content Script

// Hardcoded API key
const GEMINI_API_KEY = 'AIzaSyAMHG9Pktstou8rVXQ7QL6iLic9rd3RcFw';

let floatingUI = null;
let triggerButton = null;

// Initialize the extension
function initializeExtension() {
    // Prevent duplicate initialization
    if (document.querySelector('.complexity-analyzer-trigger')) {
        console.log('Extension already initialized');
        return;
    }
    
    console.log('Initializing NeetCode Complexity Analyzer');
    createTriggerButton();
    createFloatingUI();
}

// Create floating trigger button
function createTriggerButton() {
    if (triggerButton) return;
    
    triggerButton = document.createElement('button');
    triggerButton.className = 'complexity-analyzer-trigger';
    triggerButton.innerHTML = '🧠';
    triggerButton.title = 'Analyze Code Complexity';
    
    triggerButton.addEventListener('click', () => {
        if (floatingUI) {
            floatingUI.classList.toggle('show');
        }
    });
    
    document.body.appendChild(triggerButton);
}

// Create floating UI
function createFloatingUI() {
    if (floatingUI) return;
    
    floatingUI = document.createElement('div');
    floatingUI.className = 'complexity-analyzer-floating';
    
    floatingUI.innerHTML = `
        <div class="complexity-analyzer-header">
            <h3 class="complexity-analyzer-title">🧠 Complexity Analyzer</h3>
            <button class="complexity-analyzer-close">×</button>
        </div>
        <div class="complexity-analyzer-content">
            <button class="complexity-analyzer-button" id="analyzeBtn">
                Analyze Code Complexity
            </button>
            <div id="result"></div>
        </div>
    `;
    
    document.body.appendChild(floatingUI);
    
    // Add event listeners
    const closeBtn = floatingUI.querySelector('.complexity-analyzer-close');
    const analyzeBtn = floatingUI.querySelector('#analyzeBtn');
    
    closeBtn.addEventListener('click', () => {
        floatingUI.classList.remove('show');
    });
    
    analyzeBtn.addEventListener('click', analyzeCode);
}

// Extract code from page
function extractCodeFromPage() {
    let extractedCode = '';
    
    // Method 1: Try Monaco Editor API first (most reliable)
    if (window.monaco && window.monaco.editor) {
        try {
            const models = window.monaco.editor.getModels();
            if (models && models.length > 0) {
                extractedCode = models[0].getValue();
                if (extractedCode && extractedCode.trim().length > 10) {
                    console.log('Code extracted via Monaco API');
                    return extractedCode.trim();
                }
            }
        } catch (e) {
            console.log('Monaco API extraction failed:', e);
        }
    }
    
    // Method 2: Extract from Monaco editor DOM structure
    try {
        const viewLines = document.querySelector('.monaco-editor .view-lines');
        if (viewLines) {
            const lines = viewLines.querySelectorAll('.view-line');
            let codeLines = [];
            
            for (const line of lines) {
                let lineText = '';
                
                // Get the deepest text nodes to avoid duplication
                const walker = document.createTreeWalker(
                    line,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let textNode;
                while (textNode = walker.nextNode()) {
                    lineText += textNode.textContent;
                }
                
                // Clean up the line (Monaco uses &nbsp; for spaces)
                lineText = lineText.replace(/\u00A0/g, ' ');
                codeLines.push(lineText);
            }
            
            extractedCode = codeLines.join('\n').trim();
            if (extractedCode.length > 10) {
                console.log('Code extracted via Monaco DOM');
                return extractedCode;
            }
        }
    } catch (e) {
        console.log('Monaco DOM extraction failed:', e);
    }
    
    // Method 3: Try to find hidden textarea
    try {
        const textareas = document.querySelectorAll('textarea');
        for (const textarea of textareas) {
            const code = textarea.value;
            if (code && code.trim().length > 10 && containsCode(code)) {
                console.log('Code extracted via textarea');
                return code.trim();
            }
        }
    } catch (e) {
        console.log('Textarea extraction failed:', e);
    }
    
    console.log('No code found with any extraction method');
    return '';
}

// Helper function to check if text contains code
function containsCode(text) {
    const codeKeywords = [
        'function', 'def', 'class', 'if', 'else', 'for', 'while', 
        'return', 'import', 'from', 'const', 'let', 'var',
        'public', 'private', 'static', 'void', 'int', 'string',
        'Solution', 'maxArea', 'heights', 'self'
    ];
    
    const codePatterns = [
        /def\s+\w+\s*\(/,
        /class\s+\w+/,
        /function\s+\w+/,
        /\w+\s*=\s*\w+/,
        /if\s+.+:/,
        /for\s+.+:/,
        /while\s+.+:/
    ];
    
    const lowerText = text.toLowerCase();
    const hasKeywords = codeKeywords.some(keyword => 
        lowerText.includes(keyword.toLowerCase())
    );
    const hasPatterns = codePatterns.some(pattern => pattern.test(text));
    const hasCodeStructure = /[{}();]/.test(text) || /:\s*$/.test(text.split('\n')[0]);
    
    return hasKeywords || hasPatterns || hasCodeStructure;
}

// Analyze code with Gemini API
async function analyzeCode() {
    const resultDiv = floatingUI.querySelector('#result');
    const analyzeBtn = floatingUI.querySelector('#analyzeBtn');
    
    analyzeBtn.disabled = true;
    showLoading(resultDiv, 'Extracting code...');
    
    try {
        const code = extractCodeFromPage();
        
        if (!code) {
            showError(resultDiv, 'No code found on this page. Make sure you\'re on a coding problem page with code in the editor.');
            return;
        }
        
        showLoading(resultDiv, 'Analyzing complexity...');
        
        const analysis = await analyzeWithGemini(code);
        showResult(resultDiv, analysis, code);
        
    } catch (error) {
        console.error('Analysis error:', error);
        showError(resultDiv, 'Error analyzing code: ' + error.message);
    } finally {
        analyzeBtn.disabled = false;
    }
}

// Call Gemini API
async function analyzeWithGemini(code) {
    const prompt = `Analyze the following code and provide ONLY the time and space complexity analysis in this exact format:

The time complexity is O(...)
The space complexity is O(...)

If this is not the optimal solution, also provide:
Optimal time complexity: O(...)
Optimal space complexity: O(...)

Code to analyze:
\`\`\`
${code}
\`\`\`

Please be concise and only provide the complexity analysis in the requested format.`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200
        }
    };

    // Try different model names in order of preference
    const modelNames = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest', 
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.0-pro'
    ];

    let lastError = null;

    for (const modelName of modelNames) {
        try {
            console.log(`Trying model: ${modelName}`);
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            if (response.ok) {
                const data = await response.json();
                const analysisText = data.candidates[0]?.content?.parts[0]?.text;
                
                if (analysisText) {
                    console.log(`Success with model: ${modelName}`);
                    return parseAnalysis(analysisText);
                }
            } else {
                const errorData = await response.json();
                lastError = errorData.error?.message || 'Unknown error';
                console.log(`Model ${modelName} failed:`, lastError);
                continue; // Try next model
            }
        } catch (error) {
            lastError = error.message;
            console.log(`Model ${modelName} error:`, error);
            continue; // Try next model
        }
    }
    
    // If all models failed
    throw new Error(`All models failed. Last error: ${lastError}`);
}

// Parse analysis response
function parseAnalysis(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let timeComplexity = '';
    let spaceComplexity = '';
    let optimalTime = '';
    let optimalSpace = '';
    
    for (const line of lines) {
        const lowerLine = line.toLowerCase();
        
        if (lowerLine.includes('time complexity is')) {
            timeComplexity = line;
        } else if (lowerLine.includes('space complexity is')) {
            spaceComplexity = line;
        } else if (lowerLine.includes('optimal time complexity')) {
            optimalTime = line;
        } else if (lowerLine.includes('optimal space complexity')) {
            optimalSpace = line;
        }
    }
    
    return {
        timeComplexity: timeComplexity || 'Time complexity analysis not found',
        spaceComplexity: spaceComplexity || 'Space complexity analysis not found',
        optimalTime,
        optimalSpace,
        hasOptimal: optimalTime || optimalSpace
    };
}

// UI helper functions
function showLoading(container, message) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
}

function showResult(container, analysis, code) {
    let html = `
        <div class="complexity-analyzer-result">
            <div class="complexity-item">
                <div class="complexity-item-label">Time Complexity</div>
                <div class="complexity-item-value">${extractComplexity(analysis.timeComplexity)}</div>
            </div>
            <div class="complexity-item">
                <div class="complexity-item-label">Space Complexity</div>
                <div class="complexity-item-value">${extractComplexity(analysis.spaceComplexity)}</div>
            </div>
    `;
    
    if (analysis.hasOptimal) {
        html += `
            <div class="optimal-suggestion">
                <div class="optimal-suggestion-title">💡 Optimization Available</div>
                <div class="optimal-suggestion-content">
                    ${analysis.optimalTime ? `Time: ${extractComplexity(analysis.optimalTime)}<br>` : ''}
                    ${analysis.optimalSpace ? `Space: ${extractComplexity(analysis.optimalSpace)}` : ''}
                </div>
            </div>
        `;
    }
    
    html += `
            <div class="code-preview">
                <div class="code-preview-label">Analyzed Code</div>
                ${code.substring(0, 200)}${code.length > 200 ? '...' : ''}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error-state">
            ${message}
        </div>
    `;
}

function extractComplexity(text) {
    const match = text.match(/O\([^)]+\)/);
    return match ? match[0] : text;
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
    initializeExtension();
}

// Handle extension icon clicks
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    
    if (request.action === 'toggleUI') {
        // Initialize if not already done
        if (!floatingUI) {
            initializeExtension();
        }
        
        if (floatingUI) {
            floatingUI.classList.toggle('show');
            console.log('Toggled UI visibility');
        }
        
        // Send response to confirm message was received
        sendResponse({ success: true });
    }
    
    return true; // Keep message channel open for async response
});