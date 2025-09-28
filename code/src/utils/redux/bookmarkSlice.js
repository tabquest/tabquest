import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = 'bookmarkManager';

const saveToStorage = (bookmarks, folders) => {
    try {
        const dataToSave = {
            folders: folders.filter(f => !f.isDefault),
            bookmarks
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error saving bookmarks:', error);
    }
};

const initialState = {
    folders: [],
    bookmarks: [],
    isAddingNew: false,
};

const bookmarkSlice = createSlice({
    name: "bookmarks",
    initialState,
    reducers: {
        // Your existing reducers stay the same
        setFolders(state, action) {
            state.folders = action.payload;
        },
        updateFolder(state, action) {
            const { id, title } = action.payload;
            const folder = state.folders.find((f) => f.id === id);
            if (folder) {
                folder.title = title;
            }
            saveToStorage(state.bookmarks, state.folders);
        },
        deleteFolder(state, action) {
            const folderId = action.payload;
            state.folders = state.folders.filter(
                (folder) => folder.id !== folderId
            );
            state.bookmarks = state.bookmarks.filter(
                (bookmark) => bookmark.folder !== folderId
            );
            saveToStorage(state.bookmarks, state.folders);
        },
        setBookmarks(state, action) {
            state.bookmarks = action.payload;
        },
        setIsAddingNew(state, action) {
            state.isAddingNew = action.payload;
        },
        addFolder(state, action) {
            state.folders.push(action.payload);
            saveToStorage(state.bookmarks, state.folders);
        },
        addBookmark(state, action) {
            const folder = state.folders.find(
                (folder) => folder.id === action.payload.folder
            );
            if (folder) {
                folder.count += 1;
            }
            state.bookmarks.push(action.payload);
            saveToStorage(state.bookmarks, state.folders);
        },
        updateBookmark(state, action) {
            const { id, updates } = action.payload;
            const bookmark = state.bookmarks.find(
                (bookmark) => bookmark.id === id
            );
            if (bookmark) {
                Object.assign(bookmark, updates);
            }
            saveToStorage(state.bookmarks, state.folders);
        },
        deleteBookmark(state, action) {
            const bookmarkId = action.payload;
            const bookmarkIndex = state.bookmarks.findIndex(
                (bookmark) => bookmark.id === bookmarkId
            );
            if (bookmarkIndex !== -1) {
                const folder = state.folders.find(
                    (folder) =>
                        folder.id === state.bookmarks[bookmarkIndex].folder
                );
                if (folder) {
                    folder.count -= 1;
                }
                state.bookmarks.splice(bookmarkIndex, 1);
            }
            saveToStorage(state.bookmarks, state.folders);
        },
    },
});

export const {
    setFolders,
    updateFolder,
    deleteFolder,
    setBookmarks,
    setIsAddingNew,
    addFolder,
    addBookmark,
    updateBookmark,
    deleteBookmark,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;