import React, { useState, useEffect } from 'react';
import { Container, Box, CircularProgress, Alert, Typography, Grid } from '@mui/material';

import HandleForm from './components/HandleForm';
import SummaryCards from './components/SummaryCards';
import TagChart from './components/TagChart';
import RatingChart from './components/RatingChart';
import CalendarHeatmap from './components/CalendarHeatmap';
import Recommendations from './components/Recommendations';
import { fetchUserStats } from './services/api';
import Header from './components/Header';

function App() {
  const [handle, setHandle] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (cfHandle) => {
    setHandle(cfHandle);
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchUserStats(cfHandle);
      setStats(data);
    } catch (err) {
      setError('Failed to fetch user data. Please check the handle and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <HandleForm onSubmit={handleSubmit} loading={loading} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={80} />
          </Box>
        )}
        
        {stats && !loading && (
          <>
            <SummaryCards stats={stats} />
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TagChart data={stats.byTag} />
              </Grid>
              <Grid item xs={12} md={6}>
                <RatingChart data={stats.byRating} />
              </Grid>
            </Grid>
{/*             
            <Box sx={{ mb: 3 }}>
              <CalendarHeatmap heatmapData={stats.heatmapData} />
            </Box> */}
            
            {stats.recommendations && stats.recommendations.length > 0 && (
              <Recommendations recommendations={stats.recommendations} />
            )}
          </>
        )}
        
        {!stats && !loading && !error && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 10,
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
            borderRadius: 3,
            mt: 4
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Analyze Your Codeforces Performance
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Enter your Codeforces handle to get personalized insights, track your progress, 
              and receive problem recommendations to improve your competitive programming skills.
            </Typography>
          </Box>
        )}
      </Container>
      
      <Box sx={{ bgcolor: 'background.paper', py: 3, mt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            Codeforces Visual Coach • Built with React and Recharts • Not affiliated with Codeforces
          </Typography>
        </Container>
      </Box>
    </div>
  );
}

export default App;