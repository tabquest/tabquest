import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, Edit2, Trash2, Clock, Calendar, AlertTriangle, X } from 'lucide-react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

import {
    setFolders,
    setTasks,
    addFolder,
    updateFolder,
    deleteFolder,
    addTask,
    updateTask,
    deleteTask,
} from '../utils/redux/taskSlice';

const DEFAULT_FOLDERS = [
    {
        id: 'today',
        title: 'Today',
        isDefault: true,
        count: 0
    },
    {
        id: 'archive',
        title: 'Archive',
        isDefault: true,
        count: 0
    }
];

const TaskComponent = () => {
    const dispatch = useDispatch();
    const { folders, tasks } = useSelector(state => state.tasks);
    const [selectedFolder, setSelectedFolder] = useState('today');
    const [showFolderPopup, setShowFolderPopup] = useState(false);
    const [showTaskPopup, setShowTaskPopup] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // Get current folder name for header
    const currentFolder = folders.find(f => f.id === selectedFolder);
    const headerTitle = currentFolder ? currentFolder.title : 'Tasks';

    const [newTask, setNewTask] = useState({
        title: '',
        dueDate: '',
        startTime: '',
        endTime: '',
        folder: ''
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Load initial data
    useEffect(() => {
        const { folders: savedFolders, tasks: savedTasks } = loadFromLocalStorage();
        const foldersWithDefaults = [...DEFAULT_FOLDERS, ...savedFolders.filter(f =>
            !DEFAULT_FOLDERS.some(df => df.id === f.id)
        )];

        // Update folder counts
        const updatedFolders = foldersWithDefaults.map(folder => ({
            ...folder,
            count: savedTasks.filter(task =>
                folder.id === 'today'
                    ? isToday(new Date(task.dueDate)) && !task.completed
                    : folder.id === 'archive'
                        ? task.completed
                        : task.folder === folder.id && !task.completed
            ).length
        }));

        dispatch(setFolders(updatedFolders));
        dispatch(setTasks(savedTasks));
    }, [dispatch]);

    // Save data on changes
    useEffect(() => {
        const nonDefaultFolders = folders.filter(f => !f.isDefault);
        saveToLocalStorage(nonDefaultFolders, tasks);
    }, [folders, tasks]);

    const isToday = (date) => {
        const today = new Date();
        return date &&
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const handleAddFolder = (values) => {
        if (values.title && values.title.trim()) {
            dispatch(addFolder({
                id: Date.now().toString(),
                title: values.title.trim(),
                count: 0,
                isDefault: false
            }));
            setShowFolderPopup(false);
        }
    };

    //  helper function
    const calculateFolderCounts = (folders, tasks) => {
        return folders.map(folder => ({
            ...folder,
            count: tasks.filter(task =>
                folder.id === 'today'
                    ? isToday(new Date(task.dueDate)) && !task.completed
                    : folder.id === 'archive'
                        ? task.completed
                        : task.folder === folder.id && !task.completed
            ).length
        }));
    };

    const handleAddTask = (task) => {
        if (task.title.trim()) {
            const newTask = {
                id: Date.now().toString(),
                title: task.title.trim(),
                dueDate: selectedFolder === 'today' ? new Date().toISOString().split('T')[0] : task.dueDate,
                startTime: task.startTime,
                endTime: task.endTime,
                folder: selectedFolder,
                dateAdded: Date.now(),
                completed: false,
                originalFolder: selectedFolder
            };
            dispatch(addTask(newTask));

            const updatedFolders = calculateFolderCounts(folders, [...tasks, newTask]);
            dispatch(setFolders(updatedFolders));

            setShowTaskPopup(false);
        }
    };

    const handleCompleteTask = (task) => {
        const updates = {
            completed: !task.completed,
            completedDate: !task.completed ? Date.now() : null,
        };

        if (!task.completed) {
            updates.previousFolder = task.folder;
            updates.folder = 'archive';
        } else {
            updates.folder = task.previousFolder || task.originalFolder;
            updates.previousFolder = null;
        }

        dispatch(updateTask({
            id: task.id,
            updates
        }));

        // Update folder counts after completing task
        const updatedTasks = tasks.map(t =>
            t.id === task.id ? { ...t, ...updates } : t
        );
        const updatedFolders = calculateFolderCounts(folders, updatedTasks);
        dispatch(setFolders(updatedFolders));
    };

    const handleEditTask = (taskId, updates) => {
        dispatch(updateTask({
            id: taskId,
            updates: {
                ...updates,
                lastModified: Date.now()
            }
        }));

        // Update folder counts if the task's folder changed
        const updatedTasks = tasks.map(t =>
            t.id === taskId ? { ...t, ...updates } : t
        );
        const updatedFolders = calculateFolderCounts(folders, updatedTasks);
        dispatch(setFolders(updatedFolders));

        setEditingTask(null);
    };

    const handleEditFolder = (folderId, updates) => {
        dispatch(updateFolder({
            id: folderId,
            ...updates
        }));
        setEditingFolder(null);
    };


    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId));

        // Update folder counts after deleting task
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        const updatedFolders = calculateFolderCounts(folders, updatedTasks);
        dispatch(setFolders(updatedFolders));
    };

    const handleDeleteConfirm = () => {
        if (showDeleteConfirm) {
            const { type, id } = showDeleteConfirm;
            if (type === 'folder') {
                const folderTasks = tasks.filter(t => t.folder === id);

                // First update tasks
                folderTasks.forEach(task => {
                    dispatch(updateTask({
                        id: task.id,
                        updates: {
                            folder: 'archive',
                            previousFolder: task.folder
                        }
                    }));
                });

                // Then delete folder
                dispatch(deleteFolder(id));

                // Update counts
                const updatedTasks = tasks.map(t =>
                    t.folder === id ? { ...t, folder: 'archive', previousFolder: id } : t
                );
                const updatedFolders = calculateFolderCounts(
                    folders.filter(f => f.id !== id),
                    updatedTasks
                );
                dispatch(setFolders(updatedFolders));
            } else if (type === 'task') {
                handleDeleteTask(id);
            }
            setShowDeleteConfirm(null);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFolder = selectedFolder === 'today'
            ? isToday(new Date(task.dueDate)) && !task.completed
            : selectedFolder === 'archive'
                ? task.completed
                : task.folder === selectedFolder && !task.completed;

        return matchesFolder;
    }).sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
        return b.dateAdded - a.dateAdded;
    });



    return (
        <div className="h-full flex">
            {/* Folders Sidebar */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 border-r border-white/10 p-4"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mb-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 flex items-center gap-2"
                    onClick={() => setShowFolderPopup(true)}
                >
                    <Plus size={16} />
                    <span>New List</span>
                </motion.button>

                <div className="space-y-1">
                    {folders
                        .slice()
                        .sort((a, b) => (a.id === 'archive' ? 1 : b.id === 'archive' ? -1 : 0))
                        .map((folder) => (
                            <motion.div
                                key={folder.id}
                                whileHover={{ x: 2 }}
                                className={`w-full px-4 py-2 rounded-lg flex items-center justify-between group ${selectedFolder === folder.id ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
                                    }`}
                            >
                                <div
                                    className="flex-1 flex items-center gap-2 cursor-pointer"
                                    onClick={() => setSelectedFolder(folder.id)}
                                >
                                    <Folder size={16} />
                                    <span>{folder.title}</span>
                                    <span className="text-sm text-white/50">
                                        ({folder.count})
                                    </span>
                                </div>
                                {!folder.isDefault && (
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                                        <button
                                            className="text-white/50 hover:text-white/90"
                                            onClick={() => setEditingFolder(folder)}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="text-white/50 hover:text-red-400"
                                            onClick={() => setShowDeleteConfirm({ type: 'folder', id: folder.id })}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                </div>
            </motion.div>


            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 p-4"
            >
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-white">{headerTitle}</h1>
                    {selectedFolder && !['archive'].includes(selectedFolder) && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 flex items-center gap-2"
                            onClick={() => setShowTaskPopup(true)}
                        >
                            <Plus size={16} />
                            <span>New Task</span>
                        </motion.button>
                    )}

                    {selectedFolder === 'archive' && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                const nonArchivedTasks = tasks.filter(t => !t.completed);
                                dispatch(setTasks(nonArchivedTasks));
                                const updatedFolders = calculateFolderCounts(folders, nonArchivedTasks);
                                dispatch(setFolders(updatedFolders));
                            }}
                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            <span>Clear Archive</span>
                        </motion.button>
                    )}
                </div>



                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {filteredTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onComplete={handleCompleteTask}
                                onEdit={() => setEditingTask(task)}
                                onDelete={() => setShowDeleteConfirm({ type: 'task', id: task.id })}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <DeleteConfirmModal
                        type={showDeleteConfirm.type}
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setShowDeleteConfirm(null)}
                    />
                )}

                {(showFolderPopup || editingFolder) && (
                    <PopupModal
                        title={editingFolder ? "Edit List" : "Create New List"}
                        onClose={() => {
                            setShowFolderPopup(false);
                            setEditingFolder(null);
                        }}
                        onSubmit={editingFolder
                            ? values => handleEditFolder(editingFolder.id, values)
                            : handleAddFolder
                        }
                        fields={[
                            {
                                name: 'title',
                                label: 'List Name',
                                type: 'text',
                                required: true,
                                validate: value => !value.trim() ? 'List name is required' : null
                            }
                        ]}
                        initialValues={editingFolder || {}}
                    />
                )}

                {(showTaskPopup || editingTask) && (
                    <SimpleTaskModal
                        onClose={() => {
                            setShowTaskPopup(false);
                            setEditingTask(null);
                        }}
                        onSubmit={editingTask
                            ? values => handleEditTask(editingTask.id, values)
                            : handleAddTask
                        }
                        initialValues={editingTask || {}}
                        isEditing={!!editingTask}
                        selectedFolder={selectedFolder}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Popup Modal component
const PopupModal = ({
    title,
    onClose,
    onSubmit,
    fields,
    initialValues = {}
}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        fields.forEach(field => {
            if (field.required && !values[field.name]) {
                newErrors[field.name] = 'This field is required';
            }
            if (field.validate) {
                const error = field.validate(values[field.name] || '');
                if (error) {
                    newErrors[field.name] = error;
                }
            }
        });

        if (Object.keys(newErrors).length === 0) {
            onSubmit(values);
        } else {
            setErrors(newErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-white/50 hover:text-white/90 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-white/70 text-sm mb-2">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={values[field.name] || ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 transition-all duration-200 focus:border-white/20 focus:ring-1 focus:ring-white/20"
                            />
                            {errors[field.name] && (
                                <p className="text-red-400 text-sm mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// TaskItem component
const TaskItem = ({ task, onComplete, onEdit, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        layout
        className="group p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors duration-200"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onComplete(task)}
                    className="w-4 h-4 rounded border-white/30 text-blue-500 focus:ring-blue-500"
                />
                <div>
                    <h3 className={`text-white/90 font-medium ${task.completed ? 'line-through text-white/50' : ''}`}>
                        {task.title}
                    </h3>
                    <div className="flex gap-4 mt-1">
                        {task.dueDate && (
                            <span className="text-xs flex items-center gap-1 text-white/60">
                                <Calendar size={12} />
                                {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        )}
                        {(task.startTime || task.endTime) && (
                            <span className="text-xs flex items-center gap-1 text-white/60">
                                <Clock size={12} />
                                {task.startTime && task.endTime ?
                                    `${task.startTime} - ${task.endTime}` :
                                    task.startTime || task.endTime}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-2">
                    <button
                        className="p-1 text-white/50 hover:text-white/90"
                        onClick={onEdit}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="p-1 text-white/50 hover:text-red-400"
                        onClick={onDelete}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

// Delete Confirmation Modal
const DeleteConfirmModal = ({ type, onConfirm, onCancel }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                        Delete {type === 'folder' ? 'List' : 'Task'}
                    </h2>
                </div>

                <p className="text-white/70 mb-6">
                    {type === 'folder'
                        ? 'Are you sure you want to delete this list? All tasks in this list will be moved to archive.'
                        : 'Are you sure you want to delete this task?'}
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// Simple Task Modal
const SimpleTaskModal = ({
    onClose,
    onSubmit,
    initialValues = {},
    isEditing = false,
    selectedFolder
}) => {
    const [values, setValues] = useState({
        title: initialValues.title || '',
        dueDate: initialValues.dueDate || (selectedFolder === 'today' ? new Date().toISOString().split('T')[0] : ''),
        startTime: initialValues.startTime || '',
        endTime: initialValues.endTime || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.title.trim()) return;
        onSubmit(values);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">
                        {isEditing ? 'Edit Task' : 'New Task'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            Task Title
                        </label>
                        <input
                            type="text"
                            value={values.title}
                            onChange={(e) => setValues(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="What needs to be done?"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:ring-2 focus:ring-white/20 focus:outline-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={values.dueDate}
                            onChange={(e) => setValues(prev => ({ ...prev, dueDate: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:ring-2 focus:ring-white/20 focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={values.startTime}
                                onChange={(e) => setValues(prev => ({ ...prev, startTime: e.target.value }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:ring-2 focus:ring-white/20 focus:outline-none"
                            />
                        </div>
                        <span className="text-white/70">to</span>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={values.endTime}
                                onChange={(e) => setValues(prev => ({ ...prev, endTime: e.target.value }))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:ring-2 focus:ring-white/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white/70 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                        >
                            {isEditing ? 'Save Changes' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};



export default TaskComponent;