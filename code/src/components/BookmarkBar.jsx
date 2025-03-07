import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import { FAVICON_URL } from '../utils/constants';

const getFaviconUrl = (url) => {
  try {
    const hostname = new URL(url).hostname;

    // Check for Gmail URL pattern
    if (hostname === 'mail.google.com' || hostname.includes('gmail')) {
      // Gmail icon URL
      return 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico';
    }

    return FAVICON_URL + hostname;
  } catch {
    return ''; // Fallback for invalid URLs
  }
};

const cacheFavicon = async (url) => {
  const cachedFavicons = JSON.parse(localStorage.getItem('favicons') || '{}');

  if (cachedFavicons[url]) {
    return cachedFavicons[url];
  }

  const faviconUrl = getFaviconUrl(url);
  cachedFavicons[url] = faviconUrl;
  localStorage.setItem('favicons', JSON.stringify(cachedFavicons));

  return faviconUrl;
};

const BookmarkBar = () => {
  const bookmarks = useSelector((state) => state.settings.bookmarks);
  const [cachedFavicons, setCachedFavicons] = useState({});

  useEffect(() => {
    const loadFavicons = async () => {
      const favicons = {};
      for (const bookmark of bookmarks) {
        favicons[bookmark.url] = await cacheFavicon(bookmark.url);
      }
      setCachedFavicons(favicons);
    };
    loadFavicons();
  }, [bookmarks]);

  // const containerWidth = useMemo(() => {
  //   const itemWidth = 80;
  //   const minWidth = 320;
  //   const maxWidth = 1200;
  //   const calculatedWidth = bookmarks.length * itemWidth;

  //   return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
  // }, [bookmarks.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-8 left-0 right-0 mx-auto w-fit px-4"
      style={{
        minWidth: 'min(90vw, 320px)',
        maxWidth: 'min(90vw, 1200px)',
      }}
    >
      <motion.div
        className="relative backdrop-blur-xl bg-black/20 rounded-2xl py-5 px-8 shadow-lg border border-white/10"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-50" />

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
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative flex items-center justify-center w-14 h-14"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 rounded-xl bg-black/40 border border-white/10 group-hover:border-white/20 transition-all duration-300" />

                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-emerald-500/10 blur-md rounded-full"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />

                  <img
                    src={cachedFavicons[bookmark.url]}
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
