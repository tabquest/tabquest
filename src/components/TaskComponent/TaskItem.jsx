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
            className="group p-2.5 tq-gradient-subtle hover:from-gray-800/40 hover:to-gray-700/40 rounded-xl border tq-border-1 shadow-lg backdrop-blur-sm transition-all duration-300 hover:tq-border-1 hover:shadow-emerald-500/5"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={handleComplete}
                        className="w-4 h-4 rounded-md tq-border-1 tq-surface-1 tq-success focus:ring-tq-success/30 focus:ring-2 focus:ring-offset-0 cursor-pointer hover:tq-border-success hover:tq-surface-1 transition-colors"
                    />
                    <div>
                        <div className="relative">
                            <h3 className={`text-lg font-medium tracking-tight ${task.completed ? 'tq-text-muted' : 'tq-text-primary'}`}>
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
                                <span className="text-sm flex items-center gap-2 tq-text-muted hover:tq-text-primary transition-colors">
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
                            className="p-2 rounded-lg tq-text-muted hover:tq-text-primary hover:tq-surface-2 transition-all duration-200"
                            onClick={onEdit}
                        >
                            <Edit2 className="stroke-[1.5]" size={16} />
                        </button>
                        <button
                            className="p-2 rounded-lg tq-text-muted hover:text-white hover:tq-danger-bg transition-all duration-200"
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