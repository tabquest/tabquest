import React from 'react'
import { motion } from 'framer-motion';


const ValidationModal = ({ message, onClose }) => {
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
                <h3 className="text-lg font-medium text-white mb-4">
                    Validation Error
                </h3>
                <p className="text-white/70 mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                    >
                        OK
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


export default ValidationModal