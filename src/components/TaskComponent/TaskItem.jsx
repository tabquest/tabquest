import React, { forwardRef, useState } from 'react';
import { Calendar, Bell, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ANIMATION_DURATION = 0.7;

const TaskItem = forwardRef(({ task, onComplete, onEdit, onDelete }, ref) => {
    const [isScribbling, setIsScribbling] = useState(false);

    const handleComplete = async () => {
        if (!task.completed) {
            setIsScribbling(true);
            await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION * 1000));
            onComplete(task);
            setIsScribbling(false);
        } else {
            onComplete(task);
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            // exit={{ opacity: 0, y: -10 }}
            layout
            className="group p-2.5 bg-gradient-to-br from-gray-900/40 to-gray-800/40 hover:from-gray-800/40 hover:to-gray-700/40 rounded-xl border border-white/[0.08] shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:shadow-emerald-500/5"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={handleComplete}
                        className="w-4 h-4 rounded-md border-gray-600/40 bg-gray-800/60 text-emerald-500 focus:ring-emerald-500/30 focus:ring-2 focus:ring-offset-0 cursor-pointer hover:border-emerald-500/40 hover:bg-gray-700/60 transition-colors"
                    />
                    <div>
                        <div className="relative">
                            <h3 className={`text-lg font-medium tracking-tight ${task.completed ? 'text-white/40' : 'text-white/90'}`}>
                                {task.title.length  > 30 ? `${task.title.slice(0, 30)}.....` : task.title}
                            </h3>
                            <AnimatePresence>
                                {isScribbling && (
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <svg className="absolute w-full h-2 top-1/2 -translate-y-1/2" viewBox="0 0 180 8">
                                            <motion.path
                                                d="M0 4 C20 6, 40 2, 60 4 S80 6, 100 4 S120 2, 140 4 S160 6, 180 4"
                                                stroke="url(#strikethrough-gradient)"
                                                strokeWidth="5"
                                                strokeLinecap="round"
                                                fill="none"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{
                                                    pathLength: 1,
                                                    opacity: 1,
                                                    transition: {
                                                        pathLength: { duration: ANIMATION_DURATION * 1.2, ease: "easeOut" },
                                                        opacity: { duration: ANIMATION_DURATION * 0.6 }
                                                    }
                                                }}
                                            />
                                            <defs>
                                                <linearGradient id="strikethrough-gradient" x1="0" y1="0" x2="100%" y2="0">
                                                    <stop offset="0%" stopColor="rgb(255, 255, 255)" />
                                                    <stop offset="15%" stopColor="rgba(255, 255, 255, 0.95)" />
                                                    <stop offset="50%" stopColor="rgb(255, 255, 255)" />
                                                    <stop offset="85%" stopColor="rgba(255, 255, 255, 0.95)" />
                                                    <stop offset="100%" stopColor="rgb(255, 255, 255)" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {task.reminderDateTime && (
                            <div className="mt-2">
                                <span className="text-sm flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors">
                                    <Bell className="stroke-[1.5]" size={14} />
                                    {new Date(task.reminderDateTime).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                    <div className="flex gap-3">
                        <button
                            className="p-2 rounded-lg text-white/50 hover:text-white/90 hover:bg-white/5 transition-all duration-200"
                            onClick={onEdit}
                        >
                            <Edit2 className="stroke-[1.5]" size={16} />
                        </button>
                        <button
                            className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                            onClick={onDelete}
                        >
                            <Trash2 className="stroke-[1.5]" size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default TaskItem;