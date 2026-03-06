import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const createVisit = async (userData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, userData);
        return response.data;
    } catch (error) {
        console.error('Error creating visit:', error);
        throw error;
    }
};

export const addVisitToUser = async (userId: string, visit: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add-visit/${userId}`, visit);
        return response.data;
    } catch (error) {
        console.error('Error adding visit to user:', error);
        throw error;
    }
};

export const getAllVisits = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching all visits:', error);
        throw error;
    }
};
