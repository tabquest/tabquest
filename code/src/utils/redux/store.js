import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import bookmarkReducer, { persistMiddleware } from './bookmarkSlice';
import taskReducer from './taskSlice';
import notesReducer from './notesSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    bookmarks: bookmarkReducer,
    tasks: taskReducer,
    notes: notesReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(persistMiddleware)
});