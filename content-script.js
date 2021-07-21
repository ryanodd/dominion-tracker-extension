
function injectOverlay() {
  const containerDivStyle = '\
    position: absolute;\
    left: 5px;\
    bottom: 5px;\
    z-index: 100;\
  ';
  let containerDiv = document.createElement('div');
  containerDiv.id = 'dt-container'
  containerDiv.style = containerDivStyle
  document.querySelector('body').append(containerDiv);
  
  const iframeStyle = '\
    width: calc(100vw - 10px);\
    height: 600px;\
    border: 0;\
  ';
  let iframe = document.createElement('iframe');
  iframe.title = 'Dominion Tracker Overlay'
  iframe.src = 'https://dominiontracker.com/#/overlay';
  // iframe.src = 'http://localhost:3000/#/overlay';
  iframe.id = 'dt-iframe'
  iframe.style = iframeStyle + 'display: none;'
  document.querySelector('#dt-container').append(iframe);

  const buttonStyle = '\
    display: block;\
    padding: 8px 12px;\
    background-color: #ff0000;\
    color: white;\
    text-decoration: none;\
    border: none;\
    border-radius: 4px;\
  '
  let toggleButton = document.createElement('button');
  toggleButton.textContent = 'DECK'
  toggleButton.style = buttonStyle
  toggleButton.onclick = () => {
    let detectedIframe = document.querySelector('#dt-iframe')
    console.log(detectedIframe.style)
    let isTrackerOpen = detectedIframe.style.display === 'inline'
    detectedIframe.style.display = isTrackerOpen ? 'none' : 'inline'
  }
  document.querySelector('#dt-container').append(toggleButton);
}

function watchLog() {
  let iframe = document.querySelector('#dt-iframe')
  iframe.contentWindow.console = console;
  let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      if (
        mutation.target.className === 'log-line' &&
        mutation.addedNodes.length >= 1
      ) {
        let logSearchResults = document.getElementsByClassName('game-log')
        if (logSearchResults.length === 1) {
          wholeLog = logSearchResults[0].innerText
          iframe.contentWindow.postMessage(wholeLog, '*')
        } else {
          console.error('TRACKER ERROR: saw log line added, but couldn\'t find game log.')
        }
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}

try {
  injectOverlay()
  watchLog()
} catch (error) {
  console.error('Content-script error:', error)
}
