import React, { useMemo } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  startOfYear, 
  endOfYear, 
  eachDayOfInterval, 
  format, 
  parseISO, 
  getDay, 
  getWeek,
  getMonth
} from 'date-fns';

const ActivityCalendar = ({ heatmapData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Prepare calendar data
  const { weeksArray, monthLabels } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 11, 31));
    const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    // Initialize calendar data structure
    const weeksMap = new Map();
    const monthLabels = [];
    let currentMonth = -1;
    
    // Process each day
    allDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayData = heatmapData?.[dateStr] || { solved: 0, attempts: 0 };
      const weekNumber = getWeek(day, { weekStartsOn: 1 });
      const dayOfWeek = getDay(day); // 0 (Sun) - 6 (Sat)
      
      // Track month changes
      const month = getMonth(day);
      if (month !== currentMonth) {
        monthLabels.push({
          name: format(day, 'MMM'),
          week: weekNumber,
          position: dayOfWeek
        });
        currentMonth = month;
      }
      
      // Initialize week array if needed
      if (!weeksMap.has(weekNumber)) {
        weeksMap.set(weekNumber, Array(7).fill(null));
      }
      
      // Calculate position in week array (Monday = 0, Sunday = 6)
      const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weeksMap.get(weekNumber)[index] = {
        date: dateStr,
        solved: dayData.solved,
        attempts: dayData.attempts
      };
    });
    
    // Convert to sorted array of weeks
    const weeksArray = Array.from(weeksMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([weekNum, days]) => days);
    
    return { weeksArray, monthLabels };
  }, [heatmapData]);

  // Get color based on solved count (GitHub style)
  const getColor = (solved) => {
    if (solved === 0) return '#ebedf0';
    if (solved === 1) return '#9be9a8';
    if (solved === 2) return '#40c463';
    if (solved === 3) return '#30a14e';
    return '#216e39';
  };

  // Check if we have any activity data
  const hasActivity = useMemo(() => {
    return heatmapData && Object.values(heatmapData).some(day => day.solved > 0);
  }, [heatmapData]);

  if (!hasActivity) {
    return (
      <Paper elevation={3} sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 3,
        minHeight: 300
      }}>
        <Typography variant="h6">No activity data available</Typography>
      </Paper>
    );
  }
  const transposedArray = weeksArray[0].map((_, colIndex) =>
  weeksArray.map(row => row[colIndex])
);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Activity Calendar
      </Typography>
      
      <Box sx={{ overflowX: 'auto', pb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minWidth: isMobile ? 700 : '100%'
        }}>
          {/* Month labels */}
          <Box sx={{ 
            display: 'flex', 
            ml: '30px',
            height: '20px',
            mb: '5px'
          }}>
            {monthLabels.map((month, i) => (
              <Box 
                key={i}
                sx={{ 
                  ml: i === 0 ? 0 : '20px',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  color: theme.palette.text.secondary,
                  minWidth: '40px'
                }}
              >
                {month.name}
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex' }}>
            {/* Day of week labels */}
            <Box sx={{ width: '30px', display: 'flex', flexDirection: 'column' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <Box 
                  key={i}
                  sx={{ 
                    height: '15px', 
                    fontSize: '0.7rem',
                    color: theme.palette.text.secondary,
                    mb: '2px',
                    textAlign: 'right',
                    pr: '5px'
                  }}
                >
                  {i % 2 === 0 ? day : ''}
                </Box>
              ))}
            </Box>
            
            {/* Heatmap grid */}
            
            <Box sx={{ flex: 1 }}>
  {transposedArray.map((column, colIndex) => (
    <Box key={colIndex} sx={{ display: 'flex', mb: '2px' }}>
      {column.map((day, rowIndex) => (
        <Tooltip
          key={`${colIndex}-${rowIndex}`}
          title={day ? (
            <>
              <Typography variant="subtitle2">
                {format(parseISO(day.date), 'MMM d, yyyy')}
              </Typography>
              <Typography>Solved: {day.solved} problems</Typography>
              <Typography>Attempts: {day.attempts}</Typography>
            </>
          ) : null}
          placement="top"
          arrow
        >
          <Box
            sx={{
              width: '14px',
              height: '14px',
              bgcolor: day ? getColor(day.solved) : '#f0f0f0',
              m: '0 1px',
              borderRadius: '2px',
              border: day ? '1px solid rgba(27,31,35,0.06)' : 'none',
              '&:hover': {
                outline: day ? `2px solid ${theme.palette.primary.main}` : 'none'
              }
            }}
          />
        </Tooltip>
      ))}
    </Box>
  ))}
</Box>

          </Box>
        </Box>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        alignItems: 'center',
        mt: 1
      }}>
        <Typography variant="body2" sx={{ mr: 1, color: theme.palette.text.secondary }}>
          Less
        </Typography>
        {[0, 1, 2, 3, 4].map((intensity) => (
          <Box
            key={intensity}
            sx={{
              width: '14px',
              height: '14px',
              bgcolor: getColor(intensity),
              m: '0 1px',
              borderRadius: '2px',
              border: '1px solid rgba(27,31,35,0.06)'
            }}
          />
        ))}
        <Typography variant="body2" sx={{ ml: 1, color: theme.palette.text.secondary }}>
          More
        </Typography>
      </Box>
    </Paper>
  );
};

export default ActivityCalendar;