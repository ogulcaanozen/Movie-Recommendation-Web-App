// frontend/src/services/commentService.js
import axios from 'axios';
import { getTokenFromCookie } from './tokenService';

const BASE_URL = 'http://localhost:3001/api/comments';

export const getCommentsByMovieID = async (movieID) => {
  try {
    const response = await axios.get(`${BASE_URL}/${movieID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const postComment = async (commentData) => {
  try {
    const token = getTokenFromCookie();
    if (!token) {
      throw new Error('No token found in cookies');
    }

    const response = await axios.post(BASE_URL, commentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};
