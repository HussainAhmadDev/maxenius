import { Box, Typography } from '@mui/material';

interface LoaderProps {
  text: string;
}

const Loader = ({ text }: LoaderProps) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        height: '100vmin',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography textAlign="center" variant="h4">
        {text}
      </Typography>
    </Box>
  );
};

export default Loader;
