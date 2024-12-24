import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const BookmarkBar = () => {
  const [cachedIcons, setCachedIcons] = useState({});

  const bookmarks = [
    { url: 'https://claude.ai/new', name: 'Claude AI' },
    { url: 'https://www.eraser.io/', name: 'Eraser' },
    { url: 'https://gamma.app', name: 'Gamma' },
    { url: 'https://youtube.com', name: 'YouTube' },
    { url: 'https://leetcode.com/', name: 'Leetcode' },
    { url: 'https://excalidraw.com/', name: 'Excalidraw' },
    { url: 'https://chromewebstore.google.com/', name: 'Web Store' }
  ];

  const getFaviconUrl = (url) => `https://www.google.com/s2/favicons?domain=${url}&sz=64`;

  // Function to cache favicon
  const cacheFavicon = async (url) => {
    const cacheKey = `favicon_${url}`;
    
    try {
      // Check if Cache API is available
      if ('caches' in window) {
        const cache = await caches.open('favicons-cache');
        
        // Check if favicon is already in cache
        const cachedResponse = await cache.match(cacheKey);
        
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          return URL.createObjectURL(blob);
        }

        // If not in cache, fetch and cache it
        const faviconUrl = getFaviconUrl(url);
        const response = await fetch(faviconUrl, { mode: 'cors' });
        const blob = await response.blob();
        
        // Store in cache
        const responseToCache = new Response(blob);
        await cache.put(cacheKey, responseToCache);
        
        // Return object URL
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('Error caching favicon:', error);
      return getFaviconUrl(url); // Fallback to direct URL if caching fails
    }
    
    return getFaviconUrl(url); // Fallback for browsers without Cache API
  };

  // Load and cache favicons on mount
  useEffect(() => {
    const loadFavicons = async () => {
      const icons = {};
      for (const bookmark of bookmarks) {
        icons[bookmark.url] = await cacheFavicon(bookmark.url);
      }
      setCachedIcons(icons);
    };

    loadFavicons();

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(cachedIcons).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [bookmarks]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl mx-auto p-4">
      <div className="backdrop-blur-md bg-black/40 rounded-2xl p-6 shadow-2xl border border-white/5">
        <div className="flex items-center justify-between gap-4">
          {bookmarks.map((bookmark, index) => (
            <a
              key={index}
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center flex-1"
            >
              <div className="w-16 h-16 mb-3 rounded-2xl bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-black/50 group-hover:scale-110 border border-white/10 group-hover:border-white/20 shadow-lg">
                {cachedIcons[bookmark.url] ? (
                  <img
                    src={cachedIcons[bookmark.url]}
                    alt={bookmark.name}
                    className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : (
                  <Globe className="w-8 h-8 text-white/70" />
                )}
                <Globe className="w-8 h-8 text-white/70 hidden" />
              </div>
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-200">
                {bookmark.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarkBar;