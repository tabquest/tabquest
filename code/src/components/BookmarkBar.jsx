import React from 'react';
import { Globe } from 'lucide-react';

const BookmarkBar = () => {
  const bookmarks = [
    { url: 'https://github.com', name: 'GitHub' },
    { url: 'https://twitter.com', name: 'Twitter' },
    { url: 'https://linkedin.com', name: 'LinkedIn' },
    { url: 'https://facebook.com', name: 'Facebook' },
    { url: 'https://youtube.com', name: 'YouTube' },
    { url: 'https://instagram.com', name: 'Instagram' },
    { url: 'https://google.com', name: 'Google' }
  ];

  const getFaviconUrl = (url) => `https://www.google.com/s2/favicons?domain=${url}&sz=64`;

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
                <img
                  src={getFaviconUrl(bookmark.url)}
                  alt={bookmark.name}
                  className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
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