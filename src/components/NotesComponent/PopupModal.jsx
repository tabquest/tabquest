import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X, StickyNote, Code, Key, Hash, FileText, FileType } from "lucide-react";

const getIconForField = (fieldName, type) => {
    switch (fieldName) {
        case 'heading':
            return <FileText className="w-5 h-5" />;
        case 'content':
            return type === 'snippet' ? <Code className="w-5 h-5" /> :
                type === 'markdown' ? <FileType className="w-5 h-5" /> : <StickyNote className="w-5 h-5" />;
        case 'tags':
            return <Hash className="w-5 h-5" />;
        default:
            return <Key className="w-5 h-5" />;
    }
};

const PopupModal = ({
    isOpen,
    title,
    onClose,
    onSubmit,
    initialValues = {
        heading: '',
        content: '',
        tags: '',
        type: 'note'
    },
    isEditing = false,
    minTags = 1
}) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

        if (tags.length < minTags) {
            setErrors({ tags: `Please add at least ${minTags} tags` });
            return;
        }

        onSubmit(formData);
        setFormData({ heading: '', content: '', tags: '', type: 'note' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                        className="tq-glass shadow-2xl border tq-border-1 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b tq-border-1">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium tq-text-primary">{title}</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 hover:tq-surface-3 rounded-lg"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Type Selection */}
                                <div className="mb-4">
                                    <div className="flex gap-3 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'note' })}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 
                          ${formData.type === 'note' ? 'bg-white/20 tq-text-primary' : 'tq-surface-3 tq-text-muted hover:bg-white/15'}`}
                                        >
                                            <StickyNote size={16} />
                                            Note
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'snippet' })}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 
                          ${formData.type === 'snippet' ? 'bg-white/20 tq-text-primary' : 'tq-surface-3 tq-text-muted hover:bg-white/15'}`}
                                        >
                                            <Code size={16} />
                                            Code Snippet
                                        </button>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: 'markdown' })}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 
                              ${formData.type === 'markdown' ? 'bg-white/20 tq-text-primary' : 'tq-surface-3 tq-text-muted hover:bg-white/15'}`}
                                            >
                                                <FileType size={16} />
                                                Markdown
                                            </button>
                                            <span className="absolute -top-1 -right-1 tq-success-bg tq-text-primary text-xs px-1.5 py-0.5 rounded-full font-medium">
                                                NEW
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-orange-400 bg-orange-400/10 p-2 rounded border border-orange-400/20">
                                        ⚠️ Code Snippets will be deprecated soon. Please switch to Markdown for code blocks.
                                    </p>
                                </div>

                                {/* Title Input */}
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 tq-text-muted">
                                        {getIconForField('heading')}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter title..."
                                        value={formData.heading}
                                        onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 tq-surface-2 border tq-border-1 rounded-lg tq-text-primary focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Content Input */}
                                <div className="relative">
                                    <div className="absolute left-3 top-3 tq-text-muted">
                                        {getIconForField('content', formData.type)}
                                    </div>
                                    <textarea
                                        placeholder={formData.type === 'snippet' ? "Paste your code here..." :
                                            formData.type === 'markdown' ? "Write your markdown here..." : "Enter note content..."}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-2 h-64 border tq-border-1 rounded-lg resize-y custom-scrollbar 
                      ${formData.type === 'snippet' ? 'bg-black/20 font-mono' : 'bg-black/20'} tq-text-primary focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent`}
                                        required
                                    />
                                </div>

                                {/* Tags Input */}
                                <div className="relative">
                                    {/* <div className="absolute left-3 top-1/2 -translate-y-1/2 tq-text-muted">
                                        {getIconForField('tags')}
                                    </div> */}
                                    <div className="absolute left-3 top-3 tq-text-muted">
                                        {getIconForField('tags')}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter tags (comma-separated)..."
                                        value={formData.tags}
                                        onChange={(e) => {
                                            setFormData({ ...formData, tags: e.target.value });
                                            setErrors({ ...errors, tags: undefined });
                                        }}
                                        className="w-full pl-10 pr-4 py-2 tq-surface-2 border tq-border-1 rounded-lg tq-text-primary focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                        required
                                    />
                                    {errors.tags && (
                                        <p className="mt-1 text-sm tq-danger">{errors.tags}</p>
                                    )}
                                    <p className="mt-1 text-xs tq-text-muted">Example: work, important, meeting</p>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t tq-border-1">
                            <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="px-6 py-2 tq-surface-3 hover:tq-hover-bg rounded-lg tq-text-primary"
                                >
                                    {isEditing ? 'Save Changes' : 'Add Note'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopupModal;