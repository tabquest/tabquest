import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Folder, Task } from '../../types/domain';

interface TaskState {
  folders: Folder[];
  tasks: Task[];
  isAddingNew: boolean;
}

const TODAY_FOLDER: Folder = {
  id: 'today',
  title: 'Today',
  isDefault: true,
  count: 0,
};

const initialState: TaskState = {
  folders: [TODAY_FOLDER],
  tasks: [],
  isAddingNew: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    addFolder(state, action: PayloadAction<Folder>) {
      state.folders.push(action.payload);
    },
    updateFolder(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      const folder = state.folders.find((f) => f.id === id);
      if (folder) {
        folder.title = title;
      }
    },
    deleteFolder(state, action: PayloadAction<string>) {
      state.folders = state.folders.filter((f) => f.id !== action.payload);
      state.folders.forEach((folder) => {
        folder.count = state.tasks.filter(
          (task) => task.folder === folder.id,
        ).length;
      });
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
      const folder = state.folders.find((f) => f.id === action.payload.folder);
      if (folder) {
        folder.count += 1;
      }
    },
    updateTask(
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task> }>,
    ) {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex((t) => t.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        const folder = state.folders.find((f) => f.id === task.folder);
        if (folder) {
          folder.count -= 1;
        }
      }
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    setAddingNew(state, action: PayloadAction<boolean>) {
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
