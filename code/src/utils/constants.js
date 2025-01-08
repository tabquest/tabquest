export const FAVICON_URL = "https://www.google.com/s2/favicons?sz=64&domain=";

export const OPENWEATHER_API_URL = "https://halithsmh-weatherapi.web.val.run/?city=";

export const UPDATE_CHECK_API = "https://halithsmh-updatechecker.web.val.run";

export const FEEDBACK_FORM_API = "https://script.google.com/macros/s/AKfycbxMdCc6s4Ggnx4i1iNq_kVI_4XznCVAlahBC5nS-bSjB99XRoxfElx17aPdFyLAHbsl/exec";

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