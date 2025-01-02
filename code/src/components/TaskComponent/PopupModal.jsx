import React, { useState } from 'react'
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

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
                className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-white/50 hover:text-white/90 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-white/70 text-sm mb-2">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={values[field.name] || ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 transition-all duration-200 focus:border-white/20 focus:ring-1 focus:ring-white/20"
                            />
                            {errors[field.name] && (
                                <p className="text-red-400 text-sm mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
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

export default PopupModal