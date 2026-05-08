import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resolveThemeKey } from '../themes';
import type {
  Settings,
  SocialProfiles,
  BookmarkLink,
  BackgroundConfig,
} from '../../types/domain';

interface SettingsState extends Settings {}

const loadFromLocalStorage = (): SettingsState | null => {
  try {
    const serializedState = localStorage.getItem('settings');
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
    return null;
  }
};

const saveToLocalStorage = (state: SettingsState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('settings', serializedState);
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
};

const defaultSettings: SettingsState = {
  userName: 'user_name',
  userRole: 'developer',
  userPortfolioUrl: '',
  theme: 'midnight_default',
  searchEngine: 'Google',
  weatherLocation: 'Chennai',
  hideSeconds: false,
  use12Hour: false,
  background: { type: 'theme' } as BackgroundConfig,
  focusMode: false,
  socialProfiles: {
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/tabquest',
    twitter: '',
    instagram: 'https://www.instagram.com',
    reddit: '',
  },
  bookmarks: [
    { url: 'https://www.notion.com', name: 'Notion' },
    { url: 'https://www.eraser.io', name: 'Eraser' },
    { url: 'https://www.netflix.com', name: 'Netflix' },
    { url: 'https://youtube.com', name: 'YouTube' },
    { url: 'https://chatgpt.com', name: 'ChatGPT' },
    {
      url: 'https://www.primevideo.com/region/eu/storefront',
      name: 'Prime',
    },
  ],
};

const storedSettings = loadFromLocalStorage();
const initialState: SettingsState = {
  ...defaultSettings,
  ...(storedSettings || {}),
};

if (initialState.theme) {
  initialState.theme = resolveThemeKey(initialState.theme);
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateUserInfo(
      state,
      action: PayloadAction<{
        userName: string;
        userRole: string;
        userPortfolioUrl: string;
      }>,
    ) {
      const { userName, userRole, userPortfolioUrl } = action.payload;
      state.userName = userName;
      state.userRole = userRole;
      state.userPortfolioUrl = userPortfolioUrl;
      saveToLocalStorage(state);
    },
    updateSearchPreferences(
      state,
      action: PayloadAction<{
        searchEngine: string;
        weatherLocation: string;
        hideSeconds?: boolean;
        use12Hour?: boolean;
      }>,
    ) {
      const { searchEngine, weatherLocation } = action.payload;
      state.searchEngine = searchEngine;
      state.weatherLocation = weatherLocation;
      state.hideSeconds = action.payload.hideSeconds ?? state.hideSeconds;
      state.use12Hour = action.payload.use12Hour ?? state.use12Hour;
      saveToLocalStorage(state);
    },
    updateSocialProfiles(
      state,
      action: PayloadAction<Partial<SocialProfiles>>,
    ) {
      state.socialProfiles = {
        ...state.socialProfiles,
        ...action.payload,
      };
      saveToLocalStorage(state);
    },
    updateBookmarks(state, action: PayloadAction<BookmarkLink[]>) {
      state.bookmarks = action.payload;
      saveToLocalStorage(state);
    },
    updateTheme(state, action: PayloadAction<string>) {
      state.theme = resolveThemeKey(action.payload || defaultSettings.theme);
      saveToLocalStorage(state);
    },
    updateBackground(state, action: PayloadAction<BackgroundConfig>) {
      state.background = action.payload;
      saveToLocalStorage(state);
    },
    setFocusMode(state, action: PayloadAction<boolean>) {
      state.focusMode = action.payload;
      saveToLocalStorage(state);
    },
    toggleFocusMode(state) {
      state.focusMode = !state.focusMode;
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
  updateBackground,
  setFocusMode,
  toggleFocusMode,
} = settingsSlice.actions;

export default settingsSlice.reducer;
