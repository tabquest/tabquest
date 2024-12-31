const FAVORITES_FOLDER = {
    id: 'favorites',
    title: 'Favorites',
    count: 0,
    isDefault: true
  };
  
  export const saveToLocalStorage = (state) => {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
    localStorage.setItem("folders", JSON.stringify(state.folders));
  };
  
  export const loadFromLocalStorage = () => {
    let bookmarks = [];
    let folders = [];
    try {
      bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    } catch (e) {
      console.error("Error parsing bookmarks from localStorage", e);
    }
    try {
      folders = JSON.parse(localStorage.getItem("folders")) || [];
    } catch (e) {
      console.error("Error parsing folders from localStorage", e);
    }
  
    // Ensure no duplicate favorites folder
    const hasFavoritesFolder = folders.some(folder => folder.id === FAVORITES_FOLDER.id);
    if (!hasFavoritesFolder) {
      folders.unshift(FAVORITES_FOLDER);
    } else {
      // Remove any duplicate favorites folders
      folders = folders.filter((folder, index, self) =>
        index === self.findIndex(f => f.id === folder.id)
      );
    }
  
    // Ensure no duplicate favorites bookmarks
    const uniqueBookmarks = bookmarks.reduce((acc, bookmark) => {
      if (bookmark.starred) {
        const isDuplicate = acc.some(b => b.id === bookmark.id && b.starred);
        if (!isDuplicate) {
          acc.push(bookmark);
        }
      } else {
        acc.push(bookmark);
      }
      return acc;
    }, []);
  
    return { bookmarks: uniqueBookmarks, folders };
  };