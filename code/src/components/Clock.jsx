import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Clock = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timerInterval)
    })

    return (
        <motion.div
            className=""
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <h1 className="text-4xl sm:text-6xl font-semibold">
                <span className="text-green-400">{String(time.getHours()).padStart(2, '0')}</span>
                <span className="animate-pulse font-normal">:</span>
                <span>{String(time.getMinutes()).padStart(2, '0')}</span>
                <span className="animate-pulse font-normal">:</span>
                <span>{String(time.getSeconds()).padStart(2, '0')}</span>
                <span className="pl-3 text-lg sm:text-2xl">{time.getHours() >= 12 ? 'PM' : 'AM'}</span>
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

export default Clock
