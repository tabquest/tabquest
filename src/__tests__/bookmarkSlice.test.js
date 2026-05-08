import bookmarkReducer, {
  setFolders,
  updateFolder,
  deleteFolder,
  setBookmarks,
  setIsAddingNew,
  addFolder,
  addBookmark,
  updateBookmark,
  deleteBookmark,
} from '../utils/redux/bookmarkSlice';

const mockFolder = { id: 'f1', title: 'Work', count: 2, isDefault: false };
const mockBookmark = {
  id: 'b1',
  title: 'GitHub',
  url: 'https://github.com',
  folder: 'f1',
};
const mockBookmark2 = {
  id: 'b2',
  title: 'Docs',
  url: 'https://docs.example.com',
  folder: 'f1',
};

describe('bookmarkSlice', () => {
  const initialState = { folders: [], bookmarks: [], isAddingNew: false };

  it('should return initial state', () => {
    expect(bookmarkReducer(undefined, { type: 'unknown' })).toEqual(
      initialState,
    );
  });

  it('should handle setFolders', () => {
    const state = bookmarkReducer(initialState, setFolders([mockFolder]));
    expect(state.folders).toEqual([mockFolder]);
  });

  it('should handle setBookmarks', () => {
    const state = bookmarkReducer(initialState, setBookmarks([mockBookmark]));
    expect(state.bookmarks).toEqual([mockBookmark]);
  });

  it('should handle setIsAddingNew', () => {
    const state = bookmarkReducer(initialState, setIsAddingNew(true));
    expect(state.isAddingNew).toBe(true);
  });

  it('should handle addFolder', () => {
    const state = bookmarkReducer(initialState, addFolder(mockFolder));
    expect(state.folders).toHaveLength(1);
    expect(state.folders[0]).toEqual(mockFolder);
  });

  it('should handle updateFolder title', () => {
    const prevState = { ...initialState, folders: [mockFolder] };
    const state = bookmarkReducer(
      prevState,
      updateFolder({ id: 'f1', title: 'Updated' }),
    );
    expect(state.folders[0].title).toBe('Updated');
  });

  it('should handle deleteFolder and cascade remove bookmarks', () => {
    const prevState = {
      folders: [mockFolder],
      bookmarks: [mockBookmark, mockBookmark2],
      isAddingNew: false,
    };
    const state = bookmarkReducer(prevState, deleteFolder('f1'));
    expect(state.folders).toHaveLength(0);
    expect(state.bookmarks).toHaveLength(0);
  });

  it('should handle addBookmark and increment folder count', () => {
    const prevState = {
      folders: [{ ...mockFolder, count: 0 }],
      bookmarks: [],
      isAddingNew: false,
    };
    const state = bookmarkReducer(prevState, addBookmark(mockBookmark));
    expect(state.bookmarks).toHaveLength(1);
    expect(state.folders[0].count).toBe(1);
  });

  it('should handle updateBookmark', () => {
    const prevState = {
      folders: [],
      bookmarks: [mockBookmark],
      isAddingNew: false,
    };
    const state = bookmarkReducer(
      prevState,
      updateBookmark({ id: 'b1', updates: { title: 'Updated GitHub' } }),
    );
    expect(state.bookmarks[0].title).toBe('Updated GitHub');
  });

  it('should handle deleteBookmark and decrement folder count', () => {
    const folderWithCount = { ...mockFolder, count: 2 };
    const prevState = {
      folders: [folderWithCount],
      bookmarks: [mockBookmark, mockBookmark2],
      isAddingNew: false,
    };
    const state = bookmarkReducer(prevState, deleteBookmark('b1'));
    expect(state.bookmarks).toHaveLength(1);
    expect(state.folders[0].count).toBe(1);
  });
});
