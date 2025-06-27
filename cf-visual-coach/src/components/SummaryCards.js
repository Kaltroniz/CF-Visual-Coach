import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper,
  LinearProgress,
  Chip
} from '@mui/material';
import { formatNumber } from '../utils';

const SummaryCards = ({ stats }) => {
  if (!stats) return null;
  
  const { solved, maxStreak, byTag, byRating } = stats;
  
  // Find weakest tag (lowest solved count)
  const weakestTag = Object.entries(byTag)
    .reduce((min, [tag, count]) => count < min.count ? { tag, count } : min, 
      { tag: '', count: Infinity });
  
  // Find strongest tag
  const strongestTag = Object.entries(byTag)
    .reduce((max, [tag, count]) => count > max.count ? { tag, count } : max, 
      { tag: '', count: 0 });
  
  // Calculate average rating
  const ratings = Object.entries(byRating);
  const totalSolved = ratings.reduce((sum, [_, count]) => sum + count, 0);
  const avgRating = totalSolved > 0 
    ? Math.round(ratings.reduce((sum, [rating, count]) => sum + (parseInt(rating) * count), 0) )/ totalSolved
    : 0;
  
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Problems Solved
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {formatNumber(solved)}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Current Streak
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {maxStreak} days
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Skill Level
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {avgRating > 0 ? avgRating : 'N/A'}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Average Problem Rating
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Strongest Area
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip 
              label={strongestTag.tag} 
              color="success" 
              size="small" 
              sx={{ fontWeight: 'bold', mr: 1 }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {strongestTag.count}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(100, (strongestTag.count / solved) * 100)} 
            color="success"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Weakest Area
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip 
              label={weakestTag.tag} 
              color="warning" 
              size="small" 
              sx={{ fontWeight: 'bold', mr: 1 }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {weakestTag.count}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(100, (weakestTag.count / solved) * 100)} 
            color="warning"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;