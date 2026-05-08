import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Note } from '../../types/domain';

const STORAGE_KEY = 'notesManager';

interface NotesState {
  items: Note[];
  isAddingNew: boolean;
  selectedNote: Note | null;
  filter: string;
}

const loadFromStorage = (): Note[] => {
  try {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

const saveToStorage = (notes: Note[]) => {
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
    filter: 'all',
  } as NotesState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.items = action.payload;
      saveToStorage(action.payload);
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.items.push(action.payload);
      saveToStorage(state.items);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.items.findIndex(
        (note) => note.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
        saveToStorage(state.items);
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((note) => note.id !== action.payload);
      saveToStorage(state.items);
    },
    toggleStarred: (state, action: PayloadAction<string>) => {
      const note = state.items.find((note) => note.id === action.payload);
      if (note) {
        note.starred = !note.starred;
        saveToStorage(state.items);
      }
    },
    setSelectedNote: (state, action: PayloadAction<Note | null>) => {
      state.selectedNote = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setIsAddingNew: (state, action: PayloadAction<boolean>) => {
      state.isAddingNew = action.payload;
    },
  },
});

export const {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  toggleStarred,
  setSelectedNote,
  setFilter,
  setIsAddingNew,
} = notesSlice.actions;

export default notesSlice.reducer;
