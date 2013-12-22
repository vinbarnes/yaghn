(function() {

var statusURL = "https://github.com/notifications";
var icon = {
    unread: {'19': 'yaghn-unread-19x19.png', '38': 'yaghn-unread-19x19@2x.png'},
    read: {'19': 'yaghn-default-19x19.png', '38': 'yaghn-default-19x19@2x.png'}
};

function requestStatus(callback) {
    console.log("we be pollin'");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(state) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(xhr.response);
            } else {
                console.log("yaghn xhr status:", xhr.status);
            }
        }
    }

    xhr.onerror = function(error) {
        console.log("yaghn xhr error:", error);
    };

    xhr.open("GET", statusURL, true);
    xhr.send(null);
}

function determineUnreadStatus(data) {
    var tmp = document.createElement("div");
    tmp.innerHTML = data;
    var count = tmp.querySelector("a[href='/notifications'] .count").textContent;
    var result = (count != 0) ? true : false;

    updateIcon(result);
}

function getUnreadStatus(callback) {
    console.log("determining unread status...");

    requestStatus(determineUnreadStatus);
}

function updateIcon(hasUnread) {
    var updatedIcon = icon[(hasUnread) ? 'unread' : 'read'];
    chrome.browserAction.setIcon({path: updatedIcon});
}

function update() {
    getUnreadStatus(updateIcon);
}

function findOrCreateTab(url) {
    chrome.tabs.query({currentWindow: true, url: "*://github.com/notifications"}, function(tabs) {
        if (tabs.length > 0) {
            chrome.tabs.reload(tabs[0].id);
            chrome.tabs.update(tabs[0].id, {active: true});
        } else {
            chrome.tabs.create({url: url, active: true});
        }
    });
}

function main() {
    chrome.alarms.create({periodInMinutes: 5});
    chrome.alarms.onAlarm.addListener(update);

    chrome.browserAction.onClicked.addListener(function () {
        findOrCreateTab(statusURL);
    });

    update();
}

main();

})();
