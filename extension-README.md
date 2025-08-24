# NeetCode Complexity Analyzer Chrome Extension

A Chrome extension that analyzes the time and space complexity of your coding solutions using Google's Gemini AI API. Perfect for NeetCode and LeetCode practice!

## Features

- 🧠 **AI-Powered Analysis**: Uses Google Gemini to analyze code complexity
- ⚡ **Real-time Code Detection**: Automatically detects code from various editors
- 💡 **Optimization Suggestions**: Shows optimal complexity when your solution isn't optimal
- 🎨 **Beautiful UI**: Modern, gradient-based interface
- 🔒 **Secure**: API key stored locally in your browser

## Setup Instructions

### 1. Get a Free Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Install the Extension

1. Download or clone this extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

### 3. Configure the Extension

1. Click the extension icon in your Chrome toolbar
2. Paste your Gemini API key in the input field
3. The key will be saved automatically

## How to Use

1. **Navigate to a coding problem**: Go to NeetCode.io or LeetCode.com
2. **Write your solution**: Code your solution in the editor
3. **Analyze complexity**: Click the extension icon and press "Analyze Code Complexity"
4. **View results**: See the time and space complexity analysis
5. **Get optimization tips**: If your solution isn't optimal, you'll see suggestions

## Supported Websites

- ✅ NeetCode.io
- ✅ LeetCode.com
- 🔄 More coding platforms can be added

## Code Detection

The extension automatically detects code from various editor types:
- Monaco Editor (VS Code-style)
- CodeMirror
- Ace Editor  
- Standard textareas
- Custom coding platform editors

## Example Output

```
⏱️ The time complexity is O(n²)
💾 The space complexity is O(1)

💡 Optimization Suggestion:
⏱️ Optimal time complexity: O(n log n)
💾 Optimal space complexity: O(1)
```

## Troubleshooting

### "No code found on this page"
- Make sure you're on a supported coding website
- Ensure there's code in the editor
- Try refreshing the page and reloading the extension

### "API Error"
- Check that your Gemini API key is correct
- Ensure you have internet connection
- Verify the API key hasn't expired

### Extension not working
- Reload the extension in `chrome://extensions/`
- Check the browser console for errors
- Make sure the extension has permission for the website

## Privacy & Security

- Your API key is stored locally in Chrome's secure storage
- Code is only sent to Google's Gemini API for analysis
- No data is stored on external servers
- The extension only runs on coding websites

## Contributing

Feel free to submit issues or pull requests to improve the extension!

## License

This project is open source and available under the MIT License.
