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
import PopupModal from './PopupModal';
import ViewNotesModal from './ViewNotesModal';
import Dropdown from './Dropdown';

const MIN_TAGS = 1;
const MAX_PREVIEW_LENGTH = 33;

const NotesComponent = () => {
    const dispatch = useDispatch();
    const notes = useSelector(state => state.notes.items);

    const filter = useSelector(state => state.notes.filter);
    const options = [
        { value: "all", label: "All Notes" },
        { value: "favorites", label: "Favorites" },
    ];

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
                    <pre className="whitespace-pre-wrap overflow-x-auto break-words">
                        {searchQuery ? (
                            <Highlight text={note.content} searchQuery={searchQuery} />
                        ) : (
                            note.content.length > MAX_PREVIEW_LENGTH
                                ? note.content.substring(0, MAX_PREVIEW_LENGTH) + '.........'
                                : note.content
                        )}
                    </pre>
                </div>
            );
        }

        return (
            <p className="text-white/60 break-words">
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
        if (!selectedNote) return;
        dispatch(deleteNote(selectedNote.id));
        handleCloseModals();
    };

    const handleEditClick = (note) => {
        dispatch(setSelectedNote(note));
        setIsEditing(true);
    };


    const filteredNotes = notes
        .filter(note => {
            const matchesFilter = filter === 'all' || (filter === 'favorites' && note.starred);
            const matchesSearch = note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp in descending order

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



    const handleAddNote = (formData) => {
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

        if (tags.length < MIN_TAGS) {
            setValidationMessage(`Please add at least ${MIN_TAGS} tags`);
            setShowValidationModal(true);
            return;
        }

        const newNote = {
            id: Date.now().toString(),
            heading: formData.heading,
            content: formData.content,
            tags,
            timestamp: new Date().toISOString(),
            starred: false,
            type: formData.type,
        };

        dispatch(addNote(newNote));
        handleCloseModals();
    };

    const handleEditNote = (formData) => {
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

        if (tags.length < MIN_TAGS) {
            setValidationMessage(`Please add at least ${MIN_TAGS} tags`);
            setShowValidationModal(true);
            return;
        }

        if (!selectedNote) return;

        const updatedNote = {
            ...selectedNote,
            heading: formData.heading,
            content: formData.content,
            tags,
            type: formData.type,
        };

        dispatch(updateNote(updatedNote));
        handleCloseModals();
    };

    const handleCloseModals = () => {
        setShowAddModal(false);
        setIsEditing(false);
        dispatch(setSelectedNote(null));
        setShowDeleteModal(false);
        setShowValidationModal(false);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Fixed header */}
            <div style={{ backgroundColor: 'rgb(14 26 28)' }} className="sticky top-0 z-30 rounded-lg p-4">

                <div className="flex items-center gap-4">
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
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                        />
                    </div>

                    <div className="">
                        <Dropdown
                            value={filter}
                            onChange={(e) => dispatch(setFilter(e.target.value))}
                            options={options}
                        />
                    </div>

                    {/* <select
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
                    </select> */}
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
                    <AnimatePresence mode="popLayout">

                        {filteredNotes.length === 0 ? (
                            <motion.div
                                key="no-notes"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <p>No notes found...</p>
                            </motion.div>
                        ) : (
                            filteredNotes.map(note => (
                                <motion.div
                                    key={`note-${note.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="group bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer"
                                    onClick={() => dispatch(setSelectedNote(note))}
                                >
                                    {/* Note content */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {note.type === 'snippet' ? (
                                                <Code size={16} className="text-white/40" />
                                            ) : (
                                                <StickyNote size={16} className="text-white/40" />
                                            )}
                                            <h3 className="font-medium">
                                                <Highlight
                                                    text={note.heading.length > 20 ? note.heading.substring(0, 18) + '...' : note.heading}
                                                    searchQuery={searchQuery}
                                                />
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
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <PopupModal
                        key="add-modal"
                        isOpen={true}
                        title="Add Note"
                        onClose={handleCloseModals}
                        onSubmit={handleAddNote}
                        minTags={MIN_TAGS}
                    />
                )}

                {isEditing && selectedNote && (
                    <PopupModal
                        key="edit-modal"
                        isOpen={true}
                        title="Edit Note"
                        onClose={handleCloseModals}
                        onSubmit={handleEditNote}
                        initialValues={{
                            heading: selectedNote.heading,
                            content: selectedNote.content,
                            tags: selectedNote.tags.join(', '),
                            type: selectedNote.type
                        }}
                        isEditing={true}
                        minTags={MIN_TAGS}
                    />
                )}

                {selectedNote && !isEditing && (
                    <ViewNotesModal
                        key="view-modal"
                        note={selectedNote}
                        isOpen={true}
                        onClose={handleCloseModals}
                        onEdit={() => handleEditClick(selectedNote)}
                        onDelete={() => setShowDeleteModal(true)}
                        formatDate={formatDate}
                    />
                )}

                {showDeleteModal && (
                    <DeleteConfirmModal
                        key="delete-modal"
                        type="note"
                        onConfirm={handleDelete}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                )}

                {showValidationModal && (
                    <ValidationModal
                        key="validation-modal"
                        message={validationMessage}
                        onClose={() => setShowValidationModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotesComponent;