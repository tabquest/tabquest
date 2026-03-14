import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptop, FaMobileAlt, FaExclamationTriangle } from 'react-icons/fa';

const MobileView = () => {
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 tq-text-primary p-6 z-50 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div
                className="tq-warning text-6xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
                <FaExclamationTriangle />
            </motion.div>

            <motion.div
                className="text-xl font-semibold text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Currently, we do not support mobile view
            </motion.div>

            <motion.div
                className="flex items-center gap-4 text-4xl mt-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
            >
                <motion.div
                    whileHover={{ scale: 1.2, color: "#ef4444" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <FaMobileAlt className="tq-text-muted" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    →
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.2, color: "#22c55e" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <FaLaptop className="tq-text-muted" />
                </motion.div>
            </motion.div>

            <motion.div
                className="text-sm tq-text-muted text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                Please use Tabquest on a laptop or desktop for the best experience
            </motion.div>
        </motion.div>
    );
};

export default MobileView;