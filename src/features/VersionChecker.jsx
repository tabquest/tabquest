import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_VERSION, VERSION_NOTES } from '../utils/version';
import { X } from 'lucide-react';

const VersionChecker = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationContent, setNotificationContent] = useState('');
    const [isNewVersion, setIsNewVersion] = useState(false);

    useEffect(() => {
        // Check if version_info exists in localStorage
        const storedVersion = localStorage.getItem('version_info');

        if (!storedVersion) {
            // First-time user - store current version and show simple notification
            localStorage.setItem('version_info', APP_VERSION);
            // setNotificationContent(`Current version: ${APP_VERSION}`);
            setNotificationContent(VERSION_NOTES[APP_VERSION]);
            setShowNotification(true);
        } else {
            // Check if version has changed
            if (storedVersion !== APP_VERSION) {
                // Version has changed - show release notes from VERSION_NOTES
                setIsNewVersion(true);
                setNotificationContent(VERSION_NOTES[APP_VERSION] || `Updated to version ${APP_VERSION}`);
                setShowNotification(true);

                // Update stored version
                localStorage.setItem('version_info', APP_VERSION);
            }
        }
    }, []);

    const closeNotification = () => {
        setShowNotification(false);
    };

    return (
        <div className="fixed top-20 right-6 z-[200]">
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative w-72"
                    >
                        <div className="relative rounded-xl shadow-xl overflow-hidden"
                            style={{
                                background: 'var(--tq-glass-bg)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                border: '1px solid var(--tq-border-2)',
                            }}
                        >
                            <div className="relative p-4 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg" style={{ background: 'rgba(var(--tq-accent-rgb), 0.1)' }}>
                                            <Bell className="h-4 w-4" style={{ color: 'var(--tq-accent)' }} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--tq-text-primary)' }}>
                                                New Update!
                                            </h3>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--tq-accent)' }}>
                                                v{APP_VERSION}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeNotification}
                                        className="p-1 rounded-md hover:bg-[var(--tq-hover-bg)] transition-colors cursor-pointer"
                                        style={{ color: 'var(--tq-text-muted)' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <p className="text-sm leading-relaxed" style={{ color: 'var(--tq-text-secondary)' }}>
                                    {notificationContent}
                                </p>

                                <motion.button
                                    whileHover={{ opacity: 0.9, scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={closeNotification}
                                    className="w-full py-2 rounded-lg text-black text-sm font-bold cursor-pointer transition-all"
                                    style={{
                                        background: 'var(--tq-accent)',
                                    }}
                                >
                                    Got it!
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VersionChecker;