const featureEnabledTrue = document.getElementById('featureOpen');
const featureEnabledFalse = document.getElementById('featureCopy');
const button = document.getElementById('action');
// Load the current state of the feature from storage
chrome.storage.sync.get(['featureEnabled'], function(result) {
  if (result.featureEnabled) {
    featureEnabledTrue.checked = true;
  } else {
    featureEnabledFalse.checked = true;
  }
});


// Listen for changes to the radio buttons
featureEnabledTrue.addEventListener('change', function() {
  chrome.storage.sync.set({ featureEnabled: true });
});

featureEnabledFalse.addEventListener('change', function() {
  chrome.storage.sync.set({ featureEnabled: false });
});

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function getFeatures() {
    let featureFlag = false;
    await chrome.storage.sync.get(['featureEnabled'], function (result) {
        featureFlag = result.featureEnabled;
      });
    return featureFlag;
}

async function urlSanitization(url) {
    return !url.includes("cooked.wiki")
}

async function copyPageUrl(url) {
    try {
      await navigator.clipboard.writeText(url)
      console.log('Cooking Page URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy url to your clipboard: ', err);
    }
}
  
async function openInCookWiki() {
    let tab = await getCurrentTab();
    if (tab != undefined || urlSanitization(tab.url)) {
        let cookedWikiUrl = "https://cooked.wiki/new?url=" + encodeURIComponent(tab.url);
        let featureValue = getFeatures();
        if (featureValue==true) {
            chrome.tabs.create({
                url: cookedWikiUrl
            });
        } else {
          await  copyPageUrl(cookedWikiUrl).then(function () {
            alert("Cooking Url Copied to your clipboard ");
        })
        }
        

    }
}

//Add action to button
document.addEventListener("DOMContentLoaded", function () {
    button.addEventListener("click", function () {
        openInCookWiki()
    })
});