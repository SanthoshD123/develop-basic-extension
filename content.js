// Content script for detecting meeting events across platforms
let isTracking = false;
let currentPlatform = '';
let participantObserver = null;
let lastParticipantCount = 0;

// Initialize tracking when script loads
initializeTracking();

function initializeTracking() {
  // Detect platform
  const hostname = window.location.hostname;
  
  if (hostname.includes('meet.google.com')) {
    currentPlatform = 'Google Meet';
    initializeGoogleMeet();
  } else if (hostname.includes('zoom.us')) {
    currentPlatform = 'Zoom';
    initializeZoom();
  } else if (hostname.includes('teams.microsoft.com')) {
    currentPlatform = 'Microsoft Teams';
    initializeTeams();
  }
}

function initializeGoogleMeet() {
  // Wait for meeting to load
  const checkForMeeting = setInterval(() => {
    const meetingElement = document.querySelector('[data-meeting-title]') || 
                          document.querySelector('[jsname="r4nke"]') ||
                          document.querySelector('[data-call-id]');
    
    if (meetingElement && !isTracking) {
      isTracking = true;
      clearInterval(checkForMeeting);
      
      const meetingTitle = getMeetingTitle();
      const meetingId = getMeetingId();
      
      // Notify background script
      chrome.runtime.sendMessage({
        action: 'meeting_joined',
        data: {
          platform: currentPlatform,
          title: meetingTitle,
          meetingId: meetingId,
          url: window.location.href
        }
      });
      
      // Start participant tracking
      startParticipantTracking();
      
      // Monitor for leaving
      monitorMeetingEnd();
    }
  }, 2000);
  
  // Clean up if no meeting detected after 30 seconds
  setTimeout(() => clearInterval(checkForMeeting), 30000);
}

function initializeZoom() {
  // Similar implementation for Zoom
  const checkForMeeting = setInterval(() => {
    const meetingElement = document.querySelector('.meeting-client-inner') ||
                          document.querySelector('#meeting-app');
    
    if (meetingElement && !isTracking) {
      isTracking = true;
      clearInterval(checkForMeeting);
      
      chrome.runtime.sendMessage({
        action: 'meeting_joined',
        data: {
          platform: currentPlatform,
          title: 'Zoom Meeting',
          meetingId: extractZoomMeetingId(),
          url: window.location.href
        }
      });
      
      startParticipantTracking();
      monitorMeetingEnd();
    }
  }, 2000);
  
  setTimeout(() => clearInterval(checkForMeeting), 30000);
}

function initializeTeams() {
  // Similar implementation for Teams
  const checkForMeeting = setInterval(() => {
    const meetingElement = document.querySelector('[data-tid="meeting-stage"]') ||
                          document.querySelector('.ts-calling-screen');
    
    if (meetingElement && !isTracking) {
      isTracking = true;
      clearInterval(checkForMeeting);
      
      chrome.runtime.sendMessage({
        action: 'meeting_joined',
        data: {
          platform: currentPlatform,
          title: getTeamsMeetingTitle(),
          meetingId: 'teams-meeting',
          url: window.location.href
        }
      });
      
      startParticipantTracking();
      monitorMeetingEnd();
    }
  }, 2000);
  
  setTimeout(() => clearInterval(checkForMeeting), 30000);
}

function getMeetingTitle() {
  // Try multiple selectors for different Google Meet versions
  const titleSelectors = [
    '[data-meeting-title]',
    '.u6vdEc',
    '.XEazBc',
    'h1'
  ];
  
  for (let selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      return element.textContent.trim();
    }
  }
  
  return 'Google Meet';
}

function getMeetingId() {
  const url = window.location.href;
  const match = url.match(/\/([a-z]{3}-[a-z]{4}-[a-z]{3})/);
  return match ? match[1] : 'unknown';
}

function extractZoomMeetingId() {
  const url = window.location.href;
  const match = url.match(/\/j\/(\d+)/);
  return match ? match[1] : 'unknown';
}

function getTeamsMeetingTitle() {
  const titleElement = document.querySelector('[data-tid="meeting-title"]') ||
                      document.querySelector('.ts-meeting-title');
  return titleElement ? titleElement.textContent.trim() : 'Teams Meeting';
}

