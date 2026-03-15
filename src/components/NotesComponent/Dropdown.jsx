import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value) => {
        onChange({ target: { value } });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={selectRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="tq-surface-3 hover:tq-hover-bg rounded-lg flex items-center justify-between tq-text-primary px-4 py-2 cursor-pointer transition-colors"
            >
                <span>{options.find(opt => opt.value === value)?.label || 'Select...'}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={18} className="tq-text-muted ml-2" />
                </motion.div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 tq-surface-1 border tq-border-1 rounded-lg overflow-hidden shadow-lg z-50"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`px-4 py-2 cursor-pointer transition-colors hover:tq-surface-3 
                  ${value === option.value ? 'tq-surface-2 tq-text-primary' : 'tq-text-primary'}`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;