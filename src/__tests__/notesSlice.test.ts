import notesReducer, {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  toggleStarred,
  setSelectedNote,
  setFilter,
  setIsAddingNew,
} from '../utils/redux/notesSlice';
import type { Note } from '../types/domain';

const mockNote: Note = {
  id: 'n1',
  heading: 'Meeting notes',
  content: 'Discuss Q2 roadmap',
  tags: [],
  timestamp: new Date().toISOString(),
  type: 'note',
  starred: false,
};

describe('notesSlice', () => {
  const initialState = {
    items: [] as Note[],
    isAddingNew: false,
    selectedNote: null as Note | null,
    filter: 'all',
  };

  it('should return initial state', () => {
    expect(notesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setNotes', () => {
    const state = notesReducer(initialState, setNotes([mockNote]));
    expect(state.items).toEqual([mockNote]);
  });

  it('should handle addNote', () => {
    const state = notesReducer(initialState, addNote(mockNote));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('n1');
  });

  it('should handle updateNote', () => {
    const prevState = { ...initialState, items: [mockNote] };
    const updated = { ...mockNote, heading: 'Updated meeting notes' };
    const state = notesReducer(prevState, updateNote(updated));
    expect(state.items[0].heading).toBe('Updated meeting notes');
  });

  it('should handle deleteNote', () => {
    const prevState = { ...initialState, items: [mockNote] };
    const state = notesReducer(prevState, deleteNote('n1'));
    expect(state.items).toHaveLength(0);
  });

  it('should handle toggleStarred', () => {
    const prevState = { ...initialState, items: [mockNote] };
    const state = notesReducer(prevState, toggleStarred('n1'));
    expect(state.items[0].starred).toBe(true);
    const toggledBack = notesReducer(state, toggleStarred('n1'));
    expect(toggledBack.items[0].starred).toBe(false);
  });

  it('should handle setSelectedNote', () => {
    const state = notesReducer(initialState, setSelectedNote(mockNote));
    expect(state.selectedNote).toEqual(mockNote);
  });

  it('should handle setFilter', () => {
    const state = notesReducer(initialState, setFilter('starred'));
    expect(state.filter).toBe('starred');
  });

  it('should handle setIsAddingNew', () => {
    const state = notesReducer(initialState, setIsAddingNew(true));
    expect(state.isAddingNew).toBe(true);
  });
});
