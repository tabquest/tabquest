import React, { useState } from 'react';
import { X, Type, Mail, Calendar, Clock, Hash, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const getIconForField = (type) => {
    switch (type) {
        case 'email':
            return Mail;
        case 'date':
            return Calendar;
        case 'time':
            return Clock;
        case 'number':
            return Hash;
        case 'text':
        default:
            return Type;
    }
};

const PopupModal = ({
    title,
    onClose,
    onSubmit,
    fields,
    initialValues = {}
}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        fields.forEach(field => {
            if (field.required && !values[field.name]) {
                newErrors[field.name] = 'This field is required';
            }
            if (field.validate) {
                const error = field.validate(values[field.name] || '');
                if (error) {
                    newErrors[field.name] = error;
                }
            }
        });

        if (Object.keys(newErrors).length === 0) {
            onSubmit(values);
        } else {
            setErrors(newErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <FileText className="tq-text-secondary" size={24} />
                        <h2 className="text-xl font-semibold tq-text-primary">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 tq-text-muted hover:tq-text-primary transition-colors rounded-full hover:tq-surface-3 cursor-pointer"
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => {
                        const Icon = getIconForField(field.type);
                        return (
                            <div key={field.name}>
                                <label className="block tq-text-secondary text-sm mb-2">
                                    {field.label}
                                    {field.required && <span className="tq-danger ml-1">*</span>}
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 tq-text-muted">
                                        <Icon size={18} />
                                    </div>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={values[field.name] || ''}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className="w-full pl-10 pr-3 py-2 tq-surface-2 border tq-border-1 rounded-lg tq-text-primary focus:tq-border-2 focus:ring-1 focus:ring-white/20 focus:outline-none placeholder:tq-text-muted"
                                    />
                                </div>
                                {errors[field.name] && (
                                    <p className="tq-danger text-sm mt-1 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 tq-danger-bg rounded-full"></span>
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t tq-border-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 tq-text-secondary hover:tq-text-primary transition-colors rounded-lg hover:tq-surface-2 cursor-pointer"
                            title="Cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 tq-surface-3 hover:tq-hover-bg rounded-lg tq-text-primary transition-colors cursor-pointer"
                            title="Save changes"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default PopupModal;