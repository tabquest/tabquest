const FAVORITES_FOLDER = {
    id: 'favorites',
    title: 'Favorites',
    count: 0,
    isDefault: true
  };
  
  export const saveToLocalStorage = (state) => {
    try {
      // Only save non-default folders to prevent favorites folder duplication
      const foldersToSave = state.folders.filter(f => !f.isDefault);
      localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
      localStorage.setItem("folders", JSON.stringify(foldersToSave));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  };
  
  export const loadFromLocalStorage = () => {
    let bookmarks = [];
    let folders = [];
    
    try {
      const savedBookmarks = localStorage.getItem("bookmarks");
      bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    } catch (e) {
      console.error("Error parsing bookmarks from localStorage", e);
      bookmarks = [];
    }
    
    try {
      const savedFolders = localStorage.getItem("folders");
      folders = savedFolders ? JSON.parse(savedFolders) : [];
    } catch (e) {
      console.error("Error parsing folders from localStorage", e);
      folders = [];
    }
  
    // Always ensure favorites folder exists and is first
    folders = folders.filter(f => f.id !== FAVORITES_FOLDER.id);
    folders.unshift(FAVORITES_FOLDER);
  
    // Update folder counts based on actual bookmarks
    folders.forEach(folder => {
      if (folder.id === FAVORITES_FOLDER.id) {
        folder.count = bookmarks.filter(b => b.starred).length;
      } else {
        folder.count = bookmarks.filter(b => b.folder === folder.id).length;
      }
    });
  
    return { bookmarks, folders };
  };