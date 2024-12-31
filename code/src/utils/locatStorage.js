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
    return { bookmarks, folders };
};