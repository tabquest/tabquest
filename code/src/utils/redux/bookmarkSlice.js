import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  folders: [],
  bookmarks: [],
  isAddingNew: false,
};

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setFolders(state, action) {
      state.folders = action.payload;
    },
    setBookmarks(state, action) {
      state.bookmarks = action.payload;
    },
    setIsAddingNew(state, action) {
      state.isAddingNew = action.payload;
    },
    addFolder(state, action) {
      state.folders.push(action.payload);
    },
    addBookmark(state, action) {
      const folder = state.folders.find(folder => folder.id === action.payload.folder);
      if (folder) {
        folder.count += 1;
      }
      state.bookmarks.push(action.payload);
    },
    updateBookmark(state, action) {
      const { id, updates } = action.payload;
      const bookmark = state.bookmarks.find(bookmark => bookmark.id === id);
      if (bookmark) {
        Object.assign(bookmark, updates);
      }
    },
    deleteBookmark(state, action) {
      const bookmarkId = action.payload;
      const bookmarkIndex = state.bookmarks.findIndex(bookmark => bookmark.id === bookmarkId);
      if (bookmarkIndex !== -1) {
        const folder = state.folders.find(folder => folder.id === state.bookmarks[bookmarkIndex].folder);
        if (folder) {
          folder.count -= 1;
        }
        state.bookmarks.splice(bookmarkIndex, 1);
      }
    },
  },
});

export const {
  setFolders,
  setBookmarks,
  setIsAddingNew,
  addFolder,
  addBookmark,
  updateBookmark,
  deleteBookmark,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;