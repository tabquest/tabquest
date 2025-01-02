export const FAVICON_URL = "https://www.google.com/s2/favicons?sz=64&domain=";

export const OPENWEATHER_API_URL =
    "https://api.openweathermap.org/data/2.5/weather?APPID=9f54dfbb87f696b1730f1a1d791e4d57&q=";

export const initialState = {
    userName: "user_name",
    userRole: "developer",
    userPortfolioUrl: "",
    searchEngine: "Google",
    weatherLocation: "Chennai",
    socialProfiles: {
        linkedin: "https://www.linkedin.com/",
        github: "https://github.com/",
        twitter: "",
        instagram: "",
        reddit: "",
    },
    bookmarks: [
        { url: "https://claude.ai/new", name: "Claude AI" },
        { url: "https://www.eraser.io", name: "Eraser" },
        { url: "https://www.netflix.com", name: "Netflix" },
        { url: "https://youtube.com", name: "YouTube" },
        { url: "https://chatgpt.com", name: "ChatGPT" },
        { url: "https://web.telegram.org", name: "Telegram" },
    ],
};