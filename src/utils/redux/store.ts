import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import bookmarkReducer from './bookmarkSlice';
import taskReducer from './taskSlice';
import notesReducer from './notesSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    bookmarks: bookmarkReducer,
    tasks: taskReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
