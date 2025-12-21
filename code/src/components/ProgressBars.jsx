import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Weather from './Weather';

const ProgressBars = () => {
    const [progress, setProgress] = React.useState({ year: 0, day: 0 });

    useEffect(() => {
        const calculateProgress = () => {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
            const yearProgress = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;

            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const dayProgress = ((now - startOfDay) / (endOfDay - startOfDay)) * 100;

            setProgress({
                year: yearProgress.toFixed(0),
                day: dayProgress.toFixed(0)
            });
        };

        calculateProgress();
        const interval = setInterval(calculateProgress, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-sm">
            {/* Progress bars container */}
            <div className="w-full">
                <motion.div
                    className="space-y-6 py-4 mt-2 ml-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-200">Year in progress</span>
                            <span className="text-sm font-medium text-gray-200">{progress.year}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-700">
                            <motion.div
                                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${progress.year}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress.year}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-200">Day in progress</span>
                            <span className="text-sm font-medium text-gray-200">{progress.day}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-700">
                            <motion.div
                                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                                style={{ width: `${progress.day}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress.day}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>

    );
};

export default ProgressBars;
