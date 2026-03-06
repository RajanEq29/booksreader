import { createVisit, addVisitToUser } from '../services/api';

export interface UserVisit {
    id: string | number;
    title: string;
    timestamp: string;
    path: string;
    duration: number; // in seconds
    pageVisits?: Record<string, number>; // sub-path -> duration in seconds
}

export interface UserData {
    id: string;
    name: string;
    phone: string;
    email: string;
    message?: string;
    createdAt: string;
    visits: UserVisit[];
    totalTimeSpent: number; // in seconds
    backendId?: string; // ID from MongoDB
}

export const trackVisitStart = async (bookId: string | number, bookTitle: string, manualPath?: string) => {
    const { trackingState } = await import('./trackingState');

    // Sync any existing time before starting a new visit
    await syncCurrentTime();

    try {
        const visitPath = manualPath || window.location.pathname;
        const visit: UserVisit = {
            id: bookId,
            title: bookTitle,
            timestamp: new Date().toISOString().replace('Z', '+00:00'),
            path: visitPath,
            duration: 0,
            pageVisits: {}
        };

        trackingState.currentVisit = visit;
        trackingState.lastUpdateTime = Date.now();

        // Clear any previous pending timer
        if (trackingState.pendingVisitTimer) {
            clearTimeout(trackingState.pendingVisitTimer);
        }

        // Just set the timer to validate the visit.
        // API calls only happen on interaction (page change/navigation) AFTER this timer clears.
        trackingState.pendingVisitTimer = setTimeout(() => {
            trackingState.pendingVisitTimer = null;
        }, 5000);

    } catch (error) {
        console.error("Error in trackVisitStart:", error);
    }
};

export const syncCurrentTime = async () => {
    const { trackingState } = await import('./trackingState');
    const now = Date.now();
    const deltaSeconds = Math.floor((now - trackingState.lastUpdateTime) / 1000);

    if (deltaSeconds > 0) {
        await updateTimeSpent(deltaSeconds, trackingState.currentPageIndex);
    }

    trackingState.lastUpdateTime = now;
};

export const cancelPendingVisitTracking = async () => {
    const { trackingState } = await import('./trackingState');
    if (trackingState.pendingVisitTimer) {
        clearTimeout(trackingState.pendingVisitTimer);
        trackingState.pendingVisitTimer = null;
    }
};

export const updateTimeSpent = async (timeIncrement: number, currentPageIndex?: number) => {
    const { trackingState } = await import('./trackingState');
    if (!trackingState.currentVisit) return;

    try {
        const currentVisit = trackingState.currentVisit;
        currentVisit.duration = (currentVisit.duration || 0) + timeIncrement;

        if (currentPageIndex !== undefined) {
            if (!currentVisit.pageVisits) {
                currentVisit.pageVisits = {};
            }
            // Create a sub-path for the page (e.g., /home/2/page-1)
            const subPath = `${currentVisit.path}/page-${currentPageIndex + 1}`;
            currentVisit.pageVisits[subPath] = (currentVisit.pageVisits[subPath] || 0) + timeIncrement;
        }


        if (!trackingState.pendingVisitTimer) {
            const visitPayload = {
                id: currentVisit.id,
                title: currentVisit.title,
                path: currentVisit.path,
                timestamp: currentVisit.timestamp,
                duration: currentVisit.duration,
                pageVisits: { ...currentVisit.pageVisits }
            };

            if (trackingState.backendId) {
                await addVisitToUser(trackingState.backendId, visitPayload).catch(err =>
                    console.error("Error syncing time spent to backend:", err)
                );
            } else {
                // First sync for a new user/session that has filled the form
                const userDataStr = localStorage.getItem('book_user_data');
                if (userDataStr) {
                    const userData = JSON.parse(userDataStr);
                    const result = await createVisit({
                        name: userData.name,
                        phone: userData.phone,
                        email: userData.email || userData.content, // Handle 'content' alias from HomeScreen
                        message: userData.message,
                        visits: [visitPayload],
                        totalTimeSpent: currentVisit.duration
                    });
                    if (result.success) {
                        trackingState.backendId = result.data._id;
                        localStorage.setItem('backend_id', result.data._id);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error updating time spent:", error);
    }
};
