
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { syncCurrentTime } from '../utils/tracking';

const TRACKING_INTERVAL = 10000; // Sync every 10 seconds

export default function TrackingManager() {
    const location = useLocation();

    useEffect(() => {
        // We no longer sync periodically. 
        // Sync happens on page flips (Home.tsx) or when navigating away (cleanup below).
        return () => {
            syncCurrentTime(); // Final sync before route change
        };
    }, [location.pathname]);

    return null;
}
