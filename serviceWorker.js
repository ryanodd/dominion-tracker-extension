// Runs upon installing OR executing the extension
// Don't really need this at the moment

try {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('TEST: chrome.runtime.onInstalled triggered!')
  })
}
catch (error) {
  console.log("serviceWorker.js failed:")
  console.log(error)
}
