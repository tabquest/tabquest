import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

const UINotification = ({ notification, onClose }) => {
    if (!notification) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50, x: 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -50, x: 50 }}
                className="fixed top-4 right-4 z-[2000] backdrop-blur-xl rounded-lg p-4 shadow-lg max-w-sm"
                style={{
                    background: 'var(--tq-glass-bg)',
                    border: '1px solid var(--tq-border-2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,.30)',
                }}
            >
                <div className="flex items-start gap-3">
                    <Bell
                        className="mt-0.5"
                        size={20}
                        style={{ color: 'var(--tq-accent)' }}
                    />
                    <div className="flex-1">
                        <h4
                            className="font-medium text-sm"
                            style={{ color: 'var(--tq-text-primary)' }}
                        >
                            {notification.title}
                        </h4>
                        <p
                            className="text-xs mt-1"
                            style={{ color: 'var(--tq-text-secondary)' }}
                        >
                            {notification.body}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="transition-colors cursor-pointer"
                        title="Close Notification"
                        style={{ color: 'var(--tq-text-muted)' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UINotification;