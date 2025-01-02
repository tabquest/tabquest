import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Folder, Edit2, Trash2, Star } from 'lucide-react';
import {
  setIsAddingNew,
  addFolder,
  setFolders,
  setBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  updateFolder,
  deleteFolder
} from '../utils/redux/bookmarkSlice';
import { loadFromLocalStorage } from '../utils/loadFromLocalStorage';
// import FolderSidebar from './FolderSidebar';
// import BookmarkList from './BookmarkList';
import PopupModal from './PopupModal';
import DeleteConfirmModal from './DeleteConfirmModal';

// Constants moved to top level
const FAVORITES_FOLDER = {
  id: 'favorites',
  title: 'Favorites',
  count: 0,
  isDefault: true
};

const MAX_TAGS = 3;
const STORAGE_KEY = 'bookmarkManager';

const saveToLocalStorage = (folders, bookmarks) => {
  const dataToSave = {
    folders: folders.filter(f => !f.isDefault),
    bookmarks
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
};

const BookmarkComponent = () => {
  const dispatch = useDispatch();
  const { folders, bookmarks, isAddingNew } = useSelector(state => state.bookmarks);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', tags: [], folder: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderPopup, setShowFolderPopup] = useState(false);
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load initial data
  useEffect(() => {
    const { folders: savedFolders, bookmarks } = loadFromLocalStorage();
    const foldersWithFavorites = [FAVORITES_FOLDER, ...savedFolders.filter(f => f.id !== FAVORITES_FOLDER.id)];
    dispatch(setFolders(foldersWithFavorites));
    dispatch(setBookmarks(bookmarks));
  }, [dispatch]);

  // Save data on changes
  useEffect(() => {
    const nonDefaultFolders = folders.filter(f => !f.isDefault);
    saveToLocalStorage(nonDefaultFolders, bookmarks);
  }, [folders, bookmarks]);

  const handleAddFolder = (values) => {
    if (values.title && values.title.trim()) {
      dispatch(addFolder({
        id: Date.now().toString(),
        title: values.title,
        count: 0
      }));
      setShowFolderPopup(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    const folderBookmarks = bookmarks.filter(b => b.folder === folderId);
    folderBookmarks.forEach(bookmark => {
      dispatch(deleteBookmark(bookmark.id));
    });
    dispatch(deleteFolder(folderId));
    setShowDeleteConfirm(null);
    if (selectedFolder === folderId) {
      setSelectedFolder(null);
    }
  };

  const handleUpdateFolder = (id, newTitle) => {
    if (newTitle.trim()) {
      dispatch(updateFolder({ id, title: newTitle }));
      setEditingFolder(null);
    }
  };

  const handleUpdateBookmark = (id, updates) => {
    if (updates.title.trim() && updates.url.trim()) {
      dispatch(updateBookmark({ id, updates }));
      setEditingBookmark(null);
    }
  };

  const handleAddBookmark = (bookmark) => {
    if (bookmark.title.trim() && bookmark.url.trim()) {
      const tags = bookmark.tags
        .split(', ')
        .map(tag => tag.trim())
        .filter(Boolean)
        .slice(0, MAX_TAGS);

      const newBookmark = {
        id: Date.now().toString(),
        ...bookmark,
        tags,
        folder: selectedFolder,
        dateAdded: Date.now(),
        starred: false,
        originalFolder: selectedFolder
      };
      dispatch(addBookmark(newBookmark));
      setShowBookmarkPopup(false);
    }
  };

  const handleStarBookmark = (bookmark) => {
    const updates = {
      starred: !bookmark.starred,
    };

    // Check if the bookmark is already in the favorites folder
    if (!bookmark.starred) {
      const isAlreadyFavorite = bookmarks.some(b => b.id === bookmark.id && b.starred);
      if (isAlreadyFavorite) {
        return; // Do not add duplicate favorite
      }
    }

    dispatch(updateBookmark({
      id: bookmark.id,
      updates,
      addToFavorites: !bookmark.starred
    }));
  };

  const handleDeleteBookmark = (bookmarkId) => {
    dispatch(deleteBookmark(bookmarkId));
    setShowDeleteConfirm(null);
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const searchTerms = searchQuery.toLowerCase();
    const matchesSearch = searchQuery ? (
      bookmark.title.toLowerCase().includes(searchTerms) ||
      bookmark.url.toLowerCase().includes(searchTerms) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerms))
    ) : true;
    const matchesFolder = selectedFolder ? bookmark.folder === selectedFolder ||
      (selectedFolder === FAVORITES_FOLDER.id && bookmark.starred) : true;
    return matchesSearch && (searchQuery ? true : matchesFolder);
  });

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <span key={i} className="bg-yellow-400/30 transition-colors duration-200">{part}</span>
        : part
    );
  };


  return (
    <div className="h-full flex">
      {/* Folders Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-white/10 p-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mb-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 flex items-center gap-2"
          onClick={() => setShowFolderPopup(true)}
        >
          <Plus size={16} />
          <span>New Folder</span>
        </motion.button>

        <div className="space-y-1">
          {folders.map((folder) => (
            <motion.div
              key={folder.id}
              whileHover={{ x: 2 }}
              className={`w-full px-4 py-2 rounded-lg flex items-center justify-between group ${selectedFolder === folder.id ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
                }`}
            >
              <div
                className="flex-1 flex items-center gap-2 cursor-pointer"
                onClick={() => setSelectedFolder(folder.id)}
              >
                <Folder size={16} />
                <span>{folder.title}</span>
                <span className="text-sm text-white/50">
                  ({folder.isDefault ? bookmarks.filter(b => b.starred).length : folder.count})
                </span>
              </div>
              {!folder.isDefault && (
                <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white/50 hover:text-white/90"
                    onClick={() => setEditingFolder(folder)}
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white/50 hover:text-red-400"
                    onClick={() => setShowDeleteConfirm({ type: 'folder', id: folder.id })}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-4"
      >
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search bookmarks..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 transition-all duration-200 focus:border-white/20 focus:ring-1 focus:ring-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {selectedFolder && selectedFolder !== FAVORITES_FOLDER.id && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 flex items-center gap-2"
            onClick={() => setShowBookmarkPopup(true)}
          >
            <Plus size={16} />
            <span>Add URL</span>
          </motion.button>
        )}

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.map(bookmark => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
                className="group p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      className={`transition-colors duration-200 ${bookmark.starred ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-400'
                        }`}
                      onClick={() => handleStarBookmark(bookmark)}
                    >
                      <Star size={16} />
                    </motion.button>

                    <div>
                      <a
                        href={bookmark.url}
                        target="_self"
                        className="text-white/90 font-medium hover:underline"
                      >
                        {highlightText(bookmark.title, searchQuery)}
                      </a>
                      <p className="text-sm text-white/50">
                        {highlightText(bookmark.url, searchQuery)}
                      </p>
                      {bookmark.tags.length > 0 && (
                        <div className="flex gap-2 mt-1">
                          {bookmark.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-white/10 rounded transition-colors duration-200 hover:bg-white/20"
                            >
                              {highlightText(tag, searchQuery)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-2">
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
                        onClick={() => setShowDeleteConfirm({ type: 'bookmark', id: bookmark.id })}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Popups */}
      <AnimatePresence>
        {showFolderPopup && (
          <PopupModal
            title="Create New Folder"
            onClose={() => setShowFolderPopup(false)}
            onSubmit={handleAddFolder}
            fields={[
              { name: 'title', label: 'Folder Name', type: 'text' }
            ]}
          />
        )}

        {editingFolder && (
          <PopupModal
            title="Edit Folder"
            initialValues={{ title: editingFolder.title }}
            onClose={() => setEditingFolder(null)}
            onSubmit={(values) => handleUpdateFolder(editingFolder.id, values.title)}
            fields={[
              { name: 'title', label: 'Folder Name', type: 'text' }
            ]}
          />
        )}

        {showBookmarkPopup && (
          <PopupModal
            title="Add Bookmark"
            onClose={() => setShowBookmarkPopup(false)}
            onSubmit={handleAddBookmark}
            fields={[
              { name: 'url', label: 'URL', type: 'text' },
              { name: 'title', label: 'Title', type: 'text' },
              {
                name: 'tags',
                label: `Tags (${MAX_TAGS}) Eg: Tech, Design, WebDev`,
                type: 'text',
                validate: value => {
                  const tags = value.split(',').map(t => t.trim()).filter(Boolean);
                  if (tags.length > MAX_TAGS) {
                    return `Maximum ${MAX_TAGS} tags allowed`;
                  }
                }
              }
            ]}
          />
        )}

        {editingBookmark && (
          <PopupModal
            title="Edit Bookmark"
            initialValues={{
              title: editingBookmark.title,
              url: editingBookmark.url,
              tags: editingBookmark.tags.join(', ')
            }}
            onClose={() => setEditingBookmark(null)}
            onSubmit={(values) => {
              const tags = values.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean)
                .slice(0, MAX_TAGS);

              handleUpdateBookmark(editingBookmark.id, {
                ...values,
                tags
              });
            }}
            fields={[
              { name: 'url', label: 'URL', type: 'text' },
              { name: 'title', label: 'Title', type: 'text' },
              {
                name: 'tags',
                label: `Tags (${MAX_TAGS}) Eg: Tech, Design, WebDev`,
                type: 'text',
                validate: value => {
                  const tags = value.split(',').map(t => t.trim()).filter(Boolean);
                  if (tags.length > MAX_TAGS) {
                    return `Maximum ${MAX_TAGS} tags allowed`;
                  }
                }
              }
            ]}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmModal
            type={showDeleteConfirm.type}
            onConfirm={() => {
              if (showDeleteConfirm.type === 'folder') {
                handleDeleteFolder(showDeleteConfirm.id);
              } else {
                handleDeleteBookmark(showDeleteConfirm.id);
              }
            }}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookmarkComponent;