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
                className="bg-[#0b1518] p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <FileText className="text-white/70" size={24} />
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-white/50 hover:text-white/90 transition-colors rounded-full hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => {
                        const Icon = getIconForField(field.type);
                        return (
                            <div key={field.name}>
                                <label className="block text-white/70 text-sm mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-400 ml-1">*</span>}
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                                        <Icon size={18} />
                                    </div>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={values[field.name] || ''}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:border-white/20 focus:ring-1 focus:ring-white/20 focus:outline-none placeholder:text-white/30"
                                    />
                                </div>
                                {errors[field.name] && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
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