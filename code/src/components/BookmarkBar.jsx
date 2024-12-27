import React from 'react';
import { Globe } from 'lucide-react';
import { FAVICON_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

const getFaviconUrl = (url) => {
  return FAVICON_URL + new URL(url).hostname;
};

const BookmarkBar = () => {
  const bookmarks = useSelector((state) => state.settings.bookmarks);
  // const bookmarks = [
  //   { url: 'https://claude.ai/new', name: 'Claude AI' },
  //   { url: 'https://www.eraser.io', name: 'Eraser' },
  //   { url: 'https://www.netflix.com', name: 'Netflix' },
  //   { url: 'https://youtube.com', name: 'YouTube' },
  //   { url: 'https://leetcode.com', name: 'Leetcode' },
  //   { url: 'https://excalidraw.com', name: 'Excalidraw' },
  //   { url: 'https://gamma.app', name: 'Gamma' },
  // ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl mx-auto px-4">
      <div className="relative backdrop-blur-xl bg-black/30 rounded-3xl p-6 shadow-2xl border border-white/10 before:absolute before:inset-0 before:rounded-3xl before:backdrop-blur-xl before:bg-gradient-to-b before:from-white/5 before:to-transparent before:opacity-50">
        <div className="relative flex items-center justify-between gap-4 z-10">
          {bookmarks.map((bookmark, index) => (
            <div
              key={index}
              onClick={() => window.location.href = bookmark.url}
              rel="noopener"
              className="group cursor-pointer flex flex-col items-center flex-1 transition-transform duration-300 hover:translate-y-2"
            >
              <div className="relative w-16 h-16 mb-3">
                <div className="absolute inset-0 rounded-2xl bg-black/40 transform transition-all duration-500 group-hover:scale-110 group-hover:bg-black/60 border border-white/10 group-hover:border-white/20" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                    <img
                      src={getFaviconUrl(bookmark.url)}
                      alt={bookmark.name}
                      className="relative rounded w-10 h-10 transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                    <Globe className="w-10 h-10 text-white/70 hidden" />
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-all duration-300 transform group-hover:translate-y-1">
                {bookmark.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarkBar;