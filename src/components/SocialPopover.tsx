import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CHRISTMAS_MODE } from '../utils/constants';
import type { RootState } from '../utils/redux/store';

import {
  Copy,
  ExternalLink,
  User,
  Check,
  WifiOff,
  Wifi,
  Mail,
} from 'lucide-react';
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaReddit,
  FaXTwitter,
} from 'react-icons/fa6';

const SocialPopover = () => {
  const SocialProfiles = useSelector(
    (state: RootState) => state.settings.socialProfiles,
  );
  const userName = useSelector((state: RootState) => state.settings.userName);
  const userRole = useSelector((state: RootState) => state.settings.userRole);
  const userPortfolioUrl = useSelector(
    (state: RootState) => state.settings.userPortfolioUrl,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [profileImageError, setProfileImageError] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      (window.ononline = window.onoffline =
        () => setIsOnline(navigator.onLine)),
    [],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        popoverRef.current?.contains(e.target as Node)
      )
        return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const SocialIcons: Record<string, React.ReactElement> = {
    linkedin: <FaLinkedin />,
    github: <FaGithub />,
    twitter: <FaXTwitter />,
    instagram: <FaInstagram />,
    reddit: <FaReddit />,
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const validateUrl = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const githubUrl = SocialProfiles.github;
  const githubUsername = githubUrl ? githubUrl.split('github.com/')[1] : null;
  const profileImageUrl = githubUsername
    ? `https://github.com/${githubUsername}.png`
    : null;

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen((prev) => !prev);
  };

  return (
    // Wrapper keeps layout flow; z-index here is irrelevant for the fixed popover
    <div className="relative inline-block">
      {CHRISTMAS_MODE && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: 1,
            rotate: [0, -10, 10, -5, 5, 0],
          }}
          transition={{
            delay: 0.5,
            scale: { type: 'spring' },
            rotate: {
              delay: 1,
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            },
          }}
          className="absolute -top-4 -left-4 text-3xl z-20 filter drop-shadow-lg pointer-events-none origin-bottom"
        >
          🎅
        </motion.div>
      )}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center space-x-3 rounded-xl px-3 py-2.5 text-base transition-all cursor-pointer"
        title="View Profile"
        style={{
          background: 'var(--tq-glass-bg)',
          border: '1px solid var(--tq-glass-border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {profileImageUrl && !profileImageError ? (
          <img
            className="h-6 w-6 rounded-md"
            src={profileImageUrl}
            alt={userName}
            onError={() => setProfileImageError(true)}
          />
        ) : (
          <User
            className="h-5 w-5"
            style={{ color: 'var(--tq-text-secondary)' }}
          />
        )}
        <span
          className="font-medium"
          style={{ color: 'var(--tq-text-primary)' }}
        >
          {userName.length > 12 ? `${userName.slice(0, 12)}...` : userName}
        </span>
        {!isOnline ? (
          <WifiOff
            size={20}
            style={{ color: 'var(--tq-danger)' }}
            className="ml-2"
          />
        ) : (
          <Wifi
            size={20}
            style={{ color: 'var(--tq-success)' }}
            className="ml-2"
          />
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={popoverRef}
              className="fixed z-[9999]"
              style={{ top: popoverPos.top, right: popoverPos.right }}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div
                className="w-72 rounded-xl p-4 shadow-2xl"
                style={{
                  background: 'var(--tq-glass-bg)',
                  border: '1px solid var(--tq-glass-border)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <div
                  className="flex items-center justify-between pb-3 mb-3"
                  style={{ borderBottom: '1px solid var(--tq-border-1)' }}
                >
                  <div>
                    <h3
                      className="text-base font-medium"
                      style={{ color: 'var(--tq-text-primary)' }}
                    >
                      {userName.length > 12
                        ? `${userName.slice(0, 12)}...`
                        : userName}
                    </h3>
                    {userRole !== '' && (
                      <p
                        className="text-sm mt-0.5 capitalize"
                        style={{ color: 'var(--tq-text-secondary)' }}
                      >
                        {userRole.length > 15
                          ? `${userRole.slice(0, 15)}..`
                          : userRole}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <a
                      href="https://mail.google.com/"
                      className="rounded-lg p-1.5 transition-colors cursor-pointer"
                      style={{ color: 'var(--tq-text-secondary)' }}
                      title="Open Gmail"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                    {userPortfolioUrl !== '' && (
                      <>
                        <button
                          onClick={() => copyToClipboard(userPortfolioUrl)}
                          className="rounded-lg p-1.5 transition-colors cursor-pointer"
                          style={{ color: 'var(--tq-text-secondary)' }}
                          title="Copy portfolio URL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <a
                          href={validateUrl(userPortfolioUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 transition-colors cursor-pointer"
                          style={{ color: 'var(--tq-text-secondary)' }}
                          title="Open portfolio website"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  {Object.entries(SocialProfiles).map(
                    ([key, value]) =>
                      value !== '' && (
                        <motion.div
                          key={key}
                          className="group relative flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              'var(--tq-hover-bg)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              'transparent')
                          }
                        >
                          <a
                            href={value}
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center gap-3 cursor-pointer"
                            style={{ color: 'var(--tq-text-primary)' }}
                          >
                            <span
                              className="text-lg"
                              style={{ color: 'var(--tq-text-secondary)' }}
                            >
                              {SocialIcons[key]}
                            </span>
                            <p className="text-base capitalize">
                              {key === 'twitter' ? 'X' : key}
                            </p>
                          </a>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => copyToClipboard(value)}
                              className="rounded-lg p-1.5 transition-colors cursor-pointer"
                              style={{ color: 'var(--tq-text-secondary)' }}
                              title="Copy URL"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg p-1.5 transition-colors cursor-pointer"
                              style={{ color: 'var(--tq-text-secondary)' }}
                              title="Open link"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </motion.div>
                      ),
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {copiedText &&
        createPortal(
          <motion.div
            className="fixed top-4 right-4 z-[9999]"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-3 shadow-xl"
              style={{
                background: 'var(--tq-glass-bg)',
                border: '1px solid var(--tq-glass-border)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <Check
                className="h-4 w-4"
                style={{ color: 'var(--tq-success)' }}
              />
              <span
                className="text-sm"
                style={{ color: 'var(--tq-text-primary)' }}
              >
                Copied to clipboard
              </span>
            </div>
          </motion.div>,
          document.body,
        )}
    </div>
  );
};

export default SocialPopover;
