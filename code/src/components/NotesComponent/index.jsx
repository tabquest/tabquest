import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Star, Edit2, Trash2, X, Code, StickyNote, Copy, Check } from 'lucide-react';
import {
    addNote,
    updateNote,
    deleteNote,
    toggleStarred,
    setSelectedNote,
    setFilter
} from '../../utils/redux/notesSlice';
import ValidationModal from './ValidationModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const MIN_TAGS = 1;
const MAX_PREVIEW_LENGTH = 33;

const NotesComponent = () => {
    const dispatch = useDispatch();
    const notes = useSelector(state => state.notes.items);
    const filter = useSelector(state => state.notes.filter);
    const selectedNote = useSelector(state => state.notes.selectedNote);

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        heading: '',
        content: '',
        tags: '',
        type: 'note',
    });

    const Highlight = ({ text, searchQuery }) => {
        if (!searchQuery.trim()) return text;
        const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
        return (
            <>
                {parts.map((part, index) =>
                    part.toLowerCase() === searchQuery.toLowerCase() ? (
                        <span key={index} className="bg-yellow-500/30 rounded px-0.5">{part}</span>
                    ) : part
                )}
            </>
        );
    };

    const handleCopyCode = async (content) => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderContent = (note) => {
        if (note.type === 'snippet') {
            return (
                <div className="relative bg-black/50 rounded-md p-3 font-mono text-sm">
                    <div className="absolute top-2 right-2">
                        <Code size={14} className="text-white/40" />
                    </div>
                    {searchQuery ? (
                        <Highlight text={note.content} searchQuery={searchQuery} />
                    ) : (
                        note.content.length > MAX_PREVIEW_LENGTH
                            ? note.content.substring(0, MAX_PREVIEW_LENGTH) + '.........'
                            : note.content
                    )}
                </div>
            );
        }

        return (
            <p className="text-white/60">
                {searchQuery ? (
                    <Highlight text={note.content} searchQuery={searchQuery} />
                ) : (
                    note.content.length > MAX_PREVIEW_LENGTH
                        ? note.content.substring(0, MAX_PREVIEW_LENGTH) + '.........'
                        : note.content
                )}
            </p>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

        if (tags.length < MIN_TAGS) {
            setValidationMessage(`Please add at least ${MIN_TAGS} tags`);
            setShowValidationModal(true);
            return;
        }

        const newNote = {
            id: isEditing ? selectedNote.id : Date.now().toString(),
            heading: formData.heading,
            content: formData.content,
            tags,
            timestamp: isEditing ? selectedNote.timestamp : new Date().toISOString(),
            starred: isEditing ? selectedNote.starred : false,
            type: formData.type,
        };

        if (isEditing) {
            dispatch(updateNote(newNote));
        } else {
            dispatch(addNote(newNote));
        }

        setFormData({ heading: '', content: '', tags: '', type: 'note' });
        setShowAddModal(false);
        setIsEditing(false);
        dispatch(setSelectedNote(null));
    };

    const handleDelete = () => {
        dispatch(deleteNote(selectedNote.id));
        dispatch(setSelectedNote(null));
        setShowDeleteModal(false);
    };

    const filteredNotes = notes.filter(note => {
        const matchesFilter = filter === 'all' || (filter === 'favorites' && note.starred);
        const matchesSearch = note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // handle modal closure
    const handleCloseModal = () => {
        setFormData({ heading: '', content: '', tags: '', type: 'note' });
        setIsEditing(false);
        setCopied(false);
        setShowAddModal(false);
        dispatch(setSelectedNote(null));
    };

    return (
        <div className="h-full p-2 text-white/90">
            <div className="flex items-center gap-4 mb-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 text-white/90"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={18} />
                    <span>Add Note</span>
                </motion.button>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80"
                    />
                </div>

                <select
                    value={filter}
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                    className="bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 text-white/90 px-4 py-2"
                    style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.7rem center',
                        backgroundSize: '1rem',
                        paddingRight: '2.5rem'
                    }}
                >
                    <option value="all" className="bg-[#1a1a1a] text-white/80">All Notes</option>
                    <option value="favorites" className="bg-[#1a1a1a] text-white/80">Favorites</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
                <AnimatePresence mode="popLayout">
                    {filteredNotes.length === 0 && (<p>No notes found...</p>)}
                    {filteredNotes.map(note => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            className="group bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer"
                            onClick={() => dispatch(setSelectedNote(note))}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {note.type === 'snippet' ? (
                                        <Code size={16} className="text-white/40" />
                                    ) : (
                                        <StickyNote size={16} className="text-white/40" />
                                    )}
                                    <h3 className="font-medium">
                                        <Highlight text={note.heading} searchQuery={searchQuery} />
                                    </h3>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(toggleStarred(note.id));
                                    }}
                                    className={`${note.starred ? 'text-yellow-400' : 'text-white/30'}`}
                                >
                                    <Star
                                        size={16}
                                        fill={note.starred ? "currentColor" : "none"}
                                    />
                                </motion.button>
                            </div>

                            <div className="mb-3">
                                {renderContent(note)}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-2">
                                {note.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2 py-0.5 bg-white/10 rounded"
                                    >
                                        <Highlight text={tag} searchQuery={searchQuery} />
                                    </span>
                                ))}
                            </div>

                            <p className="text-xs text-white/40">{formatDate(note.timestamp)}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {(showAddModal || selectedNote) && (
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
                            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl max-h-[50vh] flex flex-col relative"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-medium text-gray-100">
                                    {isEditing ? 'Edit Note' : selectedNote ? 'View Note' : 'Add Note'}
                                </h2>
                                <div className="flex gap-2">
                                    {selectedNote && !isEditing && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setFormData({
                                                        heading: selectedNote.heading,
                                                        content: selectedNote.content,
                                                        tags: selectedNote.tags.join(', '),
                                                        type: selectedNote.type,
                                                    });
                                                }}
                                                className="p-2 hover:bg-gray-800 rounded-lg"
                                            >
                                                <Edit2 size={20} />
                                            </motion.button>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setShowDeleteModal(true)}
                                                className="p-2 hover:bg-gray-800 rounded-lg text-red-400"
                                            >
                                                <Trash2 size={20} />
                                            </motion.button>
                                        </>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            handleCloseModal();
                                        }}
                                        className="p-2 hover:bg-gray-800 rounded-lg"
                                    >
                                        <X size={20} />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-1 pr-2 -mr-2 custom-scrollbar">
                                {(showAddModal || isEditing) ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="flex gap-4 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: 'note' })}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 
                      ${formData.type === 'note' ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                            >
                                                <StickyNote size={18} />
                                                Note
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: 'snippet' })}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 
                      ${formData.type === 'snippet' ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                            >
                                                <Code size={18} />
                                                Code Snippet
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={formData.heading}
                                            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                                            required
                                        />

                                        <textarea
                                            placeholder={formData.type === 'snippet' ? "Paste your code here..." : "Note Content"}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className={`w-full h-40 px-4 py-2 border border-gray-700 rounded-lg resize-none custom-scrollbar
                    ${formData.type === 'snippet' ? 'bg-gray-900 font-mono' : 'bg-gray-800'} text-gray-100`}
                                            required
                                        />

                                        <div>
                                            <input
                                                type="text"
                                                placeholder={`Tags (minimum ${MIN_TAGS}, comma-separated)`}
                                                value={formData.tags}
                                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
                                                required
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Example: work, important, meeting</p>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-100"
                                            >
                                                {isEditing ? 'Save Changes' : 'Add Note'}
                                            </motion.button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            {selectedNote.type === 'snippet' ? (
                                                <Code size={18} className="text-gray-400" />
                                            ) : (
                                                <StickyNote size={18} className="text-gray-400" />
                                            )}
                                            <h3 className="text-lg font-medium text-gray-100">{selectedNote.heading}</h3>
                                        </div>

                                        {selectedNote.type === 'snippet' ? (
                                            <div className="relative bg-gray-950 p-4 rounded-lg font-mono text-sm">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleCopyCode(selectedNote.content)}
                                                    className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-100 flex items-center gap-2"
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
                                                    {selectedNote.content}
                                                </pre>
                                            </div>
                                        ) : (
                                            <p className="text-gray-300 whitespace-pre-wrap">{selectedNote.content}</p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {selectedNote.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            Created: {formatDate(selectedNote.timestamp)}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <style>
                                {`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`}
                            </style>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteConfirmModal
                        type="note"
                        onConfirm={handleDelete}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showValidationModal && (
                    <ValidationModal
                        message={validationMessage}
                        onClose={() => setShowValidationModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotesComponent;