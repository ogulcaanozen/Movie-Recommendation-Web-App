// frontend/src/services/authService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3001/api/auth';

export const register = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



export async function verifyToken() {
  try {
    const token = Cookies.get('token');
    console.log('Token in verifyToken:', token);

    const response = await axios.get('http://localhost:3001/api/auth/verifyToken', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error verifying token');
  }
}




