import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_VERSION, VERSION_NOTES } from '../utils/version';

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
        <div className="fixed top-0 right-0 z-50 p-4">
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative w-80"
                    >
                        <div className="relative overflow-hidden rounded-xl tq-surface-1 backdrop-blur-md border tq-border-1 p-4 shadow-lg">
                            <div className="absolute inset-0 tq-gradient-subtle" />
                            <div className="relative flex items-start gap-3">
                                <Bell className="h-5 w-5 tq-success mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold tq-text-primary mb-1">
                                        {isNewVersion ? `Updated to v${APP_VERSION}!` : `Your Version ${APP_VERSION}`}
                                    </h3>
                                    <p className="tq-text-muted text-sm">
                                        {notificationContent}
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={closeNotification}
                                        className="mt-3 w-full px-4 py-2 tq-success-bg hover:tq-success-bg tq-success rounded-lg text-sm font-medium transition-colors duration-200 text-center block"
                                    >
                                        Got it!
                                    </motion.button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closeNotification}
                                    className="tq-text-muted hover:tq-text-muted"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
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