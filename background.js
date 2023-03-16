chrome.runtime.onInstalled.addListener(function() {
    // Set the initial state of the feature to enabled
    chrome.storage.sync.set({ featureEnabled: true });
  });
  
  // Listen for changes to the feature state
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.featureEnabled) {
      const featureEnabled = changes.featureEnabled.newValue;
      if (featureEnabled) {
        // Enable the feature
        console.log('Feature enabled');
      } else {
        // Disable the feature
        console.log('Feature disabled');
      }
    }
  });

  /*
    Add this to manifest to trigger this.
    "background": {
     "service_worker": "background.js"
    },

    */