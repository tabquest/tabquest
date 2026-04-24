export const FAVICON_URL = "https://www.google.com/s2/favicons?sz=64&domain=";
export const RELEASES_URL = "https://tabquest.web.app/releases";

export const OPENWEATHER_API_URL = "https://tabquest.val.run/weather?city=";

export const FEEDBACK_FORM_API = "https://script.google.com/macros/s/AKfycbxMdCc6s4Ggnx4i1iNq_kVI_4XznCVAlahBC5nS-bSjB99XRoxfElx17aPdFyLAHbsl/exec";

// Toggle for Christmas Features (Snow, Banner, Santa)
export const CHRISTMAS_MODE = false;

// Show roughly twice a week (every 2.5 days = 216000000ms)
export const FEEDBACK_PROMPT_INTERVAL = 2.5 * 24 * 60 * 60 * 1000;

// Cache weather for 3 hours (3 * 60 * 60 * 1000ms)
export const WEATHER_CACHE_DURATION = 3 * 60 * 60 * 1000;

export const initialState = {
    userName: "user_name",
    userRole: "developer",
    userPortfolioUrl: "",
    theme: "midnight_default",
    searchEngine: "Google",
    weatherLocation: "Chennai",
    hideSeconds: false,
    use12Hour: false,
    socialProfiles: {
        linkedin: "https://www.linkedin.com/",
        github: "https://github.com/tabquest",
        twitter: "",
        instagram: "https://www.instagram.com",
        reddit: "",
    },
    bookmarks: [
        { url: "https://www.notion.com", name: "Notion" },
        { url: "https://www.eraser.io", name: "Eraser" },
        { url: "https://www.netflix.com", name: "Netflix" },
        { url: "https://youtube.com", name: "YouTube" },
        { url: "https://chatgpt.com", name: "ChatGPT" },
        { url: "https://www.primevideo.com/region/eu/storefront", name: "Prime" },
    ],
};
