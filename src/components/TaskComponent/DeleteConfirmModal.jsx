import React from 'react'
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

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
                className="tq-glass shadow-2xl p-6 rounded-2xl  max-w-md w-full mx-4"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 tq-danger-bg rounded-full flex items-center justify-center">
                        <AlertTriangle className="text-white" size={24} />
                    </div>
                    <h2 className="text-xl font-semibold tq-text-primary">
                        Delete {type === 'folder' ? 'List' : 'Task'}
                    </h2>
                </div>

                <p className="tq-text-secondary mb-6">
                    {type === 'folder'
                        ? 'Are you sure you want to delete this list? All tasks in this list will be moved to archive.'
                        : 'Are you sure you want to delete this task?'}
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 tq-text-secondary hover:tq-text-primary transition-colors cursor-pointer"
                        title="Cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 tq-danger-bg text-white rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                        title="Confirm Delete"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


export default DeleteConfirmModal