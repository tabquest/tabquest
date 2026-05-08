import type { Bookmark, Folder } from '../types/domain';

interface BookmarkData {
  bookmarks: Bookmark[];
  folders: Folder[];
}

const FAVORITES_FOLDER: Folder = {
  id: 'favorites',
  title: 'Favorites',
  count: 0,
  isDefault: true,
};

const STORAGE_KEY = 'bookmarkManager';

export const loadFromLocalStorage = (): BookmarkData => {
  let bookmarks: Bookmark[] = [];
  let folders: Folder[] = [];

  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      bookmarks = parsedData.bookmarks || [];
      folders = parsedData.folders || [];
    }
  } catch (e) {
    console.error('Error loading bookmarks from localStorage', e);
    try {
      const oldBookmarks = localStorage.getItem('bookmarks');
      const oldFolders = localStorage.getItem('folders');
      if (oldBookmarks) bookmarks = JSON.parse(oldBookmarks);
      if (oldFolders) folders = JSON.parse(oldFolders);

      localStorage.removeItem('bookmarks');
      localStorage.removeItem('folders');
    } catch (migrationError) {
      console.error('Error migrating old bookmark data', migrationError);
    }
  }

  folders = folders.filter((f) => f.id !== FAVORITES_FOLDER.id);
  folders.unshift(FAVORITES_FOLDER);

  folders.forEach((folder) => {
    if (folder.id === FAVORITES_FOLDER.id) {
      folder.count = bookmarks.filter((b) => b.starred).length;
    } else {
      folder.count = bookmarks.filter((b) => b.folder === folder.id).length;
    }
  });

  return { bookmarks, folders };
};
