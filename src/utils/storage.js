const loadFromLocalStorage = () => {
    try {
        const savedFolders =
            JSON.parse(localStorage.getItem("taskFolders")) || [];
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        return { folders: savedFolders, tasks: savedTasks };
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        return { folders: [], tasks: [] };
    }
};

const saveToLocalStorage = (folders, tasks) => {
    try {
        localStorage.setItem("taskFolders", JSON.stringify(folders));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};
export { loadFromLocalStorage, saveToLocalStorage };
