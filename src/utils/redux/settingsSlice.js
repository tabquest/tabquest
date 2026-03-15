import { createSlice } from "@reduxjs/toolkit";
import { resolveThemeKey } from "../themes";

// Load settings from localStorage or use default initial state
const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem("settings");
        return serializedState ? JSON.parse(serializedState) : null;
    } catch (e) {
        console.error("Failed to load settings from localStorage", e);
        return null;
    }
};

const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("settings", serializedState);
    } catch (e) {
        console.error("Failed to save settings to localStorage", e);
    }
};

const defaultSettings = {
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
        {
            url: "https://www.primevideo.com/region/eu/storefront",
            name: "Prime",
        },
    ],
};

// Initial state — resolve any legacy theme alias on load
const storedSettings = loadFromLocalStorage();
const initialState = {
    ...defaultSettings,
    ...(storedSettings || {}),
};

// Use the centralized resolver from themes.js
if (initialState.theme) {
    initialState.theme = resolveThemeKey(initialState.theme);
}

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        updateUserInfo: (state, action) => {
            const { userName, userRole, userPortfolioUrl } = action.payload;
            state.userName = userName;
            state.userRole = userRole;
            state.userPortfolioUrl = userPortfolioUrl;
            saveToLocalStorage(state);
        },
        updateSearchPreferences: (state, action) => {
            const { searchEngine, weatherLocation } = action.payload;
            state.searchEngine = searchEngine;
            state.weatherLocation = weatherLocation;
            state.hideSeconds = action.payload.hideSeconds ?? state.hideSeconds;
            state.use12Hour = action.payload.use12Hour ?? state.use12Hour;
            saveToLocalStorage(state);
        },
        updateSocialProfiles: (state, action) => {
            state.socialProfiles = {
                ...state.socialProfiles,
                ...action.payload,
            };
            saveToLocalStorage(state);
        },
        updateBookmarks: (state, action) => {
            state.bookmarks = action.payload;
            saveToLocalStorage(state);
        },
        updateTheme: (state, action) => {
            // Always resolve through the central theme system
            state.theme = resolveThemeKey(action.payload || defaultSettings.theme);
            saveToLocalStorage(state);
        },
    },
});

export const {
    updateUserInfo,
    updateSearchPreferences,
    updateSocialProfiles,
    updateBookmarks,
    updateTheme,
} = settingsSlice.actions;

export default settingsSlice.reducer;
