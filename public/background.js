chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "PERFORM_SEARCH") {
        chrome.search.query({
            text: request.searchTerm,
            disposition: "CURRENT_TAB",
        });
    }
});