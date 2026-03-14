import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Folder, Edit2, Trash2, Star, Heart, List, Grid3X3 } from 'lucide-react';
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
} from '../../utils/redux/bookmarkSlice';
import { loadFromLocalStorage } from '../../utils/loadFromLocalStorage';
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
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('bookmarkViewMode') || 'list';
  });

  // Load initial data
  useEffect(() => {
    const { folders: savedFolders, bookmarks } = loadFromLocalStorage();
    const foldersWithFavorites = [FAVORITES_FOLDER, ...savedFolders.filter(f => f.id !== FAVORITES_FOLDER.id)];
    dispatch(setFolders(foldersWithFavorites));
    dispatch(setBookmarks(bookmarks));
  }, [dispatch]);



  const handleAddFolder = (values) => {
    if (values.title && values.title.trim()) {
      const trimmedTitle = values.title.trim();
      const isDuplicate = folders.some(folder => 
        folder.title.toLowerCase() === trimmedTitle.toLowerCase()
      );
      
      if (isDuplicate) {
        setError('A folder with this name already exists!');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      dispatch(addFolder({
        id: Date.now().toString(),
        title: trimmedTitle,
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
      const trimmedTitle = newTitle.trim();
      const isDuplicate = folders.some(folder => 
        folder.id !== id && folder.title.toLowerCase() === trimmedTitle.toLowerCase()
      );
      
      if (isDuplicate) {
        setError('A folder with this name already exists!');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      dispatch(updateFolder({ id, title: trimmedTitle }));
      setEditingFolder(null);
    }
  };

  const handleUpdateBookmark = (id, updates) => {
    if (updates.title.trim() && updates.url.trim()) {
      const url = updates.url.trim();
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      dispatch(updateBookmark({ id, updates: { ...updates, url: formattedUrl } }));
      setEditingBookmark(null);
    }
  };

  const handleAddBookmark = (bookmark) => {
    if (bookmark.title.trim() && bookmark.url.trim()) {
      const url = bookmark.url.trim();
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

      const tags = bookmark.tags
        .split(', ')
        .map(tag => tag.trim())
        .filter(Boolean)
        .slice(0, MAX_TAGS);

      const newBookmark = {
        id: Date.now().toString(),
        ...bookmark,
        url: formattedUrl,
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
        ? <span key={i} className="tq-warning-bg transition-colors duration-200">{part}</span>
        : part
    );
  };

  return (
    <div className="h-full flex">
      {/* Folders Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{ overflowY: 'auto', height: "72vh" }}
        className="w-64 border-r tq-border-1 p-4 custom-scrollbar"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mb-4 px-4 py-2 tq-surface-2 hover:tq-surface-3 rounded-lg tq-text-primary flex items-center gap-2"
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
              className={`w-full px-4 py-2 rounded-lg flex items-center justify-between group ${selectedFolder === folder.id ? 'tq-surface-3 tq-text-primary' : 'tq-text-secondary hover:tq-text-primary'
                }`}
            >
              <div
                className="flex-1 flex items-center gap-2 cursor-pointer"
                onClick={() => setSelectedFolder(folder.id)}
              >
                {folder.id === 'favorites' ? <Heart size={18} /> : <Folder size={16} />}
                <span>
                  {folder.title.length > 11 ? `${folder.title.slice(0, 11)}..` : folder.title}
                </span>
                <span className="text-sm tq-text-muted">
                  ({folder.isDefault ? bookmarks.filter(b => b.starred).length : folder.count})
                </span>
              </div>
              {!folder.isDefault && (
                <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="tq-text-muted hover:tq-text-primary"
                    onClick={() => setEditingFolder(folder)}
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="tq-text-muted hover:tq-danger"
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
        style={{ overflowY: 'auto', height: "72vh" }}
        className="flex-1 p-4 custom-scrollbar"
      >
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] p-3 tq-danger-bg border border-red-500 rounded-lg tq-text-primary text-sm shadow-lg backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="relative mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 tq-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search bookmarks..."
              className="w-full pl-10 pr-4 py-2 tq-surface-2 border tq-border-1 rounded-lg tq-text-primary focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex tq-surface-2 rounded-lg p-1">
              <button
                onClick={() => {
                  setViewMode('list');
                  localStorage.setItem('bookmarkViewMode', 'list');
                }}
                title="List View"
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'tq-surface-3 tq-text-primary' : 'tq-text-muted hover:tq-text-primary'}`}
              >
                <List size={16} />
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    setViewMode('grid');
                    localStorage.setItem('bookmarkViewMode', 'grid');
                  }}
                  title="Grid View"
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'tq-surface-3 tq-text-primary' : 'tq-text-muted hover:tq-text-primary'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <span className="absolute -top-1 -right-2 tq-success-bg tq-text-primary px-1 py-0.1 rounded text-[8px] font-medium z-10">
                  New
                </span>
              </div>
            </div>

            {selectedFolder && selectedFolder !== FAVORITES_FOLDER.id && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 tq-surface-2 hover:tq-surface-3 rounded-lg tq-text-primary flex items-center gap-2"
                onClick={() => setShowBookmarkPopup(true)}
              >
                <Plus size={16} />
                <span>Add URL</span>
              </motion.button>
            )}
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="text-center tq-text-muted py-8">
            <p>No bookmarks found...</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredBookmarks.map(bookmark => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}

                  whileHover={{ scale: 1.01, x: 4 }}
                  className="group p-4 tq-gradient-subtle hover:from-white/10 hover:to-white/15 rounded-xl border tq-border-1 transition-all duration-200 cursor-pointer"
                  onClick={() => window.open(bookmark.url, '_blank')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        whileTap={{ scale: 0.9 }}
                        className={`transition-colors duration-200 ${bookmark.starred ? 'tq-warning' : 'tq-text-muted hover:tq-warning'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarBookmark(bookmark);
                        }}
                      >
                        {bookmark.starred ? (
                          <Star fill="currentColor" size={18} />
                        ) : (
                          <Star size={18} />
                        )}
                      </motion.button>

                      <div className="flex-1">
                        <h3 className="tq-text-primary font-medium text-base mb-1">
                          {highlightText(
                            bookmark.title.length > 40
                              ? `${bookmark.title.slice(0, 40)}...`
                              : bookmark.title,
                            searchQuery
                          )}
                        </h3>
                        <p className="text-sm tq-text-muted mb-2">
                          {highlightText(
                            bookmark.url.length > 50
                              ? `${bookmark.url.slice(0, 50)}...`
                              : bookmark.url,
                            searchQuery
                          )}
                        </p>
                        {bookmark.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {bookmark.tags.map(tag => (
                              <span
                                key={tag}
                                className="text-xs px-3 py-1 tq-surface-3 rounded-full tq-text-secondary hover:tq-hover-bg transition-colors"
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
                          className="p-2 tq-text-muted hover:tq-text-primary hover:tq-surface-3 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBookmark(bookmark);
                          }}
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 tq-text-muted hover:tq-danger hover:tq-danger-bg rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm({ type: 'bookmark', id: bookmark.id });
                          }}
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
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredBookmarks.map(bookmark => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group relative h-40 w-full tq-surface-2 hover:tq-surface-3 rounded-xl border tq-border-1 transition-all duration-200 cursor-pointer overflow-hidden"
                  onClick={() => window.open(bookmark.url, '_blank')}
                >
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute top-3 right-3 z-10 transition-colors duration-200 ${bookmark.starred ? 'tq-warning' : 'tq-text-muted hover:tq-warning'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarBookmark(bookmark);
                    }}
                  >
                    {bookmark.starred ? (
                      <Star fill="currentColor" size={18} />
                    ) : (
                      <Star size={18} />
                    )}
                  </motion.button>

                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 bg-black/60 rounded tq-text-secondary hover:tq-text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBookmark(bookmark);
                      }}
                    >
                      <Edit2 size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 bg-black/60 rounded tq-text-secondary hover:tq-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm({ type: 'bookmark', id: bookmark.id });
                      }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>

                  <div className="p-4 h-full flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-center text-center">
                      <h3 className="tq-text-primary font-medium text-sm mb-2 line-clamp-2">
                        {highlightText(
                          bookmark.title.length > 25
                            ? `${bookmark.title.slice(0, 25)}...`
                            : bookmark.title,
                          searchQuery
                        )}
                      </h3>
                      <p className="text-xs tq-text-muted line-clamp-1">
                        {highlightText(
                          bookmark.url.replace(/^https?:\/\//, '').split('/')[0],
                          searchQuery
                        )}
                      </p>
                    </div>

                    {bookmark.tags.length > 0 && (
                      <div className="flex justify-center gap-1 mt-2">
                        {bookmark.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 tq-surface-3 rounded-full tq-text-secondary"
                          >
                            {tag.length > 8 ? `${tag.slice(0, 8)}..` : tag}
                          </span>
                        ))}
                        {bookmark.tags.length > 2 && (
                          <span className="text-xs px-2 py-0.5 tq-surface-3 rounded-full tq-text-muted">
                            +{bookmark.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Popups */}
      <AnimatePresence>
        {showFolderPopup && (
          <PopupModal
            title="Create New Folder"
            onClose={() => setShowFolderPopup(false)}
            onSubmit={handleAddFolder}
            fields={[
              {
                name: 'title',
                label: 'Folder Name',
                type: 'text',
                placeholder: 'Enter folder name...'
              }
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
              {
                name: 'title',
                label: 'Folder Name',
                type: 'text',
                placeholder: 'Enter folder name...'
              }
            ]}
          />
        )}

        {showBookmarkPopup && (
          <PopupModal
            title="Add Bookmark"
            onClose={() => setShowBookmarkPopup(false)}
            onSubmit={handleAddBookmark}
            fields={[
              {
                name: 'title',
                label: 'Title',
                type: 'text',
                placeholder: 'Enter bookmark title...'
              },
              {
                name: 'url',
                label: 'URL',
                type: 'text',
                placeholder: 'https://example.com',
                validate: value => {
                  if (!value || !value.trim()) return 'URL is required';
                  const formatted = value.startsWith('http') ? value : `https://${value}`;
                  try {
                    new URL(formatted);
                    if (!value.includes('.') && !value.includes('localhost') && !value.includes(':')) {
                      return 'Please enter a valid URL';
                    }
                  } catch (e) {
                    return 'Please enter a valid URL';
                  }
                }
              },
              {
                name: 'tags',
                label: `Tags (${MAX_TAGS})`,
                type: 'text',
                placeholder: 'tech, design, development...',
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
              {
                name: 'title',
                label: 'Title',
                type: 'text',
                placeholder: 'Enter bookmark title...'
              },
              {
                name: 'url',
                label: 'URL',
                type: 'text',
                placeholder: 'https://example.com',
                validate: value => {
                  if (!value || !value.trim()) return 'URL is required';
                  const formatted = value.startsWith('http') ? value : `https://${value}`;
                  try {
                    new URL(formatted);
                    if (!value.includes('.') && !value.includes('localhost') && !value.includes(':')) {
                      return 'Please enter a valid URL';
                    }
                  } catch (e) {
                    return 'Please enter a valid URL';
                  }
                }
              },
              {
                name: 'tags',
                label: `Tags (${MAX_TAGS}) Eg: Tech, Design, WebDev`,
                type: 'text',
                placeholder: 'tech, design, development...',
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