// store.js
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';

import bookmarkReducer from './bookmarkSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    bookmarks: bookmarkReducer,
  }
});