# Navis - AI Chat Minimap

A tiny minimap that lives on the side of your AI chat window. Like a GPS for your thoughts.

Every message you typed, every answer the AI gave, mapped out visually in seconds.

## Features

- **Visual Minimap** - See your entire conversation at a glance
- **Hover Preview** - Hover over any point to see what was said
- **Click to Navigate** - Click any bar to jump to that message instantly
- **Auto Show/Hide** - Appears when you need it, vanishes when you don't
- **Zero Data Collection** - All processing happens locally in your browser
- **Multi-Platform** - Works on ChatGPT, Gemini, and Claude

## Supported Platforms

| Platform | URL |
|----------|-----|
| ChatGPT  | chat.openai.com, chatgpt.com |
| Gemini   | gemini.google.com |
| Claude   | claude.ai |

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `navis-extension` folder
6. Navigate to any supported AI chat platform

### Chrome Web Store

Coming soon.

## Usage

- **Toggle**: Press `Ctrl+Shift+M` or click the Navis icon in the toolbar
- **Hover**: Move your mouse over any bar in the minimap to preview the message
- **Navigate**: Click any bar to scroll directly to that message
- **Auto-appear**: Move your mouse near the right edge of the screen, or scroll

## Settings

Click the Navis extension icon to configure:

- **Position** - Left or right side of the screen
- **Auto-hide** - Automatically hide after a delay
- **Min messages** - Minimum number of messages before showing the minimap

## How It Works

- **Message Detection**: Platform-specific DOM parsers identify chat messages
- **Visual Mapping**: Each message becomes a colored bar (indigo = you, gray = AI)
- **Bar Height**: Proportional to message length for quick visual scanning
- **Viewport Indicator**: Shows which part of the conversation is currently visible
- **Real-time Updates**: MutationObserver detects new messages as they appear
- **SPA Navigation**: Handles page transitions without full reloads

## Architecture

```
navis-extension/
  manifest.json          # Chrome Extension Manifest V3
  content/
    platforms.js          # Platform-specific message parsers
    minimap.js            # Core minimap UI component
    minimap.css           # Minimap styles
    main.js               # Entry point and initialization
  popup/
    popup.html            # Settings popup
    popup.css             # Popup styles
    popup.js              # Settings logic
  icons/
    icon16.png            # 16x16 toolbar icon
    icon48.png            # 48x48 extension page icon
    icon128.png           # 128x128 Chrome Web Store icon
```

## Privacy

Navis processes everything locally in your browser. It:
- Does NOT collect any data
- Does NOT make any network requests
- Does NOT store any conversation content
- Only uses `chrome.storage.sync` for your settings preferences
