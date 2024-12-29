import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import { FAVICON_URL } from '../utils/constants';

const getFaviconUrl = (url) => {
  return FAVICON_URL + new URL(url).hostname;
};

const BookmarkBar = () => {
  const bookmarks = useSelector((state) => state.settings.bookmarks);

  const containerWidth = useMemo(() => {
    const itemWidth = 80;
    const minWidth = 320;
    const maxWidth = 1200;
    const calculatedWidth = bookmarks.length * itemWidth;

    return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
  }, [bookmarks.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-4 left-0 right-0 mx-auto w-fit px-4"
      style={{
        minWidth: 'min(90vw, 320px)',
        maxWidth: 'min(90vw, 1200px)',
      }}
    >
      <motion.div
        className="relative backdrop-blur-xl bg-black/20 rounded-2xl py-4 px-6 shadow-lg border border-white/10"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-50" />

        {/* Grid for bookmarks */}
        <div
          className="relative grid auto-cols-min gap-7 z-10"
          style={{
            gridTemplateColumns: `repeat(${bookmarks.length}, minmax(60px, 1fr))`,
            width: 'fit-content',
          }}
        >
          {bookmarks.map((bookmark, index) => (
            <motion.a
              key={index}
              href={bookmark.url}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col items-center gap-2"
              whileTap={{ scale: 0.95 }} // Add tap scale effect
            >
              <motion.div
                className="relative flex items-center justify-center w-12 h-12"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Icon background */}
                <div className="absolute inset-0 rounded-xl bg-black/40 border border-white/10 group-hover:border-white/20 transition-all duration-300" />

                <div className="relative">
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-emerald-500/10 blur-md rounded-full"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Icon */}
                  <img
                    src={getFaviconUrl(bookmark.url)}
                    alt={bookmark.name}
                    className="relative w-6 h-6 sm:w-8 sm:h-8 rounded transition-all duration-300 group-hover:brightness-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white/70 hidden" />
                </div>
              </motion.div>

              {/* Label */}
              <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors duration-200 text-center truncate w-full px-1">
                {bookmark.name.length > 8 ? `${bookmark.name.slice(0, 8)}...` : bookmark.name}
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookmarkBar;
