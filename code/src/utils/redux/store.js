import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import bookmarkReducer from './bookmarkSlice';
import taskReducer from './taskSlice';

const persistMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState().bookmarks;
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
  localStorage.setItem("folders", JSON.stringify(state.folders));
  return result;
};

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    bookmarks: bookmarkReducer,
    tasks: taskReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(persistMiddleware)
});