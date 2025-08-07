chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Meeting Attendance Tracker v2.0 installed successfully.");
  
  // Initialize default settings
  chrome.storage.local.set({
    attendanceData: [],
    settings: {
      autoTrack: true,
      notifications: true,
      trackBreaks: true
    }
  });
});

// Listen for tab updates to detect meeting joins/leaves
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const meetingPlatforms = [
      'meet.google.com',
      'zoom.us',
      'teams.microsoft.com'
    ];
    
    const isMeetingPlatform = meetingPlatforms.some(platform => 
      tab.url.includes(platform)
    );
    
    if (isMeetingPlatform) {
      // Inject content script to start tracking
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
    }
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'meeting_joined') {
    handleMeetingJoined(request.data);
  } else if (request.action === 'meeting_left') {
    handleMeetingLeft(request.data);
  } else if (request.action === 'participants_updated') {
    handleParticipantsUpdate(request.data);
  }
  
  sendResponse({ success: true });
});

function handleMeetingJoined(data) {
  const meetingSession = {
    id: generateId(),
    platform: data.platform,
    meetingId: data.meetingId || 'unknown',
    title: data.title || 'Untitled Meeting',
    startTime: new Date().toISOString(),
    endTime: null,
    duration: 0,
    participants: [],
    breaks: []
  };
  
  chrome.storage.local.get(['attendanceData'], (result) => {
    const attendanceData = result.attendanceData || [];
    attendanceData.push(meetingSession);
    chrome.storage.local.set({ attendanceData });
  });
  
  // Show notification if enabled
  chrome.storage.local.get(['settings'], (result) => {
    if (result.settings?.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Meeting Tracking Started',
        message: `Tracking attendance for: ${meetingSession.title}`
      });
    }
  });
}

function handleMeetingLeft(data) {
  chrome.storage.local.get(['attendanceData'], (result) => {
    const attendanceData = result.attendanceData || [];
    const currentMeeting = attendanceData[attendanceData.length - 1];
    
    if (currentMeeting && !currentMeeting.endTime) {
      const endTime = new Date();
      const startTime = new Date(currentMeeting.startTime);
      const duration = Math.round((endTime - startTime) / 1000 / 60); // minutes
      
      currentMeeting.endTime = endTime.toISOString();
      currentMeeting.duration = duration;
      
      chrome.storage.local.set({ attendanceData });
      
      // Show summary notification
      chrome.storage.local.get(['settings'], (result) => {
        if (result.settings?.notifications) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Meeting Ended',
            message: `Duration: ${duration} minutes`
          });
        }
      });
    }
  });
}

function handleParticipantsUpdate(data) {
  chrome.storage.local.get(['attendanceData'], (result) => {
    const attendanceData = result.attendanceData || [];
    const currentMeeting = attendanceData[attendanceData.length - 1];
    
    if (currentMeeting && !currentMeeting.endTime) {
      currentMeeting.participants = data.participants;
      currentMeeting.participantCount = data.participants.length;
      chrome.storage.local.set({ attendanceData });
    }
  });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
