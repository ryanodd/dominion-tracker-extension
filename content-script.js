
function attemptReadLog() {
  let toggleButton = document.querySelector('#dt-toggleButton')

  let logSearchResults = document.getElementsByClassName('log-container')
  if (logSearchResults.length === 1) {
    logContainerNode = logSearchResults[0]
    
    if (toggleButton.style.display === 'inline') {
      let iframe = document.querySelector('#dt-iframe')
      wholeLog = logContainerNode.innerText
      iframe.contentWindow.postMessage(wholeLog, '*')
    }
    else {
      onGameStartDetect()
    }
  }
  else {
    if (toggleButton.style.display === 'inline'){
      onGameFinishDetect()
    }
  }
}

function onGameStartDetect() {
  if (setOverlayPlacement()) {
    setOverlayVisible(true)
  }
}

function setOverlayPlacement() {
  let logSearchResults = document.getElementsByClassName('log-container')
  let tabContainerSearchResults = document.getElementsByClassName('tab-container')
  if (logSearchResults.length === 1 && tabContainerSearchResults.length === 1) {
    logContainerNode = logSearchResults[0]
    tabContainerNode = tabContainerSearchResults[0]
    let toggleButton = document.querySelector('#dt-toggleButton')
    let iframe = document.querySelector('#dt-iframe')

    toggleButton.style.top = `${tabContainerNode.getBoundingClientRect().top + 2}px`// 2px border
    toggleButton.style.left = `${tabContainerNode.getBoundingClientRect().left}px`
    toggleButton.style.bottom = '0px'
    iframe.style.top = `${logContainerNode.getBoundingClientRect().top + 2}px` // 2px border
    iframe.style.left = `${logContainerNode.getBoundingClientRect().left}px`
    iframe.style.height = `${logContainerNode.getBoundingClientRect().height - 2}px` // 2px border
    iframe.style.width = `${logContainerNode.getBoundingClientRect().width}px`
    
    return true
  }
  return false
}

function setOverlayVisible(visible) {
  let toggleButton = document.querySelector('#dt-toggleButton')
  toggleButton.style.display = visible ? 'inline' : 'none'
  let iframe = document.querySelector('#dt-iframe')
  iframe.style.display = 'none'
}

function onGameFinishDetect() {
  setOverlayVisible(false)
}

function watchLog() {
  attemptReadLog()
  let logObserver = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      // This DOM-change watcher needs to cover all possible things to watch:
      // - A line being added to the log
      // - The entire log disappearing (game end)
      // - The entire log appearing (game start)
      if (
        mutation.target.className === 'log-line' ||
        mutation.target.hasAttribute('ng-if')) {
        attemptReadLog()
      }
    }
  });
  logObserver.observe(document, { childList: true, subtree: true });

  let resizeObserver = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      // This DOM-change watcher needs to cover all possible things to watch:
      // - The chat container being minimized/shown
      if (mutation.target.className.split(' ').includes('chat-container')){
        setTimeout(setOverlayPlacement, 400)
      }
    }
  });
  resizeObserver.observe(document, { childList: true, subtree: true, attributes: true });
  window.addEventListener('resize', setOverlayPlacement);
}

function injectOverlay() {
  let containerDiv = document.createElement('div');
  containerDiv.id = 'dt-container'
  containerDiv.style.position = 'absolute'
  containerDiv.style.zIndex = '100'
  document.querySelector('body').append(containerDiv);
  
  let iframe = document.createElement('iframe');
  iframe.title = 'Dominion Tracker Overlay'
  // iframe.src = 'https://dominiontracker.com/#/overlay';
  iframe.src = 'http://localhost:3000/#/overlay';
  iframe.id = 'dt-iframe'
  iframe.style.display = 'none'
  iframe.style.position = 'fixed'
  iframe.style.width = '100%' // without this, it's capped at 300px for some reason
  document.querySelector('#dt-container').append(iframe);
  iframe.contentWindow.console = console;

  let toggleButton = document.createElement('button');
  toggleButton.id = 'dt-toggleButton' 
  toggleButton.textContent = 'TRACKER'
  toggleButton.style.display = 'inline'
  toggleButton.style.position = 'fixed'
  toggleButton.style.backgroundColor = '#ff0000'
  toggleButton.style.color = 'white'
  toggleButton.style.textDecoration = 'none'
  toggleButton.style.border = 'none'
  toggleButton.onclick = () => {
    let detectedIframe = document.querySelector('#dt-iframe')
    let isTrackerOpen = detectedIframe.style.display === 'inline'
    detectedIframe.style.display = isTrackerOpen ? 'none' : 'inline'
  }
  document.querySelector('#dt-container').append(toggleButton);
}

try {
  injectOverlay()
  watchLog()
} catch (error) {
  console.error('Content-script error:', error)
}
