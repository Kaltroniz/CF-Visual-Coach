import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchUserStats = async (handle) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${handle}`);
    console.log(response.data.heatmapData)
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};