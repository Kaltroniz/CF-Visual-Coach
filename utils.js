const codeforcesService = require('./services/codeforces');

// Process raw submissions data
exports.processUserData = (submissions) => {
  const stats = {
    solved: 0,
    unsolved: 0,
    byTag: {},
    byRating: {},
    byDate: {},
    solvedProblems: new Set(),
    maxStreak: 0,
    weakTags: new Set(),
    heatmapData: {}
  };

  let currentStreak = 0;
  let lastDate = null;

  submissions.forEach(submission => {
    const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
    const date = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0];
    
    // Track solved problems
    if (submission.verdict === 'OK') {
      if (!stats.solvedProblems.has(problemId)) {
        stats.solvedProblems.add(problemId);
        stats.solved++;
        
        // Tag analysis
        submission.problem.tags.forEach(tag => {
          stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
        });
        
        // Rating analysis
        if (submission.problem.rating) {
          const rating = submission.problem.rating;
          stats.byRating[rating] = (stats.byRating[rating] || 0) + 1;
        }
      }
      
      // Streak calculation
      if (date !== lastDate) {
        currentStreak = currentStreak === 0 ? 1 : currentStreak + 1;
        stats.maxStreak = Math.max(stats.maxStreak, currentStreak);
        lastDate = date;
      }
    } else {
      currentStreak = 0;
      // Track weak tags from failed submissions
      submission.problem.tags.forEach(tag => {
        stats.weakTags.add(tag);
      });
    }
  });

  stats.unsolved = submissions.length - stats.solved;

  stats.heatmapData = exports.generateHeatmapData(submissions);
  return stats;
};

// Generate problem recommendations
exports.generateRecommendations = async (userStats) => {
  try {
    const allProblems = await codeforcesService.getAllProblems();
    const candidateProblems = [];
    
    // Get weak tags (prioritize least solved tags)
    const weakTags = Object.entries(userStats.byTag)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([tag]) => tag);
    
    // Get target rating range
    const solvedRatings = Object.keys(userStats.byRating);
    const targetRating = solvedRatings.length 
      ? Math.max(...solvedRatings.map(Number)) + 100
      : 800;

    // Filter candidate problems
    for (const problem of allProblems) {
      if (!problem.rating || userStats.solvedProblems.has(`${problem.contestId}-${problem.index}`)) {
        continue;
      }
      
      // Match weak tags
      const tagMatch = problem.tags.some(tag => weakTags.includes(tag));
      
      // Match rating (within range)
      const ratingDiff = Math.abs(problem.rating - targetRating);
      
      if (tagMatch && ratingDiff <= 200) {
        candidateProblems.push({
          contestId: problem.contestId,
          index: problem.index,
          name: problem.name,
          rating: problem.rating,
          tags: problem.tags,
          link: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
        });
      }
    }
    
    // Sort by relevance (rating proximity)
    candidateProblems.sort((a, b) => 
      Math.abs(a.rating - targetRating) - Math.abs(b.rating - targetRating)
    );
    
    return candidateProblems.slice(0, 5);
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
};

// Add this function to utils.js
exports.generateHeatmapData = (submissions) => {
  const heatmap = {};
  const solvedSet = new Set();
  
  submissions.forEach(sub => {
    const date = new Date(sub.creationTimeSeconds * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!heatmap[dateStr]) {
      heatmap[dateStr] = {
        solved: 0,
        attempts: 0,
        date: dateStr,
        dayOfWeek: date.getDay(),
        weekOfYear: getWeekOfYear(date)
      };
    }
    const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
    
    heatmap[dateStr].attempts++;
    if (sub.verdict === 'OK') {
      if (!solvedSet.has(problemId)) {
        solvedSet.add(problemId);
        heatmap[dateStr].solved++;
      }
    }
  });
  
  return heatmap;
};

// Helper function to get week number
function getWeekOfYear(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}