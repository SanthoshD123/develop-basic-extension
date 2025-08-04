# Smart Meeting Attendance Tracker (basic extension)

A Chrome extension that helps track attendance across meetings by storing user email information for seamless meeting participation.

## Features

- 📧 **Email Storage**: Securely store your email address locally in the browser
- 🔒 **Privacy-First**: All data is stored locally using Chrome's storage API
- 🎯 **Simple Setup**: Easy one-time configuration through a clean popup interface
- ⚡ **Lightweight**: Minimal resource usage with efficient background service worker

## Installation

### From Source (Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/develop-basic-extension.git
   cd develop-basic-extension
   ```

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked" and select the project directory
   - The extension icon should appear in your Chrome toolbar

### From Chrome Web Store
*Coming soon - extension is currently in development*

## Usage

1. **Initial Setup**
   - Click the extension icon in your Chrome toolbar
   - Enter your email address in the popup
   - Click "Save" to store your email locally

2. **Managing Your Email**
   - Click the extension icon anytime to view or update your stored email
   - Your email is saved automatically and persists across browser sessions

## File Structure

```
develop-basic-extension/
├── manifest.json      # Extension configuration and permissions
├── background.js      # Background service worker
├── popup.html         # Extension popup interface
├── popup.js          # Popup functionality and email handling
├── icon.png          # Extension icon (128x128px)
└── README.md         # This file
```

## Technical Details

### Permissions Required
- `storage`: Store user email locally
- `tabs`: Access tab information
- `activeTab`: Interact with the currently active tab

### Storage
The extension uses Chrome's `chrome.storage.local` API to store user data locally on the device. No data is transmitted to external servers.

### Browser Compatibility
- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Development

### Prerequisites
- Google Chrome (latest version)
- Basic understanding of HTML, CSS, and JavaScript

### Making Changes
1. Edit the relevant files (`popup.html`, `popup.js`, `background.js`)
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension card to reload changes
4. Test your changes by clicking the extension icon

### Key Files Explained

**manifest.json**
- Defines extension metadata, permissions, and file references
- Uses Manifest V3 (latest Chrome extension format)

**background.js**
- Service worker that runs in the background
- Currently logs installation confirmation

**popup.html/popup.js**
- User interface for email input and storage
- Handles form validation and Chrome storage integration

## Roadmap

- [ ] **Meeting Platform Integration**: Auto-fill email on popular meeting platforms
- [ ] **Attendance History**: Track meeting participation over time
- [ ] **Multiple Email Support**: Store and switch between different email addresses
- [ ] **Export Functionality**: Export attendance data for reporting
- [ ] **Calendar Integration**: Sync with Google Calendar or Outlook

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy & Security

- **Local Storage Only**: Your email is stored locally on your device using Chrome's secure storage API
- **No Data Transmission**: The extension does not send any data to external servers
- **Open Source**: All code is publicly available for audit and review

## Troubleshooting

**Extension not loading?**
- Ensure you have Developer mode enabled in `chrome://extensions/`
- Check that all files are present in the directory
- Look for error messages in the Extensions page

**Can't save email?**
- Make sure you've entered a valid email format
- Check Chrome's storage permissions are granted
- Try reloading the extension

**Extension icon not appearing?**
- Check if the extension is enabled in `chrome://extensions/`
- Ensure `icon.png` file exists and is properly sized (128x128px)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review Chrome's extension development documentation

---

**Version**: 1.0  
**Last Updated**: August 2025  
