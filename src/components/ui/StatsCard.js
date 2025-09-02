import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';

const getCardBackground = (color) => {
  switch (color) {
    case 'primary':
      return '#6366f1';
    case 'success':
      return '#10b981';
    case 'warning':
      return '#f59e0b';
    case 'error':
      return '#ef4444';
    default:
      return '#111827';
  }
};

const getCardTextColor = (color) => {
  return '#ffffff';
};

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  trend,
  subtitle,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card 
        elevation={0}
        sx={{ 
          height: '140px',
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
            borderColor: '#d1d5db'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          background: getCardBackground(color),
          color: getCardTextColor(color),
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, fontSize: '2rem', lineHeight: 1.2 }}>
                {value}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.875rem', opacity: 0.8 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.75rem' }}>
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Chip 
                  label={trend} 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              )}
            </Box>
            <Box sx={{ opacity: 0.7, ml: 2 }}>
              {React.cloneElement(icon, { size: 28 })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
