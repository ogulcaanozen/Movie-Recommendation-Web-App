import axios from "axios";

const API_URL = "http://localhost:3001/api/ratings/";

export const getRating = async (username, movieID) => {
  try {
    const response = await axios.get(`${API_URL}${username}/${movieID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rating:", error);
    return null;
  }
};

export const createRating = async (userId, username, rating, movieID) => {
  try {
    const response = await axios.post(API_URL, {
      user_id: userId,
      username,
      rating,
      movie_id: movieID,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating rating:", error);
    return null;
  }
};

export const updateRating = async (userId, movieID, newRating) => {
  try {
    const response = await axios.put(API_URL, {
      user_id: userId,
      movie_id: movieID,
      new_rating: newRating,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating rating:", error);
    return null;
  }
};

export const deleteRating = async (userId, movieId) => {
    try {
      const response = await axios.delete(API_URL, {
        data: {
          user_id: userId,
          movie_id: movieId,
        },
      });
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error deleting rating');
      }
    } catch (error) {
      console.error('Error in deleteRating:', error);
      throw new Error('Error deleting rating');
    }
  };
