(function() {

var statusURL = "https://github.com/notifications";


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
    var icon = (hasUnread) ? "unread.png" : "default.png";
    chrome.browserAction.setIcon({path: icon});
}

function update() {
    getUnreadStatus(updateIcon);
}


function main() {
    chrome.alarms.create({periodInMinutes: 5});
    chrome.alarms.onAlarm.addListener(update);

    chrome.browserAction.onClicked.addListener(function () {
        chrome.tabs.create({url: statusURL});
    });

    update();
}

main();

})();
