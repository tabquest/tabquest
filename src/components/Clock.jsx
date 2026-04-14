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
            hours = hours % 12 || 12;
            return { hours, period };
        }
        return { hours, period: '' };
    }

    const { hours, period } = formatHours(time.getHours());

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <h1 className="text-4xl sm:text-6xl font-semibold relative z-0 tracking-tight flex items-baseline tabular-nums">
                <span style={{ color: 'var(--tq-accent)' }}>
                    {String(hours).padStart(2, '0')}
                </span>
                <span
                    className="animate-pulse font-normal"
                    style={{ color: 'var(--tq-text-muted)' }}
                >:</span>
                <span style={{ color: 'var(--tq-text-primary)' }}>
                    {String(time.getMinutes()).padStart(2, '0')}
                </span>
                {!hideSeconds && (
                    <>
                        <span
                            className="animate-pulse font-normal"
                            style={{ color: 'var(--tq-text-muted)' }}
                        >:</span>
                        <span style={{ color: 'var(--tq-text-secondary)' }}>
                            {String(time.getSeconds()).padStart(2, '0')}
                        </span>
                    </>
                )}
                {use12Hour && (
                    <span 
                        className="pl-3 text-lg sm:text-2xl font-light w-[3ch] inline-block"
                        style={{ color: 'var(--tq-text-muted)' }}
                    >
                        {period}
                    </span>
                )}
            </h1>
            <h2
                className="pt-4 pl-2 text-base sm:text-xl"
                style={{ color: 'var(--tq-text-secondary)' }}
            >
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