import axios from "axios";

export async function getUserRecommendations(userId) {
    try {
        const response = await axios.post('http://localhost:3001/api/recommendations/getRecommendations', {user_id: userId});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getCollaborativeRecommendations(userId) {
    try {
        const response = await axios.post('http://localhost:3001/api/recommendations/getCollaborative', {user_id: userId});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getClusteringRecommendations(userId) {
    try {
        const response = await axios.post('http://localhost:3001/api/recommendations/getClusterings', {user_id: userId});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

