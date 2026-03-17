export interface UserVisit {
    id: string | number;
    title: string;
    timestamp: string;
    path: string;
    duration?: number; // in seconds
    pageVisits?: Record<string, number>; // page path -> duration in seconds
}

export interface UserData {
    id: string;
    name: string;
    phone: string;
    email: string; // mapped from 'content' in legacy code
    message?: string;
    createdAt: string;
    visits: UserVisit[];
    totalTimeSpent: number; // in seconds
}

export interface BookVisitSummary {
    title: string;
    path: string;
    totalVisits: number;
    totalTimeSpent: number;
    users: Array<{
        name: string;
        email: string;
        phone: string;
        pageVisits: Record<string, number>;
        timestamp: string;
        duration: number;
    }>;
}

export interface PageVisitItem {
    userName: string;
    bookTitle: string;
    pageIndex: string;
    duration: number;
    timestamp: string;
    userId: string;
}

export type AdminTab = 'dashboard' | 'users' | 'visits';
export type SortOrder = 'recent' | 'name' | 'engagement';
