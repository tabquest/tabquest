import React, { useEffect } from "react";
import { motion } from "framer-motion";

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
            <div className="w-full">
                <motion.div
                    className="space-y-6 py-4 mt-2 ml-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {/* Year Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span
                                className="text-sm font-medium"
                                style={{ color: 'var(--tq-text-secondary)' }}
                            >
                                Year in progress
                            </span>
                            <span
                                className="text-sm font-medium"
                                style={{ color: 'var(--tq-text-secondary)' }}
                            >
                                {progress.year}%
                            </span>
                        </div>
                        <div
                            className="h-2.5 w-full rounded-full border border-white/5 overflow-hidden shadow-inner"
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.25)',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                            }}
                        >
                            <motion.div
                                className="h-2.5 rounded-full transition-all duration-500"
                                style={{
                                    width: `${progress.year}%`,
                                    backgroundColor: 'var(--tq-progress-year)',
                                    boxShadow: '0 0 12px var(--tq-accent-glow)',
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress.year}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                    {/* Day Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span
                                className="text-sm font-medium"
                                style={{ color: 'var(--tq-text-secondary)' }}
                            >
                                Day in progress
                            </span>
                            <span
                                className="text-sm font-medium"
                                style={{ color: 'var(--tq-text-secondary)' }}
                            >
                                {progress.day}%
                            </span>
                        </div>
                        <div
                            className="h-3 w-full rounded-full border border-white/5 overflow-hidden shadow-inner"
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.25)',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                            }}
                        >
                            <motion.div
                                className="h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${progress.day}%`,
                                    backgroundColor: 'var(--tq-progress-day)',
                                    boxShadow: `0 0 12px rgba(var(--tq-accent-sec-rgb), 0.25)`,
                                }}
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
