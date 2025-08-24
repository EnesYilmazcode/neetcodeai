// Background service worker for the Chrome extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('NeetCode Complexity Analyzer extension installed');
});

// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
    try {
        // Check if we're on a supported site
        if (!tab.url.includes('neetcode.io') && !tab.url.includes('leetcode.com')) {
            console.log('Extension only works on NeetCode and LeetCode');
            return;
        }
        
        // Send message to content script to toggle UI
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleUI' });
    } catch (error) {
        console.log('Content script not ready, injecting...');
        
        // If content script isn't loaded, inject it manually
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
            
            await chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: ['floating-ui.css']
            });
            
            // Wait a bit for the script to initialize, then try again
            setTimeout(async () => {
                try {
                    await chrome.tabs.sendMessage(tab.id, { action: 'toggleUI' });
                } catch (e) {
                    console.log('Still unable to connect to content script');
                }
            }, 500);
            
        } catch (injectionError) {
            console.error('Failed to inject content script:', injectionError);
        }
    }
});
