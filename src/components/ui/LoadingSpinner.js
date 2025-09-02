import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...', size = 40 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <CircularProgress 
          size={size} 
          sx={{ 
            color: 'primary.main',
            mb: 2
          }} 
        />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default LoadingSpinner;
