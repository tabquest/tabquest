import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Code, StickyNote, Copy, Check } from "lucide-react";

const ViewNotesModal = ({
    note,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    formatDate
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = async (content) => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!note || !isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-40"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#0b1518] border border-white/10 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-white/90">View Note</h2>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onEdit}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/80"
                            >
                                <Edit2 size={20} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onDelete}
                                className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                            >
                                <Trash2 size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/80"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="space-y-4">
                        {/* Title with Icon */}
                        <div className="flex items-center gap-2">
                            {note.type === 'snippet' ? (
                                <Code size={18} className="text-gray-400 flex-shrink-0" />
                            ) : (
                                <StickyNote size={18} className="text-gray-400 flex-shrink-0" />
                            )}
                            <h3 className="text-lg font-medium text-gray-100 break-words">
                                {note.heading}
                            </h3>
                        </div>

                        {/* Content */}
                        {note.type === 'snippet' ? (
                            <div className="relative bg-gray-950 p-4 rounded-lg font-mono text-sm">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleCopyCode(note.content)}
                                    className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-100 z-10"
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div
                                                key="copied"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-1"
                                            >
                                                <Check size={14} />
                                                <span className="text-xs">Copied</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <Copy size={14} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                                <pre className="whitespace-pre-wrap overflow-x-auto custom-scrollbar text-gray-100">
                                    {note.content}
                                </pre>
                            </div>
                        ) : (
                            <p className="text-gray-300 whitespace-pre-wrap break-words">
                                {note.content}
                            </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {note.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Timestamp */}
                        <p className="text-sm text-gray-500">
                            Created: {formatDate(note.timestamp)}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ViewNotesModal;