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
                className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20 max-w-sm"
            >
                <div className="flex items-start gap-3">
                    <Bell className="text-white mt-0.5" size={20} />
                    <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                        <p className="text-white/80 text-xs mt-1">{notification.body}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UINotification;