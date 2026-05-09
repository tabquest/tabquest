import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CHRISTMAS_MODE } from '../utils/constants';
import type { RootState } from '../utils/redux/store';

import { Copy, ExternalLink, Check } from 'lucide-react';
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaReddit,
  FaXTwitter,
} from 'react-icons/fa6';

const SocialIcons: Record<string, React.ReactElement> = {
  linkedin: <FaLinkedin />,
  github: <FaGithub />,
  twitter: <FaXTwitter />,
  instagram: <FaInstagram />,
  reddit: <FaReddit />,
};

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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
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

  const truncatedName =
    userName.length > 12 ? `${userName.slice(0, 12)}...` : userName;
  const userInitial = userName ? userName[0].toUpperCase() : '?';

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

  const trimmedPortfolio = userPortfolioUrl
    ? userPortfolioUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : '';

  // Shared icon-button style
  const iconBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    border: '1px solid var(--tq-glass-border)',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--tq-text-secondary)',
    flexShrink: 0,
    padding: 0,
  };

  return (
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

      {/* Trigger pill button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        title="View Profile"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '9999px',
          padding: '6px 12px 6px 6px',
          background: 'var(--tq-glass-bg)',
          border: '1px solid var(--tq-glass-border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
          transition: 'opacity 0.15s',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              profileImageUrl && !profileImageError
                ? 'transparent'
                : 'linear-gradient(135deg, rgba(var(--tq-accent-rgb), 0.8), rgba(var(--tq-accent-rgb), 0.4))',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--tq-text-primary)',
          }}
        >
          {profileImageUrl && !profileImageError ? (
            <img
              src={profileImageUrl}
              alt={userName}
              onError={() => setProfileImageError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            userInitial
          )}
        </div>

        {/* Name */}
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--tq-text-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          {truncatedName}
        </span>

        {/* Online dot */}
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: isOnline ? '#22c55e' : '#ef4444',
            boxShadow: isOnline ? '0 0 5px #22c55e' : '0 0 5px #ef4444',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Profile card dropdown via portal */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={popoverRef}
              style={{
                position: 'fixed',
                zIndex: 9999,
                top: popoverPos.top,
                right: popoverPos.right,
              }}
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            >
              <div
                style={{
                  background: 'var(--tq-glass-bg)',
                  border: '1px solid var(--tq-glass-border)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  width: '256px',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                }}
              >
                {/* Accent gradient header strip */}
                <div
                  style={{
                    height: '56px',
                    background:
                      'linear-gradient(135deg, rgba(var(--tq-accent-rgb), 0.4), rgba(var(--tq-accent-rgb), 0.1))',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {/* Avatar overlapping the strip */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '16px',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      border: '2px solid var(--tq-glass-border)',
                      overflow: 'hidden',
                      background:
                        profileImageUrl && !profileImageError
                          ? 'transparent'
                          : 'linear-gradient(135deg, rgba(var(--tq-accent-rgb), 0.7), rgba(var(--tq-accent-rgb), 0.3))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--tq-text-primary)',
                    }}
                  >
                    {profileImageUrl && !profileImageError ? (
                      <img
                        src={profileImageUrl}
                        alt={userName}
                        onError={() => setProfileImageError(true)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      userInitial
                    )}
                  </div>

                  {/* Online indicator dot — top-right of header */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isOnline ? '#22c55e' : '#ef4444',
                      boxShadow: isOnline
                        ? '0 0 6px #22c55e'
                        : '0 0 6px #ef4444',
                    }}
                  />
                </div>

                {/* Card body */}
                <div
                  style={{
                    padding: '28px 16px 16px',
                    color: 'var(--tq-text-primary)',
                  }}
                >
                  {/* Name + role */}
                  <div style={{ marginBottom: '12px' }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: '15px',
                        lineHeight: '1.2',
                        margin: 0,
                      }}
                    >
                      {userName}
                    </p>
                    {userRole && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--tq-text-secondary)',
                          marginTop: '3px',
                          margin: '3px 0 0',
                        }}
                      >
                        {userRole}
                      </p>
                    )}
                  </div>

                  {/* Portfolio row */}
                  {userPortfolioUrl && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        marginBottom: '12px',
                        alignItems: 'center',
                      }}
                    >
                      <a
                        href={validateUrl(userPortfolioUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          fontSize: '11px',
                          color: 'var(--tq-text-secondary)',
                          textDecoration: 'none',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--tq-glass-border)',
                          background: 'transparent',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                        }}
                        title={userPortfolioUrl}
                      >
                        {trimmedPortfolio}
                      </a>
                      <button
                        onClick={() => copyToClipboard(userPortfolioUrl)}
                        style={iconBtnStyle}
                        title="Copy portfolio URL"
                      >
                        <Copy size={12} />
                      </button>
                      <a
                        href={validateUrl(userPortfolioUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...iconBtnStyle, textDecoration: 'none' }}
                        title="Open portfolio"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  {/* Divider */}
                  <div
                    style={{
                      height: '1px',
                      background: 'var(--tq-border-1)',
                      marginBottom: '12px',
                    }}
                  />

                  {/* Social links — only non-empty */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {Object.entries(SocialProfiles).map(([key, value]) =>
                      value ? (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            background:
                              hoveredKey === key
                                ? 'var(--tq-hover-bg)'
                                : 'transparent',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={() => setHoveredKey(key)}
                          onMouseLeave={() => setHoveredKey(null)}
                        >
                          <span
                            style={{
                              color: 'var(--tq-text-secondary)',
                              fontSize: '14px',
                              display: 'flex',
                              flexShrink: 0,
                            }}
                          >
                            {SocialIcons[key]}
                          </span>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1,
                              fontSize: '12px',
                              color: 'var(--tq-text-primary)',
                              textDecoration: 'none',
                              textTransform: 'capitalize',
                            }}
                          >
                            {key === 'twitter' ? 'X / Twitter' : key}
                          </a>
                          <button
                            onClick={() => copyToClipboard(value)}
                            style={{
                              ...iconBtnStyle,
                              opacity: hoveredKey === key ? 1 : 0.4,
                              transition: 'opacity 0.15s',
                            }}
                            title="Copy URL"
                          >
                            <Copy size={11} />
                          </button>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              ...iconBtnStyle,
                              opacity: hoveredKey === key ? 1 : 0.4,
                              transition: 'opacity 0.15s',
                              textDecoration: 'none',
                            }}
                            title="Open link"
                          >
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Copied toast via portal */}
      {createPortal(
        <AnimatePresence>
          {copiedText && (
            <motion.div
              style={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'var(--tq-glass-bg)',
                border: '1px solid var(--tq-glass-border)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={14} style={{ color: '#22c55e' }} />
              <span
                style={{ fontSize: '13px', color: 'var(--tq-text-primary)' }}
              >
                Copied!
              </span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default SocialPopover;
