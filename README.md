# 📊 Smart Meeting Attendance Tracker

A powerful Chrome extension that automatically tracks attendance, participation, and analytics across popular video meeting platforms. Get detailed insights into your meeting habits with real-time monitoring and comprehensive reporting.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![Version](https://img.shields.io/badge/Version-2.0-green)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🎯 **Multi-Platform Support**
- **Google Meet** - Full integration with participant tracking
- **Zoom** - Meeting detection and duration tracking  
- **Microsoft Teams** - Comprehensive attendance monitoring
- More platforms planned for future releases

### 📈 **Advanced Analytics**
- **Real-time Tracking** - Automatic meeting detection and attendance logging
- **Participant Monitoring** - Track participant count and changes during meetings
- **Duration Analytics** - Precise meeting duration with break detection
- **Weekly Statistics** - Comprehensive reporting and trends
- **Export Functionality** - JSON export for external analysis

### 🔧 **Smart Features**
- **Auto-Detection** - Seamlessly detects when you join/leave meetings
- **Background Monitoring** - Runs efficiently without impacting browser performance
- **Break Tracking** - Monitors tab switches and potential break times
- **Notification System** - Optional alerts for meeting start/end
- **Privacy-First** - All data stored locally, never sent to external servers

### 💼 **Professional Tools**
- **Profile Management** - Store email, name, and organization details
- **Meeting History** - Detailed logs with timestamps and participant counts
- **Data Export** - Professional reports in JSON format
- **Settings Control** - Customizable tracking preferences

## 🚀 Quick Start

### Installation

#### Option 1: From Source (Recommended for Development)

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/smart-meeting-tracker.git
   cd smart-meeting-tracker
   ```

2. **Install in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right)
   - Click **"Load unpacked"** and select the project folder
   - The extension icon will appear in your toolbar

#### Option 2: Chrome Web Store
*Coming Soon - Extension under review*

### Initial Setup

1. **Click the extension icon** in your Chrome toolbar
2. **Enter your profile information:**
   - Email address
   - Full name  
   - Organization (optional)
3. **Configure settings** (optional):
   - Auto-tracking preferences
   - Notification settings
   - Break monitoring
4. **Start using** - The extension will automatically detect and track meetings!

## 📱 Usage Guide

### Dashboard Overview

The extension provides three main sections:

#### 🔧 **Setup Tab**
- Configure your profile information
- Export your meeting data
- View setup status

#### 📊 **Dashboard Tab**
- **Meeting Statistics**: Total meetings, hours, and averages
- **Recent Activity**: List of recent meetings with details
- **Weekly Trends**: This week's meeting count
- **Data Management**: Clear all data option

#### ⚙️ **Settings Tab**
- **Auto-tracking**: Enable/disable automatic meeting detection
- **Notifications**: Toggle meeting start/end notifications
- **Break Tracking**: Monitor tab switches during meetings
- **Reminders**: Set pre-meeting notification timing
- **Platform Status**: View supported meeting platforms

### Automatic Tracking

The extension automatically:

1. **Detects** when you join a meeting on supported platforms
2. **Records** meeting start time, title, and platform
3. **Monitors** participant count changes during the meeting
4. **Tracks** meeting duration and break times
5. **Saves** complete meeting data for analytics

### Data Export

Export your meeting data for:
- **Performance Reviews** - Show meeting participation
- **Time Tracking** - Calculate billable meeting hours
- **Analytics** - Import into Excel/Google Sheets for deeper analysis
- **Backup** - Keep personal records of meeting attendance

## 🏗️ Technical Architecture

### File Structure

```
smart-meeting-tracker/
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker for background processing
├── content.js            # Meeting platform integration scripts
├── popup.html            # User interface layout
├── popup.js              # Frontend logic and data management
├── icon.png              # Extension icon (128x128px)
└── README.md             # This documentation
```

### Key Components

#### **Background Service Worker** (`background.js`)
- Manages extension lifecycle and installation
- Handles tab monitoring for meeting platform detection  
- Processes meeting events (join/leave/participant changes)
- Manages Chrome storage operations
- Sends notifications when enabled

#### **Content Script** (`content.js`)
- Injected into meeting platform pages
- Detects meeting start/end events across platforms
- Monitors participant count changes in real-time
- Handles platform-specific meeting data extraction
- Communicates with background script via message passing

#### **Popup Interface** (`popup.html` + `popup.js`)
- Modern, responsive user interface with tabbed design
- Real-time dashboard with meeting statistics
- Profile management and settings configuration
- Data export functionality and meeting history display

### Platform Integration Details

#### **Google Meet**
- Detects meetings via DOM element monitoring
- Extracts meeting titles and IDs from page elements
- Tracks participant count from UI indicators
- Monitors for meeting end via URL changes

#### **Zoom**
- Identifies meeting client interface elements
- Extracts meeting IDs from URL patterns
- Monitors meeting container for status changes
- Tracks participant changes via DOM observers

#### **Microsoft Teams**
- Detects Teams meeting interface
- Extracts meeting titles from page metadata
- Monitors calling screen elements for status
- Tracks participant containers for count updates

## 🔒 Privacy & Security

### Data Storage
- **100% Local Storage** - All data stored in Chrome's local storage API
- **No External Servers** - Zero data transmission to external services
- **No User Tracking** - Extension doesn't track browsing outside meetings
- **Secure APIs** - Uses Chrome's secure extension APIs exclusively

### Permissions Explained

| Permission | Purpose | Privacy Impact |
|------------|---------|----------------|
| `storage` | Store meeting data locally | Data never leaves your device |
| `tabs` | Detect meeting platform tabs | Only monitors meeting URLs |
| `activeTab` | Interact with meeting pages | Only when meetings are active |
| `scripting` | Inject meeting detection code | Only on supported platforms |
| `notifications` | Show meeting alerts | Optional, can be disabled |

### Host Permissions
- Limited to meeting platforms only: Google Meet, Zoom, Microsoft Teams
- No access to other websites or browsing data
- Minimal permission scope for maximum privacy

## ⚙️ Configuration Options

### Settings Available

- **Auto-tracking**: Automatically detect and track meetings
- **Notifications**: Show desktop notifications for meeting events  
- **Break Tracking**: Monitor tab switches during meetings
- **Meeting Reminders**: Configurable pre-meeting notifications (5-15 minutes)
- **Data Export**: JSON format export for external analysis

### Supported Browsers

- **Google Chrome** (Primary support)
- **Microsoft Edge** (Chromium-based)
- **Brave Browser** (Chromium-based)
- **Other Chromium browsers** (May work but not officially tested)

## 📊 Analytics & Reporting

### Available Metrics

- **Total Meetings Attended**
- **Total Meeting Hours**  
- **Average Meeting Duration**
- **Weekly Meeting Count**
- **Meeting Platform Distribution**
- **Participant Count Trends**
- **Break Time Analysis**

### Export Format

```json
{
  "profile": {
    "email": "user@example.com",
    "name": "John Doe",
    "exportDate": "2025-08-11T12:00:00.000Z"
  },
  "meetings": [
    {
      "id": "meeting-id-123",
      "platform": "Google Meet",
      "title": "Weekly Team Standup",
      "startTime": "2025-08-11T09:00:00.000Z",
      "endTime": "2025-08-11T09:30:00.000Z", 
      "duration": 30,
      "participantCount": 8,
      "participants": [...],
      "breaks": [...]
    }
  ]
}
```

## 🛠️ Development

### Prerequisites
- Google Chrome (latest version)
- Basic knowledge of HTML, CSS, JavaScript
- Familiarity with Chrome Extension APIs

### Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/smart-meeting-tracker.git
   cd smart-meeting-tracker
   ```

2. **Load in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked" → select project directory

3. **Make Changes**
   - Edit source files
   - Click refresh icon in extensions page
   - Test changes by joining a meeting

### Key Development Areas

#### **Adding New Platforms**
1. Add platform URL to `manifest.json` host permissions
2. Create detection logic in `content.js`
3. Add platform-specific selectors and monitoring
4. Test meeting detection and participant tracking

#### **Extending Analytics**
1. Modify data structure in `background.js`
2. Update storage schema for new metrics
3. Enhance popup dashboard with new visualizations
4. Update export format to include new data

#### **UI Improvements**
1. Modify `popup.html` for layout changes
2. Update `popup.js` for new functionality
3. Enhance CSS styling for better UX
4. Test across different screen sizes

### Testing Checklist

- [ ] Meeting detection on all supported platforms
- [ ] Participant count tracking accuracy  
- [ ] Meeting duration calculation
- [ ] Data persistence across browser restarts
- [ ] Export functionality works correctly
- [ ] Notifications appear when enabled
- [ ] Settings save and load properly

## 🗺️ Roadmap

### Version 2.1 (Next Release)
- [ ] **Calendar Integration** - Sync with Google Calendar/Outlook
- [ ] **Meeting Insights** - Advanced analytics dashboard
- [ ] **Custom Reports** - Configurable reporting options
- [ ] **Meeting Notes** - Add notes to meeting records

### Version 2.5 (Medium Term)
- [ ] **Slack Integration** - Connect with Slack for team insights
- [ ] **CSV Export** - Additional export format options  
- [ ] **Meeting Ratings** - Rate meeting effectiveness
- [ ] **Time Zone Support** - Multi-timezone meeting tracking

### Version 3.0 (Long Term)
- [ ] **Team Analytics** - Aggregate team meeting data
- [ ] **AI Insights** - Smart meeting pattern analysis
- [ ] **Mobile Companion** - Mobile app for meeting tracking
- [ ] **API Access** - Developer API for integrations

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Ways to Contribute

1. **🐛 Bug Reports** - Found an issue? [Open an issue](https://github.com/yourusername/smart-meeting-tracker/issues)
2. **💡 Feature Requests** - Have an idea? [Suggest a feature](https://github.com/yourusername/smart-meeting-tracker/issues)
3. **🔧 Code Contributions** - Submit a pull request
4. **📚 Documentation** - Help improve our docs
5. **🧪 Testing** - Test on different platforms and report findings

### Development Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes with clear, commented code
4. **Test** thoroughly on all supported platforms
5. **Commit** with descriptive messages (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)  
7. **Submit** a Pull Request with detailed description

### Code Standards

- Use clear, descriptive variable names
- Comment complex logic and platform-specific code
- Follow existing code formatting and structure
- Test on multiple meeting platforms before submitting
- Update documentation for new features

## ❓ Troubleshooting

### Common Issues

#### **Extension Not Loading**
- ✅ Ensure Developer mode is enabled in `chrome://extensions/`
- ✅ Check that all files are present in the directory
- ✅ Look for error messages in the Extensions page
- ✅ Verify Chrome version compatibility

#### **Meetings Not Being Detected**
- ✅ Confirm you're on a supported platform (Meet, Zoom, Teams)
- ✅ Check that the extension has permission to access the site
- ✅ Reload the meeting page after installing the extension
- ✅ Verify auto-tracking is enabled in Settings

#### **Data Not Saving**
- ✅ Check Chrome storage permissions are granted
- ✅ Ensure enough storage space is available
- ✅ Try clearing and re-entering your profile information
- ✅ Check browser console for error messages

#### **Export Not Working**
- ✅ Verify you have meeting data to export
- ✅ Check browser download settings and permissions
- ✅ Try exporting from a different tab
- ✅ Ensure popup blockers aren't interfering

#### **Notifications Not Appearing**
- ✅ Check that notifications are enabled in extension settings
- ✅ Verify Chrome notification permissions are granted
- ✅ Check system notification settings (Windows/Mac)
- ✅ Try refreshing the extension

### Getting Help

1. **📖 Check Documentation** - Review this README and inline help
2. **🔍 Search Issues** - Look through [existing issues](https://github.com/yourusername/smart-meeting-tracker/issues)
3. **💬 Ask Questions** - [Open a discussion](https://github.com/yourusername/smart-meeting-tracker/discussions)
4. **🐛 Report Bugs** - [Create an issue](https://github.com/yourusername/smart-meeting-tracker/issues/new) with details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial Use** - Use in commercial projects
- ✅ **Modification** - Modify and distribute modified versions  
- ✅ **Distribution** - Distribute original or modified versions
- ✅ **Private Use** - Use privately without restrictions
- ⚠️ **Liability** - No warranty or liability from authors
- ⚠️ **Attribution** - Must include original license and copyright

## 🙏 Acknowledgments

- **Chrome Extension Team** - For excellent Manifest V3 documentation
- **Meeting Platform Teams** - Google Meet, Zoom, Microsoft Teams
- **Open Source Community** - For inspiration and best practices
- **Beta Testers** - Early adopters who provided valuable feedback


---

*Smart Meeting Attendance Tracker v2.0 - Making meeting analytics simple and private.*
