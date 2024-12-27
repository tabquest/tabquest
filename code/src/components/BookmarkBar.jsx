import React from 'react';
import { Globe } from 'lucide-react';

// Function to get the favicon URL using a higher-quality service
const getFaviconUrl = (url) => {
  return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`;
};

const BookmarkBar = () => {
  const bookmarks = [
    { url: 'https://claude.ai/new', name: 'Claude AI' },
    { url: 'https://www.eraser.io', name: 'Eraser' },
    { url: 'https://www.netflix.com', name: 'Netflix' },
    { url: 'https://youtube.com', name: 'YouTube' },
    { url: 'https://leetcode.com', name: 'Leetcode' },
    { url: 'https://excalidraw.com', name: 'Excalidraw' },
    { url: 'https://gamma.app', name: 'Gamma' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl mx-auto p-4">
      <div className="backdrop-blur-md bg-black/40 rounded-2xl p-6 shadow-2xl border border-white/5">
        <div className="flex items-center justify-between gap-4">
          {bookmarks.map((bookmark, index) => (
            <a
              key={index}
              href={bookmark.url}
              rel="noopener noreferrer"
              className="group flex flex-col items-center flex-1"
            >
              <div className="w-16 h-16 mb-3 rounded-2xl bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-black/50 group-hover:scale-110 border border-white/10 group-hover:border-white/20 shadow-lg">
                <img
                  src={getFaviconUrl(bookmark.url)}
                  alt={bookmark.name}
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <Globe className="w-10 h-10 text-white/70 hidden" />
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
