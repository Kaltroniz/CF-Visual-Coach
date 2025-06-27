// Format numbers with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Get week number from date string
export const getWeekNumber = (dateString) => {
  const date = new Date(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Prepare heatmap data
export const prepareHeatmapData = (heatmapData) => {
  const data = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  Object.entries(heatmapData).forEach(([date, value]) => {
    const day = new Date(date).getDay();
    const week = getWeekNumber(date);
    
    data.push({
      day: days[day],
      week: `Week ${week}`,
      date,
      value: value.solved,
      attempts: value.attempts
    });
  });
  
  return data;
};

// Prepare radar chart data
export const prepareRadarData = (byTag) => {
  return Object.entries(byTag)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({
      subject: tag,
      A: count,
      fullMark: Math.max(...Object.values(byTag))
    }));
};