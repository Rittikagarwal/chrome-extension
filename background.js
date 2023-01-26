
// array to store the URLs that the extension should work on
const testPages = ["example.com/test-link"];

// function to check if the current tab is a test page
function isTestPage(tab) {
    return testPages.some(testPage => tab.url.indexOf(testPage) !== -1);
}

// full screen when the extension is activated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && isTestPage(tab)) {
        chrome.windows.update(tab.windowId, {state: "fullscreen"});
    }
});

// listen for tab switch events
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (isTestPage(tab)) {
            // show pop-up
            chrome.windows.create({
                type: "popup",
                url: "popup.html",
                width: 400,
                height: 200
            });
        }
    });
});

// listen for new tab creation events
chrome.tabs.onCreated.addListener(function(tab) {
    if (isTestPage(tab)) {
        // close the new tab
        chrome.tabs.remove(tab.id);
    }
});

// listen for browser close events
chrome.windows.onRemoved.addListener(function(windowId) {
    // check if the closed window was a test page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (isTestPage(tabs[0])) {
            // show an alert
            alert("You can only close this tab by clicking on the 'End Test' button.");
        }
    });
});

// check for audio, camera and internet stability when the extension is activated
chrome.runtime.onInstalled.addListener(function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
    console.log("Audio permission granted");
        // do something with the audio stream
        stream.getTracks().forEach(track => track.stop());
    })
    .catch(function(err) {
        console.log("Audio permission denied");
        // handle permission denied
    });

    // check for camera permission
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        console.log("Camera permission granted");
        // do something with the camera stream
        stream.getTracks().forEach(track => track.stop());
    })
        .catch(function(err) {
        console.log("Camera permission denied");
        // handle permission denied
    });
    if (navigator.onLine) {
        console.log("Online");
    } else {
        console.log("Offline");
    }

});

// capture user-related information in local storage
chrome.runtime.onInstalled.addListener(function() {
    const peerConnection = new RTCPeerConnection({});
    peerConnection.createDataChannel('');
    peerConnection.createOffer()
    .then(offer => peerConnection.setLocalDescription(offer))
    .then(() => {
        const { iceGatherer } = peerConnection;
        const ip = Array.from(iceGatherer.getLocalCandidates())
                      .find(({ candidate }) => candidate.includes('typ host')).candidate;
        console.log(ip);
    });

});
