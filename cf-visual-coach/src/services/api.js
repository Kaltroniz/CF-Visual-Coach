import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchUserStats = async (handle) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${handle}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};