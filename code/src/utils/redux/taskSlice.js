import { createSlice } from '@reduxjs/toolkit';

const TODAY_FOLDER = {
  id: 'today',
  title: 'Today',
  isDefault: true,
  count: 0
};

const initialState = {
  folders: [TODAY_FOLDER],
  tasks: [],
  isAddingNew: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    updateFolder: (state, action) => {
      const { id, title } = action.payload;
      const folder = state.folders.find(f => f.id === id);
      if (folder) {
        folder.title = title;
      }
    },
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter(f => f.id !== action.payload);
      // Update folder counts
      state.folders.forEach(folder => {
        folder.count = state.tasks.filter(task => task.folder === folder.id).length;
      });
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      // Update folder count
      const folder = state.folders.find(f => f.id === action.payload.folder);
      if (folder) {
        folder.count += 1;
      }
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
    },
    deleteTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        // Decrease folder count
        const folder = state.folders.find(f => f.id === task.folder);
        if (folder) {
          folder.count -= 1;
        }
      }
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    setAddingNew: (state, action) => {
      state.isAddingNew = action.payload;
    },
  },
});

export const {
  setFolders,
  setTasks,
  addFolder,
  updateFolder,
  deleteFolder,
  addTask,
  updateTask,
  deleteTask,
  setAddingNew,
} = taskSlice.actions;

export default taskSlice.reducer;