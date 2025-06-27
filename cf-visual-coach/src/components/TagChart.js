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
import { Paper, Typography, Box } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFCC00', '#A28FD0'];

const TagChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Paper elevation={3} sx={{ 
        p: 3, 
        height: 400, 
        width: 400,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 3
      }}>
        <Typography variant="h6">No tag data available</Typography>
      </Paper>
    );
  }
  
  // Convert to array and sort
  const chartData = Object.entries(data)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <Paper elevation={3} sx={{ p: 3, height: 400,width: 500, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Problems Solved by Tag
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          barSize={30} // Increased bar thickness
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis 
            dataKey="tag" 
            type="category" 
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value} problems`, 'Solved']}
            contentStyle={{ borderRadius: 8 }}
          />
          <Bar 
            dataKey="count" 
            name="Solved Problems"
            radius={[0, 4, 4, 0]} // Rounded bar ends
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default TagChart;