function startParticipantTracking() {
  // Track participant changes
  const trackParticipants = () => {
    const participants = getCurrentParticipants();
    
    if (participants.length !== lastParticipantCount) {
      lastParticipantCount = participants.length;
      
      chrome.runtime.sendMessage({
        action: 'participants_updated',
        data: {
          participants: participants,
          count: participants.length,
          timestamp: new Date().toISOString()
        }
      });
    }
  };
  
  // Initial participant count
  setTimeout(trackParticipants, 3000);
  
  // Set up observer for participant changes
  participantObserver = new MutationObserver(trackParticipants);
  
  const participantContainer = getParticipantContainer();
  if (participantContainer) {
    participantObserver.observe(participantContainer, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }
  
  // Backup interval tracking
  setInterval(trackParticipants, 30000);
}

function getCurrentParticipants() {
  let participants = [];
  
  if (currentPlatform === 'Google Meet') {
    // Google Meet participant selectors
    const participantElements = document.querySelectorAll('[data-participant-id]') ||
                               document.querySelectorAll('[jsname="Yi7BPb"]');
    
    participantElements.forEach(el => {
      const name = el.getAttribute('data-participant-name') ||
                  el.querySelector('[jsname="YSxPC"]')?.textContent ||
                  'Unknown';
      if (name && name !== 'Unknown') {
        participants.push({ name: name.trim(), platform: currentPlatform });
      }
    });
  }
  
  // If no participants found, estimate from UI elements
  if (participants.length === 0) {
    const estimatedCount = estimateParticipantCount();
    for (let i = 0; i < estimatedCount; i++) {
      participants.push({ name: `Participant ${i + 1}`, platform: currentPlatform });
    }
  }
  
  return participants;
}

function estimateParticipantCount() {
  // Try to get participant count from various UI elements
  const countSelectors = [
    '[data-participant-count]',
    '.uGOf1d', // Google Meet participant count
    '.participant-count',
    '[aria-label*="participant"]'
  ];
  
  for (let selector of countSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent || element.getAttribute('aria-label') || '';
      const match = text.match(/(\d+)/);
      if (match) {
        return parseInt(match[1]);
      }
    }
  }
  
  // Fallback: count video elements
  const videoElements = document.querySelectorAll('video');
  return Math.max(1, videoElements.length);
}

function getParticipantContainer() {
  const containerSelectors = [
    '[data-participant-list]',
    '.participants-list',
    '[jsname="cspEFd"]', // Google Meet
    '.participant-container'
  ];
  
  for (let selector of containerSelectors) {
    const container = document.querySelector(selector);
    if (container) return container;
  }
  
  // Fallback to body
  return document.body;
}

function monitorMeetingEnd() {
  // Monitor for navigation away or meeting end
  const originalUrl = window.location.href;
  
  const checkMeetingEnd = setInterval(() => {
    // Check if URL changed (left meeting)
    if (window.location.href !== originalUrl) {
      clearInterval(checkMeetingEnd);
      endTracking();
      return;
    }
    
    // Check for meeting ended indicators
    const endIndicators = [
      '.meeting-ended',
      '[data-meeting-ended]',
      'text*="meeting has ended"',
      'text*="left the meeting"'
    ];
    
    const meetingEnded = endIndicators.some(selector => 
      document.querySelector(selector)
    );
    
    if (meetingEnded) {
      clearInterval(checkMeetingEnd);
      endTracking();
    }
  }, 5000);
}

function endTracking() {
  if (isTracking) {
    isTracking = false;
    
    if (participantObserver) {
      participantObserver.disconnect();
    }
    
    chrome.runtime.sendMessage({
      action: 'meeting_left',
      data: {
        platform: currentPlatform,
        endTime: new Date().toISOString()
      }
    });
  }
}

// Handle page unload
window.addEventListener('beforeunload', endTracking);

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isTracking) {
    // User switched tabs - could indicate break
    chrome.runtime.sendMessage({
      action: 'break_started',
      data: {
        timestamp: new Date().toISOString(),
        type: 'tab_switch'
      }
    });
  }
});
