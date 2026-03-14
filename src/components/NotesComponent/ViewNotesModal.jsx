import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Code, StickyNote, Copy, Check, FileType } from "lucide-react";
import ReactMarkdown from 'react-markdown';

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
                className="tq-glass shadow-2xl border tq-border-1 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
                {/* Modal Header */}
                <div className="p-6 border-b tq-border-1">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium tq-text-primary">View Note</h2>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onEdit}
                                className="p-2 hover:tq-surface-3 rounded-lg tq-text-primary"
                            >
                                <Edit2 size={20} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onDelete}
                                className="p-2 hover:tq-surface-3 rounded-lg tq-danger"
                            >
                                <Trash2 size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 hover:tq-surface-3 rounded-lg tq-text-primary"
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
                                <Code size={18} className="tq-text-muted flex-shrink-0" />
                            ) : note.type === 'markdown' ? (
                                <FileType size={18} className="tq-text-muted flex-shrink-0" />
                            ) : (
                                <StickyNote size={18} className="tq-text-muted flex-shrink-0" />
                            )}
                            <h3 className="text-lg font-medium tq-text-muted break-words">
                                {note.heading}
                            </h3>
                        </div>

                        {/* Content */}
                        {note.type === 'snippet' ? (
                            <div className="relative tq-surface-1 p-4 rounded-lg font-mono text-sm">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleCopyCode(note.content)}
                                    className="absolute top-2 right-2 p-2 hover:tq-surface-1 rounded-lg tq-text-muted hover:tq-text-muted z-10"
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
                                <pre className="whitespace-pre-wrap overflow-x-auto custom-scrollbar tq-text-muted select-text">
                                    {note.content}
                                </pre>
                            </div>
                        ) : note.type === 'markdown' ? (
                            <div className="tq-glass shadow-2xl p-4 rounded-2xl prose prose-invert prose-sm max-w-none select-text">
                                <ReactMarkdown 
                                    components={{
                                        h1: ({children}) => <h1 className="tq-text-muted text-xl font-bold mb-2 select-text">{children}</h1>,
                                        h2: ({children}) => <h2 className="tq-text-muted text-lg font-semibold mb-2 select-text">{children}</h2>,
                                        h3: ({children}) => <h3 className="tq-text-muted text-base font-medium mb-1 select-text">{children}</h3>,
                                        p: ({children}) => <p className="tq-text-muted mb-2 select-text">{children}</p>,
                                        strong: ({children}) => <strong className="tq-text-muted font-semibold select-text">{children}</strong>,
                                        code: ({children}) => <code className="tq-text-muted tq-surface-1 px-1 rounded text-sm select-text">{children}</code>,
                                        pre: ({children}) => <pre className="tq-surface-1 tq-text-muted p-3 rounded overflow-x-auto select-text">{children}</pre>,
                                        blockquote: ({children}) => <blockquote className="tq-text-muted border-l-4 tq-border-1 pl-4 italic select-text">{children}</blockquote>,
                                        a: ({children, href}) => <a href={href} className="tq-accent hover:underline select-text">{children}</a>,
                                        ul: ({children}) => <ul className="tq-text-muted list-disc ml-4 mb-2 select-text">{children}</ul>,
                                        ol: ({children}) => <ol className="tq-text-muted list-decimal ml-4 mb-2 select-text">{children}</ol>,
                                        li: ({children}) => <li className="tq-text-muted mb-1 select-text">{children}</li>
                                    }}
                                >
                                    {note.content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="tq-text-muted whitespace-pre-wrap break-words select-text">
                                {note.content}
                            </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {note.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="text-xs px-2 py-1 tq-surface-1 tq-text-muted rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Timestamp */}
                        <p className="text-sm tq-text-muted">
                            Created: {formatDate(note.timestamp)}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ViewNotesModal;