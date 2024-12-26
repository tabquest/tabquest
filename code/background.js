chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchSuggestions") {
      const query = request.query;
      fetch(
        `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(
          query
        )}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          sendResponse({ suggestions: data[1] || [] });
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
          sendResponse({ suggestions: [] });
        });
  
      // Keep the message channel open for async response
      return true;
    }
  });
  

  chrome.runtime.sendMessage(
    { action: "fetchSuggestions", query },
    (response) => {
      if (chrome.runtime.lastError) {
        console.warn("Background script may not be active:", chrome.runtime.lastError.message);
        setSuggestions([]);
      } else {
        setSuggestions(response.suggestions || []);
      }
    }
  );
  