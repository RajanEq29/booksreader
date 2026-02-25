
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateTimeSpent } from '../utils/tracking';
import { trackingState } from '../utils/trackingState';

const TRACKING_INTERVAL = 5000; // Update every 5 seconds

export default function TrackingManager() {
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            updateTimeSpent(TRACKING_INTERVAL / 1000, trackingState.currentPageIndex);
        }, TRACKING_INTERVAL);

        return () => clearInterval(interval);
    }, [location.pathname]);

    return null;
}
