import React, { useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Paperclip, CalendarDays, ArchiveRestore } from 'lucide-react';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/storage';


import {
    setFolders,
    setTasks,
    addFolder,
    updateFolder,
    deleteFolder,
    addTask,
    updateTask,
    deleteTask,
} from '../../utils/redux/taskSlice';

import PopupModal from './PopupModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import SimpleTaskModal from './SimpleTaskModal';
import TaskItem from './TaskItem';

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
        reminderDateTime: '',
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
                    ? task.reminderDateTime && isToday(new Date(task.reminderDateTime)) && !task.completed
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
                    ? task.reminderDateTime && isToday(new Date(task.reminderDateTime)) && !task.completed
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
                reminderDateTime: task.reminderDateTime,
                folder: selectedFolder,
                dateAdded: Date.now(),
                completed: false,
                originalFolder: selectedFolder,
                reminderSent: false
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
            ? task.reminderDateTime && isToday(new Date(task.reminderDateTime)) && !task.completed
            : selectedFolder === 'archive'
                ? task.completed
                : task.folder === selectedFolder && !task.completed;

        return matchesFolder;
    }).sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.reminderDateTime && b.reminderDateTime) return new Date(a.reminderDateTime) - new Date(b.reminderDateTime);
        return b.dateAdded - a.dateAdded;
    });



    return (
        <div className="h-full flex">
            {/* Folders Sidebar */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{overflowY: 'auto', height: "72vh"}}
                className="w-64 border-r tq-border-1 p-4 custom-scrollbar"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mb-4 px-4 py-2 tq-surface-2 hover:tq-surface-3 rounded-lg tq-text-primary flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowFolderPopup(true)}
                    title="Create New List"
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
                                className={`w-full px-4 py-2 rounded-lg flex items-center justify-between group ${selectedFolder === folder.id ? 'tq-surface-3 tq-text-primary' : 'tq-text-secondary hover:tq-text-primary'
                                    }`}
                            >
                                <div
                                    className="flex-1 flex items-center gap-2 cursor-pointer"
                                    onClick={() => setSelectedFolder(folder.id)}
                                    title={`Switch to ${folder.title}`}
                                >
                                    {/* <Folder  /> */}
                                    {folder.id === 'today' ? <CalendarDays size={16} /> : folder.id === 'archive' ? <ArchiveRestore size={16} /> : <Paperclip size={16} />}
                                    {/* <Paperclip size={16}/> */}
                                    <span>{folder.title.length > 11 ? `${folder.title.slice(0, 11)}..` : folder.title}</span>
                                    <span className="text-sm tq-text-muted">
                                        ({folder.count})
                                    </span>
                                </div>
                                {!folder.isDefault && (
                                     <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                                        <button
                                            className="tq-text-muted hover:tq-text-primary cursor-pointer"
                                            onClick={() => setEditingFolder(folder)}
                                            title="Edit List"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="tq-text-muted hover:tq-danger cursor-pointer"
                                            onClick={() => setShowDeleteConfirm({ type: 'folder', id: folder.id })}
                                            title="Delete List"
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
                style={{overflowY: 'auto', height: "72vh"}}
                className="flex-1 p-4 custom-scrollbar"
            >
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold tq-text-primary">{headerTitle}</h1>
                    {selectedFolder && !['archive'].includes(selectedFolder) && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 tq-surface-2 hover:tq-surface-3 rounded-lg tq-text-primary flex items-center gap-2 cursor-pointer"
                            onClick={() => setShowTaskPopup(true)}
                            title="Add New Task"
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
                            className="px-3 py-2 tq-danger-bg rounded-lg text-white hover:opacity-80 flex items-center gap-2 cursor-pointer"
                            title="Permanently clear all archived tasks"
                        >
                            <Trash2 size={16} />
                            <span>Clear Archive</span>
                        </motion.button>
                    )}
                </div>



                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {filteredTasks.length === 0 && (<p>No tasks found...</p>)}
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
                            ? values => handleEditTask(editingTask.id, { ...values, reminderSent: false })
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

export default TaskComponent;