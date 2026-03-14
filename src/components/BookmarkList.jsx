import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Edit2, Trash2 } from 'lucide-react';

const BookmarkList = ({
  filteredBookmarks,
  handleStarBookmark,
  setEditingBookmark,
  setShowDeleteConfirm,
  highlightText,
  searchQuery
}) => {
  
  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {filteredBookmarks.map(bookmark => (
          <motion.div
            key={bookmark.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            layout
            className="group p-2 tq-surface-2 hover:tq-surface-3 rounded-lg border tq-border-1 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className={`cursor-pointer transition-colors duration-200 ${bookmark.starred ? 'tq-yellow' : 'tq-text-muted hover:tq-yellow'
                    }`}
                  onClick={() => handleStarBookmark(bookmark)}
                  title={bookmark.starred ? "Unstar Bookmark" : "Star Bookmark"}
                >
                  <Star size={16} />
                </motion.button>

                <div>
                  <div
                    onClick={() => window.location.replace(bookmark.url)}
                    className="tq-text-primary font-medium hover:underline cursor-pointer"
                    title="Open Bookmark"
                  >
                    {highlightText(bookmark.title, searchQuery)}
                  </div>
                  <p className="text-sm tq-text-muted">
                    {highlightText(bookmark.url, searchQuery)}
                  </p>
                  {bookmark.tags.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {bookmark.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 tq-surface-3 rounded transition-colors duration-200 hover:tq-hover-bg"
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
                    className="p-1 tq-text-muted hover:tq-text-primary cursor-pointer"
                    onClick={() => setEditingBookmark(bookmark)}
                    title="Edit Bookmark"
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 tq-text-muted hover:tq-danger cursor-pointer"
                    onClick={() => setShowDeleteConfirm({ type: 'bookmark', id: bookmark.id })}
                    title="Delete Bookmark"
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
  );
};

export default BookmarkList;