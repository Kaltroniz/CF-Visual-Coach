import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Paper, Typography } from '@mui/material';

const getRatingColor = (rating) => {
  if (rating < 1200) return '#cec8c1'; // Gray
  if (rating < 1400) return '#43A047'; // Green
  if (rating < 1600) return '#03A9F4'; // Cyan
  if (rating < 1900) return '#9C27B0'; // Purple
  if (rating < 2100) return '#FF9800'; // Orange
  if (rating < 2400) return '#F44336'; // Red
  return '#8B0000'; // Dark Red (Legendary Grandmaster)
};

const RatingChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">No rating data available</Typography>
      </Paper>
    );
  }
  
  // Convert to array and sort by rating
  const chartData = Object.entries(data)
    .map(([rating, count]) => ({ rating: parseInt(rating), count }))
    .sort((a, b) => a.rating - b.rating);

  return (
    <Paper elevation={3} sx={{ p: 3, height: 400,width: 500, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Problems Solved by Rating
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} problems`, 'Solved']} />
          <Bar dataKey="count" name="Solved Problems">
            {chartData.map((entry) => (
              <Cell 
                key={`cell-${entry.rating}`} 
                fill={getRatingColor(entry.rating)} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default RatingChart;