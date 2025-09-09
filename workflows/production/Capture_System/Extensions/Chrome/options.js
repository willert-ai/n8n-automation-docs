// options.js
document.addEventListener('DOMContentLoaded', async () => {
  const webhookInput = document.getElementById('webhook-url');
  const geolocationCheckbox = document.getElementById('geolocation-enabled');
  const saveButton = document.getElementById('save');
  const status = document.getElementById('status');

  // Load saved settings
  const { webhook, geolocationEnabled } = await chrome.storage.sync.get({ 
    webhook: '',
    geolocationEnabled: false 
  });
  
  webhookInput.value = webhook;
  geolocationCheckbox.checked = geolocationEnabled;

  // Save settings
  saveButton.addEventListener('click', async () => {
    const webhookUrl = webhookInput.value.trim();
    const geolocationEnabled = geolocationCheckbox.checked;
    
    if (!webhookUrl) {
      showStatus('Please enter a webhook URL', 'error');
      return;
    }

    try {
      // Save to sync storage (webhook) and local storage (geolocation preference)
      await chrome.storage.sync.set({ webhook: webhookUrl });
      await chrome.storage.local.set({ geolocationEnabled: geolocationEnabled });
      
      // If geolocation is being enabled, request permission
      if (geolocationEnabled) {
        try {
          await requestGeolocationPermission();
          showStatus('Settings saved successfully! Location permission granted.', 'success');
        } catch (error) {
          showStatus('Settings saved, but location permission was denied. You can enable it later in Chrome settings.', 'error');
        }
      } else {
        showStatus('Settings saved successfully!', 'success');
      }
    } catch (error) {
      showStatus('Error saving settings: ' + error.message, 'error');
    }
  });

  // Request geolocation permission
  async function requestGeolocationPermission() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          console.log('Geolocation permission granted');
          resolve();
        },
        (error) => {
          console.log('Geolocation permission denied:', error.message);
          reject(error);
        },
        { timeout: 10000 }
      );
    });
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 5000);
  }
});