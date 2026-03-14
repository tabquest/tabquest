import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle, AlertCircle } from 'lucide-react';
import { FEEDBACK_FORM_API } from '../utils/constants';
import { FiLoader } from 'react-icons/fi';

const FeedbackForm = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const submitFeedback = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        formData.append('rating', rating.toString());

        try {
            await fetch(FEEDBACK_FORM_API, { method: 'POST', body: formData });
            setAlert({ type: 'success', message: 'Feedback submitted successfully!' });

            // Mark feedback as submitted
            localStorage.setItem('tabquest_feedback_submitted', 'true');

            setTimeout(() => {
                onClose();
                setRating(0);
                setAlert(null);
            }, 3000);
        } catch (error) {
            setAlert({ type: 'error', message: 'Error submitting feedback. Please try again.' });
        }
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                >
                    <motion.div
                        ref={formRef}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 350,
                            duration: 0.3
                        }}
                        className="w-full max-w-sm tq-surface-1 rounded-xl shadow-2xl mx-4 border tq-border-1"
                    >
                        <div className="p-5">
                            <AnimatePresence mode="wait">
                                {alert && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${alert.type === 'success'
                                            ? 'tq-success-bg tq-success border border-green-500/20'
                                            : 'tq-danger-bg tq-red border border-red-500/20'
                                            }`}
                                    >
                                        {alert.type === 'success' ?
                                            <CheckCircle className="w-4 h-4" /> :
                                            <AlertCircle className="w-4 h-4" />
                                        }
                                        <p className="text-sm font-medium">{alert.message}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-semibold tq-text-primary">Share Your Feedback</h3>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={onClose}
                                    className="tq-text-muted hover:tq-text-primary"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <form onSubmit={submitFeedback} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium tq-text-muted">
                                        Rate your experience
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                type="button"
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-6 h-6 transition-colors duration-200 ${star <= rating ? 'fill-purple-500 text-purple-400' : 'tq-text-muted hover:tq-text-muted'
                                                        }`}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium tq-text-muted">
                                        Your Feedback
                                    </label>
                                    <textarea
                                        name="feedback"
                                        required
                                        rows={3}
                                        className="w-full custom-scrollbar tq-surface-1 tq-text-primary rounded-lg p-3 border tq-border-1 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition-all placeholder-gray-500 text-sm"
                                        placeholder="Tell us what you think..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium tq-text-muted">
                                        Feature Request (Optional)
                                    </label>
                                    <textarea
                                        name="feature_request"
                                        rows={3}
                                        className="w-full custom-scrollbar tq-surface-1 tq-text-primary rounded-lg p-3 border tq-border-1 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none transition-all placeholder-gray-500 text-sm"
                                        placeholder="Suggest new features..."
                                    />
                                </div>

                                <motion.button type="submit"
                                    disabled={isSubmitting || rating === 0} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    className={`w-full py-2 rounded-lg tq-text-primary font-medium transition-all ${isSubmitting || rating === 0 ? 'tq-surface-1 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20'}`} >
                                    {isSubmitting ? (<div className="flex items-center justify-center gap-2"> <FiLoader className="animate-spin" /> Submitting... </div>) : ('Submit Feedback')}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackForm;