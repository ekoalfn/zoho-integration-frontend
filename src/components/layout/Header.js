import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Receipt,
  LogOut,
  User,
  Settings,
  RefreshCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onSyncChartOfAccounts, onSyncContacts, onSyncReceipts }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [syncingStates, setSyncingStates] = useState({
    accounts: false,
    contacts: false,
    receipts: false
  });

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:8000/logout';
  };

  const handleSync = async (type, syncFunction) => {
    setSyncingStates(prev => ({ ...prev, [type]: true }));
    try {
      await syncFunction();
    } finally {
      setSyncingStates(prev => ({ ...prev, [type]: false }));
    }
  };

  const syncButtons = [
    {
      key: 'accounts',
      label: 'Chart of Accounts',
      icon: <Building2 size={16} />,
      onClick: () => handleSync('accounts', onSyncChartOfAccounts),
      loading: syncingStates.accounts
    },
    {
      key: 'contacts',
      label: 'Contacts',
      icon: <Users size={16} />,
      onClick: () => handleSync('contacts', onSyncContacts),
      loading: syncingStates.contacts
    },
    {
      key: 'receipts',
      label: 'Receipts',
      icon: <Receipt size={16} />,
      onClick: () => handleSync('receipts', onSyncReceipts),
      loading: syncingStates.receipts
    }
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        color: '#111827'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1, color: '#111827' }}>
            tmam
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          {/* Sync Buttons */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              {syncButtons.map((btn) => (
                <Button
                  key={btn.key}
                  onClick={btn.onClick}
                  disabled={btn.loading}
                  startIcon={btn.loading ? <RefreshCcw className="animate-spin" size={16} /> : btn.icon}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#374151',
                    borderColor: '#d1d5db',
                    backgroundColor: '#f9fafb',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      backgroundColor: '#f3f4f6'
                    },
                    '&:disabled': {
                      color: '#9ca3af',
                      borderColor: '#e5e7eb',
                      backgroundColor: '#f9fafb'
                    },
                    fontSize: '0.75rem',
                    px: 3,
                    py: 1,
                    minHeight: '32px'
                  }}
                >
                  {btn.label}
                </Button>
              ))}
            </Box>
          </motion.div>

          {/* User Profile */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <IconButton
              onClick={handleProfileClick}
              sx={{ 
                color: '#374151',
                backgroundColor: '#f9fafb',
                border: '1px solid #d1d5db',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                  borderColor: '#9ca3af'
                }
              }}
            >
              <User size={16} />
            </IconButton>
          </motion.div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5
                }
              }
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.Display_Name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.Email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <User size={16} style={{ marginRight: 12 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <Settings size={16} style={{ marginRight: 12 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
              <LogOut size={16} style={{ marginRight: 12 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
