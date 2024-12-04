import React, { useEffect, useState } from 'react'

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timerInterval);
    })

    return (
        <div>
            <h1 className='text-6xl'>
                <span className='text-green-400'>{time.getHours()}</span>
                :
                <span>{time.getMinutes()}</span>
                :
                <span>{String(time.getSeconds()).padStart(2, '0')}</span>

                <span className='pl-3 text-2xl'>{time.getHours() >= 12 ? 'PM' : 'AM'}</span>

            </h1>
            <h2 className='pt-4 text-xl'>
                <span>{time.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short',
                    year: 'numeric'
                })}</span>
            </h2>
        </div>
    )
}

export default Clock