import axios from 'axios';

const API_URL = 'http://localhost:3001/api/ratings'; // Updated API URL

export const getRatedMovies = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rated movies:', error);
    throw error;
  }
};







