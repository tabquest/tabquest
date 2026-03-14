import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { X, AlignLeft, Bell } from 'lucide-react';
import './custom.css'

const SimpleTaskModal = ({
    onClose,
    onSubmit,
    initialValues = {},
    isEditing = false,
    selectedFolder
}) => {
    const [values, setValues] = useState({
        title: initialValues.title || '',
        reminderDateTime: initialValues.reminderDateTime || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.title.trim() || !values.reminderDateTime) return;
        onSubmit(values);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="tq-glass shadow-2xl rounded-2xl p-6 w-full max-w-md"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        {/* <Plus className="tq-text-secondary" size={20} /> */}
                        <h3 className="text-lg font-medium tq-text-primary">
                            {isEditing ? 'Edit Task' : 'New Task'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 tq-text-secondary hover:tq-text-primary transition-colors rounded-full hover:tq-surface-3"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium tq-text-secondary mb-2">
                            Task Title <span className="tq-danger">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 tq-text-muted">
                                <AlignLeft size={18} />
                            </div>
                            <input
                                type="text"
                                value={values.title}
                                onChange={(e) => setValues(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="What needs to be done?"
                                className="w-full pl-10 pr-3 py-2 tq-surface-2 border tq-border-1 rounded-lg tq-text-primary focus:ring-2 focus:ring-white/20 focus:outline-none placeholder:tq-text-muted"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium tq-text-secondary mb-2 flex items-center gap-2">
                            Reminder <span className="tq-danger">*</span>
                            <span className="px-2 py-0.5 tq-gradient-subtle tq-text-primary text-xs font-bold rounded-full animate-pulse">NEW</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 tq-text-muted">
                                <Bell size={18} />
                            </div>
                            <input
                                type="datetime-local"
                                value={values.reminderDateTime}
                                onChange={(e) => setValues((prev) => ({ ...prev, reminderDateTime: e.target.value }))}
                                className="w-full pl-10 pr-3 py-2 tq-surface-2 border tq-border-1 rounded-lg tq-text-primary focus:ring-2 focus:ring-white/20 focus:outline-none [color-scheme:dark]"
                                placeholder="Set reminder date and time"
                                required
                            />
                        </div>
                        <p className="text-xs tq-text-muted mt-1 flex items-center gap-1">
                            <span>💡</span> You'll get a notification with sound at the set time
                        </p>
                    </div>


                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t tq-border-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 tq-text-secondary hover:tq-text-primary hover:tq-surface-2 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 tq-surface-3 hover:tq-hover-bg rounded-lg tq-text-primary transition-colors"
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