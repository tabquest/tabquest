import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Folder, Edit2, Trash2, Star, Search } from 'lucide-react';
import { setIsAddingNew, addFolder, setFolders, setBookmarks, addBookmark, updateBookmark, deleteBookmark } from '../utils/redux/bookmarkSlice';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/locatStorage';

const BookmarkComponent = () => {
  const dispatch = useDispatch();
  const { folders, bookmarks, isAddingNew } = useSelector(state => state.bookmarks);
  const [newFolderName, setNewFolderName] = useState('');
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', folder: '' });
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const { folders, bookmarks } = loadFromLocalStorage();
    dispatch(setFolders(folders));
    dispatch(setBookmarks(bookmarks));
  }, [dispatch]);

  useEffect(() => {
    saveToLocalStorage({ folders, bookmarks });
  }, [folders, bookmarks]);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now().toString(),
        title: newFolderName,
        count: 0,
      };
      dispatch(addFolder(newFolder));
      setNewFolderName('');
      dispatch(setIsAddingNew(false));
    }
  };

  const handleAddBookmark = () => {
    if (newBookmark.title.trim() && newBookmark.url.trim() && newBookmark.folder) {
      const bookmark = {
        id: Date.now().toString(),
        ...newBookmark,
        dateAdded: Date.now(),
        tags: [],
        starred: false,
      };
      dispatch(addBookmark(bookmark));
      setNewBookmark({ title: '', url: '', folder: '' });
    }
  };

  const handleUpdateBookmark = (id, updates) => {
    dispatch(updateBookmark({ id, updates }));
    setEditingBookmark(null);
  };

  const handleDeleteBookmark = (id) => {
    dispatch(deleteBookmark(id));
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !selectedFolder || bookmark.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="h-full flex">
      {/* Folders Sidebar */}
      <div className="w-64 border-r border-white/10 p-4">
        {/* Button for Adding New Folder */}
        {!isAddingNew ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 flex items-center gap-2"
            onClick={() => dispatch(setIsAddingNew(true))}
          >
            <Plus size={16} />
            <span>New Folder</span>
          </motion.button>
        ) : (
          // Folder Creation Form
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              className="w-full px-4 py-2 bg-white/5 text-white/80 placeholder-white/40 border border-white/10 rounded-lg"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
            <button
              onClick={handleAddFolder}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add
            </button>
            <button
              onClick={() => dispatch(setIsAddingNew(false))}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Display Folders */}
        <div className="space-y-1">
          {folders.map((folder) => (
            <motion.button
              key={folder.id}
              whileHover={{ x: 4 }}
              className={`w-full px-4 py-2 rounded-lg flex items-center justify-between group ${
                selectedFolder === folder.id ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <div className="flex items-center gap-2">
                <Folder size={16} />
                <span>{folder.title}</span>
              </div>
              <span className="text-sm text-white/50">{folder.count}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search bookmarks..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 placeholder:text-white/40 focus:outline-none focus:border-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add Bookmark Form */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full mb-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 placeholder:text-white/40 focus:outline-none focus:border-white/20"
            value={newBookmark.title}
            onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL"
            className="w-full mb-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 placeholder:text-white/40 focus:outline-none focus:border-white/20"
            value={newBookmark.url}
            onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
          />
          <select
            className="w-full mb-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:outline-none focus:border-white/20"
            value={newBookmark.folder}
            onChange={(e) => setNewBookmark({ ...newBookmark, folder: e.target.value })}
          >
            <option value="">Select Folder</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>{folder.title}</option>
            ))}
          </select>
          <button
            onClick={handleAddBookmark}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Bookmark
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-2">
          <AnimatePresence>
            {filteredBookmarks.map(bookmark => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="group p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      className={bookmark.starred ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-400'}
                    >
                      <Star size={16} />
                    </motion.button>
                    
                    <div>
                      <h3 className="text-white/90 font-medium">{bookmark.title}</h3>
                      <p className="text-sm text-white/50">{bookmark.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-white/50 hover:text-white/90"
                      onClick={() => setEditingBookmark(bookmark)}
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-white/50 hover:text-red-400"
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingBookmark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-[400px] bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-medium text-white/90 mb-4">Edit Bookmark</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingBookmark.title}
                  onChange={(e) => setEditingBookmark({ ...editingBookmark, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={editingBookmark.url}
                  onChange={(e) => setEditingBookmark({ ...editingBookmark, url: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80"
                  placeholder="URL"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBookmark(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateBookmark(editingBookmark.id, {
                      title: editingBookmark.title,
                      url: editingBookmark.url
                    })}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookmarkComponent;