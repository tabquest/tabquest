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
                className="bg-[#0b1518] rounded-lg p-6 w-full max-w-md"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        {/* <Plus className="text-white/70" size={20} /> */}
                        <h3 className="text-lg font-medium text-white">
                            {isEditing ? 'Edit Task' : 'New Task'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Task Title <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                                <AlignLeft size={18} />
                            </div>
                            <input
                                type="text"
                                value={values.title}
                                onChange={(e) => setValues(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="What needs to be done?"
                                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:ring-2 focus:ring-white/20 focus:outline-none placeholder:text-white/30"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                            Reminder <span className="text-red-400">*</span>
                            <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">NEW</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                                <Bell size={18} />
                            </div>
                            <input
                                type="datetime-local"
                                value={values.reminderDateTime}
                                onChange={(e) => setValues((prev) => ({ ...prev, reminderDateTime: e.target.value }))}
                                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:ring-2 focus:ring-white/20 focus:outline-none [color-scheme:dark]"
                                placeholder="Set reminder date and time"
                                required
                            />
                        </div>
                        <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                            <span>💡</span> You'll get a notification with sound at the set time
                        </p>
                    </div>


                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
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