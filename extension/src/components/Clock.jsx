import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    const hideSeconds = useSelector((state) => state.settings.hideSeconds);
    const use12Hour = useSelector((state) => state.settings.use12Hour);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timerInterval)
    }, [])

    const formatHours = (hours) => {
        if (use12Hour) {
            const period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
            return { hours, period };
        }
        return { hours, period: '' };
    }

    const { hours, period } = formatHours(time.getHours());

    return (
        <motion.div
            className=""
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <h1 className="text-4xl sm:text-6xl font-semibold relative z-0">
                <span className="text-green-400">{String(hours).padStart(2, '0')}</span>
                <span className="animate-pulse font-normal">:</span>
                <span>{String(time.getMinutes()).padStart(2, '0')}</span>
                {!hideSeconds && (
                    <>
                        <span className="animate-pulse font-normal">:</span>
                        <span>{String(time.getSeconds()).padStart(2, '0')}</span>
                    </>
                )}
                {/* {use12Hour && <span className="pl-3 text-lg sm:text-2xl">{period}</span>} */}
            </h1>
            <h2 className="pt-4 pl-2 text-base sm:text-xl text-gray-400">
                <span>
                    {time.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short',
                        year: 'numeric',
                    })}
                </span>
            </h2>
        </motion.div>
    )
}

export default Clock;