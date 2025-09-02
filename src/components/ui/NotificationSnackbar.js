import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const NotificationSnackbar = ({ notification, onClose }) => {
  return (
    <Snackbar
      open={!!notification.message}
      autoHideDuration={4000}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={notification.type === 'error' ? 'error' : notification.type === 'info' ? 'info' : 'success'}
        variant="filled"
        sx={{ 
          minWidth: '300px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
