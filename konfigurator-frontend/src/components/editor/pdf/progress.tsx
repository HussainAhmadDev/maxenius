import { Box, CircularProgress, circularProgressClasses } from '@mui/material';

const Progress = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: '#fff',
        }}
        size={50}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={50}
        thickness={4}
      />
    </Box>
  );
};

export default Progress;
