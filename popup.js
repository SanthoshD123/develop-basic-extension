document.addEventListener('DOMContentLoaded', () => {
  initializePopup();
  setupEventListeners();
  loadDashboardData();
});

function initializePopup() {
  // Load saved user data
  chrome.storage.local.get(['userEmail', 'userName', 'userOrganization', 'settings'], (result) => {
    if (result.userEmail) {
      document.getElementById('emailInput').value = result.userEmail;
    }
    if (result.userName) {
      document.getElementById('nameInput').value = result.userName;
    }
    if (result.userOrganization) {
      document.getElementById('organizationInput').value = result.userOrganization;
    }
    if (result.settings) {
      loadSettings(result.settings);
    }
  });
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const tabName = e.target.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Setup tab buttons
  document.getElementById('saveBtn').addEventListener('click', saveProfile);
  document.getElementById('exportBtn').addEventListener('click', exportData);

  // Dashboard tab buttons
  document.getElementById('clearDataBtn').addEventListener('click', clearAllData);

  // Settings tab buttons
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
}

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tabName).classList.add('active');

  // Load data for specific tabs
  if (tabName === 'dashboard') {
    loadDashboardData();
  }
}

function saveProfile() {
  const email = document.getElementById('emailInput').value;
  const name = document.getElementById('nameInput').value;
  const organization = document.getElementById('organizationInput').value;

  if (!email) {
    showStatus("Please enter your email!", "error");
    return;
  }

  if (!name) {
    showStatus("Please enter your full name!", "error");
    return;
  }

  const profileData = {
    userEmail: email,
    userName: name,
    userOrganization: organization,
    profileSetup: true,
    setupDate: new Date().toISOString()
  };

  chrome.storage.local.set(profileData, () => {
    showStatus("Profile saved successfully!", "success");
    
    // Auto-switch to dashboard after successful save
    setTimeout(() => {
      switchTab('dashboard');
    }, 1500);
  });
}

function exportData() {
  chrome.storage.local.get(['attendanceData', 'userEmail', 'userName'], (result) => {
    const data = {
      profile: {
        email: result.userEmail,
        name: result.userName,
        exportDate: new Date().toISOString()
      },
      meetings: result.attendanceData || []
    };

    // Create downloadable file
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-attendance-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showStatus("Data exported successfully!", "success");
  });
}

function loadDashboardData() {
  chrome.storage.local.get(['attendanceData'], (result) => {
    const meetings = result.attendanceData || [];
    
    updateDashboardStats(meetings);
    updateMeetingList(meetings);
  });
}

function updateDashboardStats(meetings) {
  const totalMeetings = meetings.length;
  const totalMinutes = meetings.reduce((sum, meeting) => sum + (meeting.duration || 0), 0);
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
  const avgDuration = totalMeetings > 0 ? Math.round(totalMinutes / totalMeetings) : 0;
  
  // Calculate this week's meetings
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekMeetings = meetings.filter(meeting => 
    new Date(meeting.startTime) > oneWeekAgo
  ).length;

  // Update UI
  document.getElementById('totalMeetings').textContent = totalMeetings;
  document.getElementById('totalHours').textContent = `${totalHours}h`;
  document.getElementById('avgDuration').textContent = `${avgDuration}m`;
  document.getElementById('thisWeek').textContent = thisWeekMeetings;
}

function updateMeetingList(meetings) {
  const meetingListElement = document.getElementById('meetingList');
  
  if (meetings.length === 0) {
    meetingListElement.innerHTML = '<div class="loading">No meetings tracked yet</div>';
    return;
  }

  // Sort meetings by start time (most recent first)
  const sortedMeetings = meetings.sort((a, b) => 
    new Date(b.startTime) - new Date(a.startTime)
  );

  const meetingHtml = sortedMeetings.slice(0, 10).map(meeting => {
    const startTime = new Date(meeting.startTime);
    const formattedDate = startTime.toLocaleDateString();
    const formattedTime = startTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const duration = meeting.duration || 0;
    const participantCount = meeting.participantCount || 0;
    
    return `
      <div class="meeting-item">
        <div class="meeting-title">${meeting.title}</div>
        <div class="meeting-details">
          ${formattedDate} at ${formattedTime} • ${duration}m • ${participantCount} participants
        </div>
        <div class="meeting-details" style="margin-top: 2px;">
          Platform: ${meeting.platform}
        </div>
      </div>
    `;
  }).join('');

  meetingListElement.innerHTML = meetingHtml;
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all meeting data? This cannot be undone.')) {
    chrome.storage.local.set({ attendanceData: [] }, () => {
      loadDashboardData();
      showStatus("All data cleared successfully!", "success");
    });
  }
}

function saveSettings() {
  const settings = {
    autoTrack: document.getElementById('autoTrackCheck').checked,
    notifications: document.getElementById('notificationsCheck').checked,
    trackBreaks: document.getElementById('trackBreaksCheck').checked,
    reminderTime: parseInt(document.getElementById('reminderTime').value)
  };

  chrome.storage.local.set({ settings }, () => {
    showStatus("Settings saved successfully!", "success");
  });
}

function loadSettings(settings) {
  document.getElementById('autoTrackCheck').checked = settings.autoTrack !== false;
  document.getElementById('notificationsCheck').checked = settings.notifications !== false;
  document.getElementById('trackBreaksCheck').checked = settings.trackBreaks !== false;
  document.getElementById('reminderTime').value = settings.reminderTime || 10;
}

function showStatus(message, type = "success") {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  statusElement.style.display = 'block';

  setTimeout(() => {
    statusElement.style.display = 'none';
  }, 3000);
}

// Real-time updates
setInterval(() => {
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab && activeTab.id === 'dashboard') {
    loadDashboardData();
  }
}, 30000); // Update every 30 seconds

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'meeting_updated') {
    loadDashboardData();
  }
});
