// service_worker.js
const DEFAULT_WEBHOOK = "https://willertai.app.n8n.cloud/webhook-test/19a5d8b7-edca-4284-8656-356c0c56e6bf";

async function getHook() {
  const { webhook } = await chrome.storage.sync.get({ webhook: DEFAULT_WEBHOOK });
  return webhook || DEFAULT_WEBHOOK;
}

// Get geolocation directly by injecting code into the page
async function getGeolocation(tabId) {
  try {
    // Check if geolocation is enabled
    const { geolocationEnabled } = await chrome.storage.local.get(['geolocationEnabled']);
    if (!geolocationEnabled) {
      console.log('Geolocation disabled by user');
      return null;
    }

    // Inject geolocation code directly into the page
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            console.log('Geolocation not supported in this context');
            resolve(null);
            return;
          }

          console.log('Attempting to get geolocation...');
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('Geolocation captured successfully:', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            (error) => {
              console.log('Geolocation error:', error.message, error.code);
              resolve(null);
            },
            {
              enableHighAccuracy: false, // Use network location (~50m accuracy) for privacy
              timeout: 5000,
              maximumAge: 300000
            }
          );
        });
      }
    });

    return result;
  } catch (error) {
    console.log('Error getting geolocation:', error);
    return null;
  }
}

async function capture(tab, extra = {}) {
  try {
    const hook = await getHook();
    
    // Get geolocation from content script
    const geoLocation = await getGeolocation(tab.id);
    
    const payload = {
      url: tab?.url || "",
      title: tab?.title || "",
      comment: extra.comment || "",
      captured_at: new Date().toISOString(),
      geo_location: geoLocation
    };
    
    console.log("Sending payload to webhook:", payload);
    console.log("Webhook URL:", hook);
    
    const response = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    console.log("Webhook response status:", response.status);
    console.log("Webhook response:", response);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log("Webhook response body:", responseText);
    
    // Show success notification with location info
    const locationText = geoLocation ? ' (with location)' : '';
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Capture Success',
      message: `Page captured successfully!${locationText}`
    });
    
  } catch (e) {
    console.error("Capture failed", e);
    
    // Show error notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Capture Failed',
      message: `Error: ${e.message}`
    });
  }
}

// Native prompt in page context
async function promptForComment(tabId) {
  const [{ result } = {}] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => prompt("Add a comment (optional):", "") // returns string or null
  });
  return (result ?? "").trim();
}

// Toolbar click -> prompt -> send
chrome.action.onClicked.addListener(async (tab) => {
  const comment = await promptForComment(tab.id);
  await capture(tab, { comment });
});

// Keyboard shortcut (Alt+Shift+S by default)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "capture-current-tab") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const comment = await promptForComment(tab.id);
    await capture(tab, { comment });
  }
});

// Context menu (quick capture, no prompt)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "cap-page", title: "Capture this page", contexts: ["page"] });
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "cap-page") await capture(tab);
});