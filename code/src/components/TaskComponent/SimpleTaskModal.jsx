import React, {useState} from 'react'
import { motion } from 'framer-motion';
import { X } from 'lucide-react';



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

export default SimpleTaskModal