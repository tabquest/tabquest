import React, { useEffect } from 'react';
import ExtensionAnalytics from '../utils/analytics';
import { G_MEASUREMENT_ID, G_TAG_API_KEY } from '../utils/constants';

const analytics = new ExtensionAnalytics(
    G_MEASUREMENT_ID,
    G_TAG_API_KEY
);

const LiveUsersTracker = () => {
    useEffect(() => {
        let interval;

        const initAnalytics = async () => {
            try {
                const initialized = await analytics.init();
                if (initialized) {
                    console.debug('Analytics initialized successfully');
                    await analytics.trackActiveUsers();

                    interval = setInterval(async () => {
                        const success = await analytics.trackActiveUsers();
                        if (!success) {
                            console.warn('Failed to track user activity');
                        }
                    }, 30000);
                } else {
                    console.error('Analytics initialization failed');
                }
            } catch (error) {
                console.error('Analytics initialization error:', error);
            }
        };

        initAnalytics();

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    return null;
};

export default LiveUsersTracker;