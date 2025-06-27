import React, { useState, useEffect, useMemo } from 'react';
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
  const [tooltip, setTooltip] = useState(null);
  
  // Prepare calendar data
  const { yearData, monthLabels } = useMemo(() => {
    if (!heatmapData || Object.keys(heatmapData).length === 0) {
      return { yearData: [], monthLabels: [] };
    }

    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 11, 31));
    const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    // Find max solved for color scaling
    const maxSolved = Math.max(...Object.values(heatmapData).map(d => d.solved), 1);
    
    // Prepare day data
    const daysData = allDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayData = heatmapData[dateStr] || { solved: 0, attempts: 0 };
      
      return {
        date: dateStr,
        solved: dayData.solved,
        attempts: dayData.attempts,
        dayOfWeek: getDay(day), // 0 (Sun) to 6 (Sat)
        week: getWeek(day, { weekStartsOn: 1 }), // ISO week (Mon-Sun)
        month: getMonth(day)
      };
    });
    
    // Group by week
    const weeksMap = new Map();
    daysData.forEach(day => {
      if (!weeksMap.has(day.week)) {
        weeksMap.set(day.week, []);
      }
      weeksMap.get(day.week).push(day);
    });
    
    // Convert to array and pad weeks
    const weeksArray = Array.from(weeksMap.values()).map(week => {
      // Pad the week to 7 days
      const paddedWeek = Array(7).fill(null);
      week.forEach(day => {
        // Adjust index: Monday=0, Sunday=6
        const index = day.dayOfWeek === 0 ? 6 : day.dayOfWeek - 1;
        paddedWeek[index] = day;
      });
      return paddedWeek;
    });
    
    // Prepare month labels
    const monthSet = new Set();
    const monthLabels = [];
    let lastMonth = -1;
    
    daysData.forEach(day => {
      if (day.month !== lastMonth) {
        monthLabels.push({
          month: format(new Date(currentYear, day.month, 1), 'MMM'),
          week: day.week,
          position: day.dayOfWeek
        });
        lastMonth = day.month;
      }
    });
    
    return { 
      yearData: weeksArray, 
      monthLabels 
    };
  }, [heatmapData]);

  // Get color based on solved count
  const getColor = (solved) => {
    if (solved === 0) return '#ebedf0';
    if (solved === 1) return '#9be9a8';
    if (solved === 2) return '#40c463';
    if (solved === 3) return '#30a14e';
    return '#216e39';
  };

  if (!heatmapData || Object.keys(heatmapData).length === 0) {
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

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Activity Calendar
      </Typography>
      
      <Box sx={{ position: 'relative' }}>
        {/* Tooltip display */}
        {tooltip && (
          <Paper 
            sx={{ 
              position: 'absolute',
              top: tooltip.top - 70,
              left: tooltip.left,
              p: 1.5,
              zIndex: 1000,
              minWidth: 180,
              boxShadow: 3
            }}
            elevation={3}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {tooltip.date}
            </Typography>
            <Typography variant="body2">
              Solved: <strong>{tooltip.solved}</strong> problem{tooltip.solved !== 1 ? 's' : ''}
            </Typography>
            <Typography variant="body2">
              Attempts: <strong>{tooltip.attempts}</strong>
            </Typography>
          </Paper>
        )}
        
        {/* Calendar grid */}
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
                    ml: i === 0 ? 0 : `${(month.week - monthLabels[i-1].week) * 14.5}px`,
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: theme.palette.text.secondary,
                    minWidth: '40px'
                  }}
                >
                  {month.month}
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex' }}>
              {/* Day of week labels */}
              <Box sx={{ width: '30px', display: 'flex', flexDirection: 'column' }}>
                {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((day, i) => (
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
                    {day}
                  </Box>
                ))}
              </Box>
              
              {/* Heatmap grid */}
              <Box sx={{ flex: 1 }}>
                {yearData.map((week, weekIndex) => (
                  <Box 
                    key={weekIndex} 
                    sx={{ display: 'flex', mb: '2px' }}
                  >
                    {week.map((day, dayIndex) => (
                      <Box
                        key={`${weekIndex}-${dayIndex}`}
                        onMouseEnter={(e) => {
                          if (day) {
                            const rect = e.target.getBoundingClientRect();
                            setTooltip({
                              date: format(parseISO(day.date), 'MMM d, yyyy'),
                              solved: day.solved,
                              attempts: day.attempts,
                              top: rect.top,
                              left: rect.left
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        sx={{
                          width: '14px',
                          height: '14px',
                          bgcolor: day ? getColor(day.solved) : 'transparent',
                          m: '0 1px',
                          borderRadius: '2px',
                          position: 'relative',
                          '&:hover': {
                            outline: `2px solid ${theme.palette.primary.main}`
                          }
                        }}
                      />
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* Color legend */}
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
                borderRadius: '2px'
              }}
            />
          ))}
          <Typography variant="body2" sx={{ ml: 1, color: theme.palette.text.secondary }}>
            More
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ActivityCalendar;