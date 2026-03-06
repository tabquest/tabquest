import React from 'react'
import { motion } from 'framer-motion';


const DeleteConfirmModal = ({ type, onConfirm, onCancel }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
                <h3 className="text-lg font-medium text-white mb-2">
                    Delete {type}?
                </h3>
                <p className="text-white/70 mb-6">
                    Are you sure you want to delete this {type}? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-white/70 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DeleteConfirmModal
