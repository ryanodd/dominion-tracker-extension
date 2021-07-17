

try {
  console.log("TEST: popup.js")

  let checkPage = document.getElementById("checkPage")
    
  checkPage.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: myScript,
    });
  })
}
catch (error) {
  console.log("popup.js failed:")
  console.log(error)
}

// The body of this function will be executed as a content script inside the
// current page
function myScript() {
  console.log("TEST: my button clicked!")
}
