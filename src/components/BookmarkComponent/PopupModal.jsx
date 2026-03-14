import React, { useState } from "react";
import { motion } from 'framer-motion';
import { Bookmark, Link, Tags, Folder, X } from "lucide-react";

const getIconForField = (fieldName) => {
    switch (fieldName) {
        case 'title':
            return <Bookmark className="w-5 h-5" />;
        case 'url':
            return <Link className="w-5 h-5" />;
        case 'tags':
            return <Tags className="w-5 h-5" />;
        default:
            return <Folder className="w-5 h-5" />;
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="tq-glass shadow-2xl rounded-2xl p-6 w-full max-w-md"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium tq-text-primary">{title}</h3>
                    <button
                        onClick={onClose}
                        className="tq-text-secondary hover:tq-text-primary"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium tq-text-secondary mb-1">
                                {field.label}
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 tq-text-muted">
                                    {getIconForField(field.name)}
                                </div>
                                <input
                                    required
                                    type={field.type}
                                    value={values[field.name] || ''}
                                    placeholder={field.placeholder}
                                    onChange={(e) => {
                                        setValues(prev => ({
                                            ...prev,
                                            [field.name]: e.target.value
                                        }));
                                        if (errors[field.name]) {
                                            setErrors(prev => ({
                                                ...prev,
                                                [field.name]: undefined
                                            }));
                                        }
                                    }}
                                    className="w-full pl-10 pr-3 py-2 tq-surface-2 border tq-border-1 rounded-lg tq-text-primary placeholder:tq-text-muted focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                                />
                            </div>
                            {errors[field.name] && (
                                <p className="mt-1 text-sm tq-danger">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 tq-text-secondary hover:tq-text-primary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 tq-surface-3 hover:tq-hover-bg rounded-lg tq-text-primary"
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