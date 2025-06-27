import React from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Chip, 
  Button, 
  CircularProgress
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Recommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Recommended Problems
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Based on your performance, we recommend these problems to improve your skills
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {recommendations.map((problem, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {problem.name}
                </Typography>
                <Chip 
                  label={`${problem.rating}`} 
                  size="small" 
                  sx={{ 
                    fontWeight: 'bold',
                    backgroundColor: problem.rating < 1200 ? '#cec8c1' : 
                                    problem.rating < 1400 ? '#43A047' : 
                                    problem.rating < 1600 ? '#03A9F4' : 
                                    problem.rating < 1900 ? '#9C27B0' : 
                                    problem.rating < 2100 ? '#FF9800' : 
                                    problem.rating < 2400 ? '#F44336' : '#8B0000',
                    color: problem.rating < 1200 ? '#000' : '#fff'
                  }} 
                />
              </Box>
              
              <Box sx={{ mt: 1, mb: 2 }}>
                {problem.tags.map((tag, tagIndex) => (
                  <Chip
                    key={tagIndex}
                    label={tag}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              
              <Button
                variant="outlined"
                color="primary"
                endIcon={<OpenInNewIcon />}
                href={problem.link}
                target="_blank"
                fullWidth
              >
                Solve Problem
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Recommendations;