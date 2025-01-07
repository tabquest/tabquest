import React, { useState } from "react";
import { motion} from 'framer-motion';


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
                className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
                <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-white/70 mb-1">
                                {field.label}
                            </label>
                            <input
                                required
                                type={field.type}
                                value={values[field.name] || ''}
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
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80"
                            />
                            {errors[field.name] && (
                                <p className="mt-1 text-sm text-red-400">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white/70 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
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