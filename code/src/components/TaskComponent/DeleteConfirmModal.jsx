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


export default DeleteConfirmModal