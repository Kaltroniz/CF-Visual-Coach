require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { processUserData, generateRecommendations } = require('./utils');
const codeforcesService = require('./services/codeforces');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Pre-cache problems on startup
codeforcesService.getAllProblems().catch(err => {
  console.error('Initial cache error:', err);
});

// User stats endpoint
app.get('/api/user/:handle', async (req, res) => {
  try {
    const handle = req.params.handle;
    
    // Fetch user submissions
    const submissions = await codeforcesService.getUserSubmissions(handle);
    
    // Process data
    const userStats = processUserData(submissions);
    
    // Generate recommendations
    const recommendations = await generateRecommendations(userStats);
    
    // Prepare response (remove sensitive data)
    const { solvedProblems, weakTags, ...stats } = userStats;
    
    const heatmapData = Object.entries(userStats.heatmapData).map(
      ([date, data]) => ({
        date,
        solved: data.solved,
        attempts: data.attempts,
        dayOfWeek: data.dayOfWeek,
        weekOfYear: data.weekOfYear
      })
    );
    console.log('Sample heatmap data:', 
  Object.entries(heatmapData).slice(0, 5)
);

    res.json({
      ...stats,
      recommendations,
      heatmapData: generateHeatmapData(submissions), // Implement later
      byTag: sortObject(stats.byTag),
      byRating: sortObject(stats.byRating),
      heatmapData
    });
    
  } catch (error) {
    console.error(`Error processing ${req.params.handle}:`, error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

// Helper functions
function sortObject(obj) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

function generateHeatmapData(submissions) {
  // Implement in next step
  return {};
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});