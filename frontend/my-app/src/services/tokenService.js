import axios from 'axios';

export const getTokenFromCookie = () => {
  const cookie = document.cookie;
  const [name, value] = cookie.split('=');
  return name === 'token' ? value : null;
};

export const verifyToken = async () => {
  const token = getTokenFromCookie();

  if (!token) {
    return { isValid: false, message: 'No token found' };
  }

  try {
    const response = await axios.get('http://localhost:3001/api/auth/verifyToken', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error verifying token:', error);
    return { isValid: false, message: 'Error verifying token' };
  }
};
