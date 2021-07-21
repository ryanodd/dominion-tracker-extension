try {
  let checkPage = document.querySelector("#checkPage")

  checkPage.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url !== "https://dominion.games/") {
      console.error('Not on dominion.games! exiting...')
      return
    }
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   function: injectOverlay,
    // });
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   function: watchLog,
    // });
  })
}
catch (error) {
  console.log("popup.js failed:")
  console.log(error)
}
