import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Snowflake = ({ id }) => {
    const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 5 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.4 + 0.2, // Increased from 0.3 + 0.1
        fontSize: `${Math.random() * 8 + 10}px`, // Increased base size
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{
                y: '110vh',
                opacity: [0, 1, 0],
                rotate: 360
            }}
            transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10
            }}
            className="fixed text-white pointer-events-none z-0"
            style={{
                left: `${Math.random() * 100}vw`,
                fontSize: `${Math.random() * 1.5 + 0.5}rem`,
            }}
        >
            ❄
        </motion.div>
    );
};

const ChristmasSnowfall = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // Generate a fixed number of snowflakes
        const flakes = Array.from({ length: 30 }).map((_, i) => i);
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {snowflakes.map((id) => (
                <Snowflake key={id} id={id} />
            ))}
        </div>
    );
};

export default ChristmasSnowfall;
