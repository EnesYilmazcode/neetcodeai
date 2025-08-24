# 🧠 NeetCode Complexity Analyzer

A sleek Chrome extension that instantly analyzes the time and space complexity of your coding solutions using Google's Gemini AI. Perfect for NeetCode and LeetCode practice sessions!

## ✨ What It Does

Ever wondered if your solution is optimal? This extension automatically detects your code and provides instant complexity analysis with optimization suggestions. No more guessing – get AI-powered insights right in your browser.

## 🚀 Features

- **🎯 Instant Analysis** - One-click complexity analysis powered by Google Gemini AI
- **🎨 Clean Interface** - Floating UI inspired by NeetCode's design language
- **🔍 Smart Detection** - Automatically finds your code in Monaco, CodeMirror, and other editors
- **💡 Optimization Tips** - Shows better complexity when your solution isn't optimal
- **⚡ Zero Setup** - API key included, just install and go
- **🌐 Multi-Platform** - Works on NeetCode.io and LeetCode.com

## 📦 Installation

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/neetcodeai.git
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the downloaded folder

3. **Start Coding!**
   - Visit NeetCode.io or LeetCode.com
   - Look for the floating 🧠 button in the bottom-right corner
   - Write your solution and click "Analyze Code Complexity"

## 🎮 How to Use

### Method 1: Floating Button
- The 🧠 button appears automatically on coding websites
- Click it to open the analyzer
- Hit "Analyze Code Complexity" for instant results

### Method 2: Extension Icon
- Click the extension icon in your Chrome toolbar
- Same clean interface, same powerful analysis

### What You'll See
```
⏱️ Time Complexity: O(n²)
💾 Space Complexity: O(1)

💡 Optimization Available
Time: O(n log n)
Space: O(1)
```

## 🛠️ Technical Details

- **AI Model**: Google Gemini 1.5 Flash for fast, accurate analysis
- **Code Detection**: Advanced extraction from Monaco Editor, CodeMirror, and more
- **Supported Sites**: NeetCode.io, LeetCode.com (more coming soon)
- **Privacy**: Code is only sent to Google's API for analysis, nothing stored

## 🎨 Design Philosophy

We believe tools should be beautiful and functional. The extension features:
- Dark theme matching NeetCode's aesthetic
- Smooth animations and transitions
- Minimal, distraction-free interface
- Responsive design that doesn't interfere with coding

## 🤝 Contributing

Found a bug or have an idea? We'd love your help!

1. Fork the repository
2. Create a feature branch (`git checkout -b amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin amazing-feature`)
5. Open a Pull Request

## 📝 Common Issues

**"No code found"**
- Make sure you're on a supported website
- Ensure there's code in the editor
- Try refreshing the page

**Extension not appearing**
- Check that you're on NeetCode.io or LeetCode.com
- Reload the extension in Chrome settings
- Look for the 🧠 button in the bottom-right corner

## 🙏 Acknowledgments

- Built with ❤️ for the coding community
- Inspired by NeetCode's excellent platform and design
- Powered by Google's Gemini AI for accurate analysis

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy coding!** 🚀 May your algorithms be optimal and your complexities be logarithmic.

*Made by developers, for developers. Because we all deserve to know if our solution is actually good.*