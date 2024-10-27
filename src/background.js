let isMonitoring = false;

console.log("Background script loaded.");

chrome.storage.sync.get("isMonitoring", (data) => {
    isMonitoring = data.isMonitoring || false;
    console.log("Initial isMonitoring state:", isMonitoring);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received:", message);
    if (message.action === "toggleMonitoring") {
        isMonitoring = message.isMonitoring;
        chrome.storage.sync.set({ isMonitoring });
        console.log("Monitoring toggled:", isMonitoring);
        sendResponse({ success: true });
    }
});

chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        console.log("Request details:", details);
        if (isMonitoring && details.url.includes("/download.html") && details.statusCode === 302) {
            const redirectUrl = details.responseHeaders.find(
                (header) => header.name.toLowerCase() === "location"
            ).value;

            console.log("Redirect URL found:", redirectUrl);

            isMonitoring = false;
            chrome.storage.sync.set({ isMonitoring, redirectUrl });
            console.log("Monitoring auto-disabled after capturing redirect.");

            chrome.action.setBadgeText({ text: "1" });
            chrome.action.setBadgeBackgroundColor({ color: "#777777" });
        }
    },
    { urls: ["https://*.amazon.com/*"] },
    ["responseHeaders"]
);