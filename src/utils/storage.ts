import type { Folder, Task } from '../types/domain';

interface StorageData {
  folders: Folder[];
  tasks: Task[];
}

const loadFromLocalStorage = (): StorageData => {
  try {
    const savedFolders = JSON.parse(
      localStorage.getItem('taskFolders') || '[]',
    );
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return { folders: savedFolders, tasks: savedTasks };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return { folders: [], tasks: [] };
  }
};

const saveToLocalStorage = (folders: Folder[], tasks: Task[]) => {
  try {
    localStorage.setItem('taskFolders', JSON.stringify(folders));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export { loadFromLocalStorage, saveToLocalStorage };
