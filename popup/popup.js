
function injectOverlay() { 
  let iframe = document.createElement('iframe');
  iframe.title = 'Dominion Tracker Overlay'
  // iframe.src = 'https://dominiontracker.com/#/overlay';
  iframe.src = 'http://localhost:3000/#/overlay';
  iframe.style = '\
  position: fixed;\
  width: 100%;\
  height: 100%;\
  top: 0;\
  left: 0;\
  border: 0;\
  z-index: 100;\
  pointer-events: none;\
  '

  document.querySelector('body').append(iframe);
}

function watchLog() { 
  console.log("TEST: watchLog start")
  let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      if (
        mutation.target.className === 'log-line' &&
        mutation.addedNodes.length >= 1
      ) {
        // This is where we want to execute the log-reading function.
        // The catch is: this might happen like 5 times in a short span,
        // if 5 lines are added in a short span.
        // Probably want to throttle this by time. Or, make LOTS of api calls.
        console.log(mutation)
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}



try {
  let checkPage = document.getElementById("checkPage")
    
  checkPage.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   files: ['injectOverlay.js'],
    // });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: watchLog,
    });
  })
}
catch (error) {
  console.log("popup.js failed:")
  console.log(error)
}
