import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress,
  Typography,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const HandleForm = ({ onSubmit, loading }) => {
  const [handle, setHandle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(handle);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Analyze Your Codeforces Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            label="Enter Codeforces Handle"
            variant="outlined"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            InputLabelProps={{ shrink: true }}
            placeholder="e.g., tourist"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || !handle.trim()}
            sx={{ minWidth: 150, height: 56 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SearchIcon sx={{ mr: 1 }} /> Analyze
              </Box>
            )}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Enter your Codeforces username to get personalized insights and recommendations
        </Typography>
      </form>
    </Paper>
  );
};

export default HandleForm;