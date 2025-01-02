// notesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'notesManager';

const loadFromStorage = () => {
  try {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

const saveToStorage = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    items: loadFromStorage(),
    isAddingNew: false,
    selectedNote: null,
    filter: 'all'
  },
  reducers: {
    setNotes: (state, action) => {
      state.items = action.payload;
      saveToStorage(action.payload);
    },
    addNote: (state, action) => {
      state.items.push(action.payload);
      saveToStorage(state.items);
    },
    updateNote: (state, action) => {
      const index = state.items.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveToStorage(state.items);
      }
    },
    deleteNote: (state, action) => {
      state.items = state.items.filter(note => note.id !== action.payload);
      saveToStorage(state.items);
    },
    toggleStarred: (state, action) => {
      const note = state.items.find(note => note.id === action.payload);
      if (note) {
        note.starred = !note.starred;
        saveToStorage(state.items);
      }
    },
    setSelectedNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setIsAddingNew: (state, action) => {
      state.isAddingNew = action.payload;
    }
  }
});

export const {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  toggleStarred,
  setSelectedNote,
  setFilter,
  setIsAddingNew
} = notesSlice.actions;

export default notesSlice.reducer;