import React, { useEffect } from "react"
import Weather from './Weather'

const ProgressBars = () => {
    const [progress, setProgress] = React.useState({ year: 0, day: 0 });

    useEffect(() => {
        const calculateProgress = () => {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
            const yearProgress = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;

            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const dayProgress = ((now - startOfDay) / (endOfDay - startOfDay)) * 100;

            setProgress({
                year: yearProgress.toFixed(0),
                day: dayProgress.toFixed(0)
            });
        };

        calculateProgress();
        const interval = setInterval(calculateProgress, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 items-start">
            {/* Left column - Progress bars */}
            <div className="w-[75%]">
                <div className="space-y-6 py-4 mt-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-200">Year in progress</span>
                            <span className="text-sm font-medium text-gray-200">{progress.year}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-700">
                            <div
                                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${progress.year}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-200">Day in progress</span>
                            <span className="text-sm font-medium text-gray-200">{progress.day}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-700">
                            <div
                                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                                style={{ width: `${progress.day}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex justify-center items-center my-auto">
                {/* <Weather /> */}
                {/* <h1>DevTab</h1> */}
            </div>

            {/* Right column - Container */}
            <div className="text-gray-200">
                {/* conatiner */}
            </div>
        </div>
    );
};

export default ProgressBars;