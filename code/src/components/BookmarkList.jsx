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
                  <div
                  onClick={() => window.open(bookmark.url)}
                    // href={bookmark.url}
                    className="text-white/90 font-medium hover:underline"
                  >
                    {highlightText(bookmark.title, searchQuery)}
                  </div>
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
  );
};

export default BookmarkList;