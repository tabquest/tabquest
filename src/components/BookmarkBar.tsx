import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import { FAVICON_URL } from '../utils/constants';
import type { RootState } from '../utils/redux/store';
import type { BookmarkLink } from '../types/domain';

const getFaviconUrl = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    if (hostname === 'mail.google.com' || hostname.includes('gmail'))
      return 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico';
    return FAVICON_URL + hostname;
  } catch {
    return '';
  }
};

const cacheFavicon = async (url: string): Promise<string> => {
  const cache: Record<string, string> = JSON.parse(
    localStorage.getItem('favicons') || '{}',
  );
  if (cache[url]) return cache[url];
  const faviconUrl = getFaviconUrl(url);
  cache[url] = faviconUrl;
  localStorage.setItem('favicons', JSON.stringify(cache));
  return faviconUrl;
};

const spring = { type: 'spring', stiffness: 420, damping: 24 } as const;

const BookmarkBar = () => {
  const bookmarks = useSelector((state: RootState) => state.settings.bookmarks);
  const [favicons, setFavicons] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const result: Record<string, string> = {};
      for (const bm of bookmarks) {
        result[bm.url] = await cacheFavicon(bm.url);
      }
      setFavicons(result);
    };
    load();
  }, [bookmarks]);

  if (!bookmarks.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="flex items-end gap-2.5 px-4 pt-2.5 pb-2.5 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.06)',
        backdropFilter: 'blur(48px)',
        WebkitBackdropFilter: 'blur(48px)',
      }}
    >
      {bookmarks.map((bookmark: BookmarkLink, index: number) => (
        <BookmarkItem
          key={index}
          bookmark={bookmark}
          favicon={favicons[bookmark.url]}
          index={index}
          spring={spring}
        />
      ))}
    </motion.div>
  );
};

/* ── Single dock icon ──────────────────────────────────────────────────────── */
interface ItemProps {
  bookmark: BookmarkLink;
  favicon: string | undefined;
  index: number;
  spring: object;
}

const BookmarkItem = ({ bookmark, favicon, index, spring }: ItemProps) => {
  const [hovered, setHovered] = useState(false);

  const iconSize = 'clamp(2.5rem, 4vw, 3rem)';

  return (
    <motion.a
      href={bookmark.url}
      title={bookmark.name}
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.04,
        duration: 0.35,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="relative flex flex-col items-center cursor-pointer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Tooltip — floats above icon */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute bottom-full mb-2 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap pointer-events-none"
            style={{
              background: 'rgba(4,4,10,.92)',
              color: 'rgba(255,255,255,.85)',
              border: '1px solid rgba(255,255,255,.09)',
              boxShadow: '0 8px 24px rgba(0,0,0,.6)',
            }}
          >
            {bookmark.name}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Icon tile — lifts and glows on hover */}
      <motion.div
        animate={hovered ? { y: -5, scale: 1.16 } : { y: 0, scale: 1 }}
        transition={spring}
        className="flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          width: iconSize,
          height: iconSize,
          background: hovered
            ? 'rgba(255,255,255,.08)'
            : 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.07)',
          backdropFilter: 'blur(20px)',
          boxShadow: hovered
            ? `0 10px 28px rgba(0,0,0,.6), 0 0 0 1px var(--tq-accent), 0 0 20px var(--tq-accent-glow)`
            : '0 2px 8px rgba(0,0,0,.4)',
          transition: 'background 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <img
          src={favicon}
          alt={bookmark.name}
          className="object-contain rounded-sm"
          style={{ width: '54%', height: '54%' }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const fallback = img.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          className="hidden items-center justify-center w-full h-full"
          style={{ color: 'var(--tq-text-muted)' }}
        >
          <Globe size={14} strokeWidth={1.5} />
        </div>
      </motion.div>
    </motion.a>
  );
};

export default BookmarkBar;
