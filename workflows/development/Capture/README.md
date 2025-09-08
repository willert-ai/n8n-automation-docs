# Capture URL → n8n Chrome Extension

A Chrome extension that allows you to quickly capture the current webpage URL, title, optional comment, and location data to an n8n webhook for further processing and automation.

## 🎯 Purpose

This extension streamlines the process of saving interesting webpages to your n8n workflow system. Whether you're researching, collecting resources, or building a knowledge base, this tool helps you capture web content with a single click, including your current location for context.

## 🔗 Complete Project Ecosystem

This Chrome extension is part of a larger automation system:

- **Chrome Extension** (this repository) - Captures webpages with comments and location
- **n8n Workflow** - Processes captured data and triggers automations
- **Webhook Integration** - Seamless data flow between extension and workflow

The complete system allows you to:
1. Capture any webpage with a single click
2. Add personal comments and notes
3. Include your current location (optional, privacy-controlled)
4. Automatically process the data in n8n
5. Trigger follow-up actions (save to database, send notifications, etc.)

## ✨ Features

- **One-click capture** - Click the extension icon to capture the current page
- **Optional comments** - Add personal notes to your captures
- **Location capture** - Include your current position (privacy-controlled, opt-in)
- **Multiple capture methods**:
  - Click the extension icon in the toolbar
  - Use keyboard shortcut `Alt+Shift+S`
  - Right-click on any page and select "Capture this page"
- **Custom webhook configuration** - Set your own n8n webhook URL
- **Privacy-first design** - Location capture is disabled by default
- **Success/error notifications** - Visual feedback for each capture
- **Structured data** - Sends clean JSON data to your n8n workflow

## 📊 Data Format

The extension sends the following JSON payload to your n8n webhook:

### With Location Enabled
```json
{
  "url": "https://example.com/page",
  "title": "Page Title",
  "comment": "Your optional comment",
  "captured_at": "2025-01-27T10:30:45.123Z",
  "geo_location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "accuracy": 10
  }
}
```

### With Location Disabled
```json
{
  "url": "https://example.com/page",
  "title": "Page Title",
  "comment": "Your optional comment",
  "captured_at": "2025-01-27T10:30:45.123Z",
  "geo_location": null
}
```

## 🔒 Privacy & Location Data

- **Opt-in by default** - Location capture is disabled by default
- **One-time permission** - User grants location permission once in settings
- **Non-blocking** - URL capture works even if location fails
- **5-second timeout** - Won't delay capture if location is slow
- **Clear privacy notice** - User understands what data is collected
- **User control** - Easy toggle in settings

## 🚀 Installation

### Prerequisites

- Google Chrome browser
- An n8n instance with a webhook node configured

### Step-by-Step Installation

1. **Open Chrome Extensions**
   - Open a new tab in Chrome
   - Type `chrome://extensions` into the address bar and press Enter

2. **Enable Developer Mode**
   - In the top-right corner of the Extensions page, click the toggle switch for "Developer mode"
   - This will reveal additional buttons at the top

3. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to and select the folder containing your extension files
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Capture URL → n8n" and click the pin icon
   - Your extension icon should now be visible in the toolbar

## ⚙️ Configuration

### Setting Up Your n8n Webhook

1. **Create a Webhook Node** in your n8n workflow
2. **Set HTTP Method** to "POST"
3. **Copy the webhook URL** from n8n
4. **Configure the Extension**:
   - Right-click the extension icon → "Options"
   - Paste your n8n webhook URL
   - Optionally enable location capture
   - Click "Save Settings"

### Default Webhook

The extension comes with a default test webhook URL that you can use for testing:
```
https://willertai.app.n8n.cloud/webhook-test/19a5d8b7-edca-4284-8656-356c0c56e6bf
```

### Related n8n Workflow

This extension is designed to work with the corresponding n8n workflow:
- **Workflow URL**: https://willertai.app.n8n.cloud/workflow/ybqL6Lybsmegr8xk
- **Purpose**: Processes captured URLs and comments from the Chrome extension
- **Integration**: The webhook node in this workflow receives the JSON data from the extension

## 🎮 Usage

### Method 1: Toolbar Click
1. Click the extension icon in your Chrome toolbar
2. Add an optional comment in the prompt dialog
3. Click "OK" to capture the page (with location if enabled)

### Method 2: Keyboard Shortcut
1. Press `Alt+Shift+S` on any webpage
2. Add an optional comment in the prompt dialog
3. Click "OK" to capture the page (with location if enabled)

### Method 3: Right-Click Menu
1. Right-click anywhere on a webpage
2. Select "Capture this page" from the context menu
3. The page will be captured without a comment prompt (with location if enabled)

## 📁 Project Structure

```
Capture/
├── manifest.json          # Extension configuration
├── service_worker.js      # Background script with webhook logic
├── options.html          # Settings page for webhook configuration
├── options.js            # Settings page functionality
├── icons/                # Chrome extension icons
│   ├── icon16.png        # 16x16 pixels
│   ├── icon32.png        # 32x32 pixels
│   ├── icon48.png        # 48x48 pixels
│   └── icon128.png       # 128x128 pixels
├── Capture.png           # Original logo file
└── README.md            # This documentation
```

## 🔧 Technical Details

### Permissions Required

- `activeTab` - Access to the current tab's URL and title
- `storage` - Save webhook configuration and location preferences
- `scripting` - Inject prompt dialog into pages
- `contextMenus` - Add right-click menu option
- `notifications` - Show success/error messages
- `geolocation` - Access to device location (when enabled)

### Browser Compatibility

- Chrome (Manifest V3)
- Chromium-based browsers (Edge, Brave, etc.)

## 🛠️ Development

### Icon Generation

The extension icons were generated from the original `Capture.png` logo using Node.js and the Sharp library:

```bash
# Install dependencies
npm install sharp

# Generate icons
node generate-icons.js
```

### File Descriptions

- **`manifest.json`** - Defines the extension's permissions, icons, and behavior
- **`service_worker.js`** - Handles webhook communication, geolocation, and user interactions
- **`options.html/js`** - Settings page for webhook URL and location preferences

## 🐛 Troubleshooting

### Extension Not Working

1. **Check Developer Console**:
   - Go to `chrome://extensions`
   - Click "service worker" under your extension
   - Look for error messages in the console

2. **Verify Webhook URL**:
   - Right-click extension icon → "Options"
   - Ensure the webhook URL is correct
   - Test the URL in a new tab

3. **Check n8n Workflow**:
   - Ensure your n8n webhook is active
   - Click "Execute workflow" in test mode
   - Check n8n execution logs

### Location Issues

1. **Location Not Captured**:
   - Check if location capture is enabled in settings
   - Verify location permission is granted
   - Check browser location settings

2. **Permission Denied**:
   - Go to Chrome settings → Privacy and security → Site settings
   - Find your extension and enable location access
   - Or disable location capture in extension settings

### Common Issues

- **"Webhook not registered"** - Activate your n8n webhook by clicking "Execute workflow"
- **"Permission denied"** - Ensure the extension has all required permissions
- **"Network error"** - Check your internet connection and webhook URL
- **"Location timeout"** - Location capture has a 5-second timeout; this is normal

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this extension.

---

**Happy capturing!** 🎯