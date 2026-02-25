
export interface UserVisit {
    id: string | number;
    title: string;
    timestamp: string;
    path: string;
    duration: number; // in seconds
    pageVisits?: Record<number, number>; // pageIndex -> duration in seconds
}

export interface UserData {
    id: string;
    name: string;
    phone: string;
    content: string;
    message?: string;
    createdAt: string;
    visits: UserVisit[];
    totalTimeSpent: number; // in seconds
}

export const trackVisitStart = (bookId: string | number, bookTitle: string, manualPath?: string) => {
    const currentUserId = localStorage.getItem('current_user_id');
    if (!currentUserId) return;

    const allUsersStr = localStorage.getItem('all_users_data');
    if (!allUsersStr) return;

    const allUsers: UserData[] = JSON.parse(allUsersStr);
    const userIndex = allUsers.findIndex((u) => u.id === currentUserId);

    if (userIndex !== -1) {
        const visitPath = manualPath || window.location.pathname;
        const visit: UserVisit = {
            id: bookId,
            title: bookTitle,
            timestamp: new Date().toISOString(),
            path: visitPath,
            duration: 0,
            pageVisits: {}
        };

        if (!allUsers[userIndex].visits) {
            allUsers[userIndex].visits = [];
        }

        const visits = allUsers[userIndex].visits;
        // We only add a new visit if the ID or path changed
        const lastVisit = visits.length > 0 ? visits[visits.length - 1] : null;

        if (!lastVisit || lastVisit.path !== visitPath || lastVisit.id !== bookId) {
            allUsers[userIndex].visits.push(visit);
            localStorage.setItem('all_users_data', JSON.stringify(allUsers));
        }
    }
};

export const updateTimeSpent = (timeIncrement: number, currentPageIndex?: number) => {
    const currentUserId = localStorage.getItem('current_user_id');
    if (!currentUserId) return;

    const allUsersStr = localStorage.getItem('all_users_data');
    if (!allUsersStr) return;

    try {
        const allUsers: UserData[] = JSON.parse(allUsersStr);
        const userIndex = allUsers.findIndex((u) => u.id === currentUserId);

        if (userIndex !== -1) {
            const user = allUsers[userIndex];

            // Update total time
            user.totalTimeSpent = (user.totalTimeSpent || 0) + timeIncrement;

            // Update current visit duration
            if (user.visits && user.visits.length > 0) {
                const currentVisit = user.visits[user.visits.length - 1];

                // Check if current page is within a book (path starts with /home or similar)
                // If so, update both total duration and page-specific duration
                currentVisit.duration = (currentVisit.duration || 0) + timeIncrement;

                if (currentPageIndex !== undefined) {
                    if (!currentVisit.pageVisits) {
                        currentVisit.pageVisits = {};
                    }
                    currentVisit.pageVisits[currentPageIndex] = (currentVisit.pageVisits[currentPageIndex] || 0) + timeIncrement;
                }
            }

            localStorage.setItem('all_users_data', JSON.stringify(allUsers));
        }
    } catch (error) {
        console.error("Error updating time spent:", error);
    }
};
