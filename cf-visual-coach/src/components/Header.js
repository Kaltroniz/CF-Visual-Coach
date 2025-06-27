import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const Header = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <CodeIcon sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Codeforces Visual Coach
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Level Up Your Competitive Programming
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;