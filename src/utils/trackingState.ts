import type { UserVisit } from './tracking';

export const trackingState = {
    currentPageIndex: undefined as number | undefined,
    lastUpdateTime: Date.now(),
    currentVisit: null as UserVisit | null,
    backendId: localStorage.getItem('backend_id') as string | null,
    pendingVisitTimer: null as any
};
