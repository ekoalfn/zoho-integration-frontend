import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Clock,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';

const SyncCard = ({ 
  title, 
  icon, 
  data = [], 
  onSync, 
  isLoading = false, 
  lastSyncTime,
  renderItem,
  emptyMessage = 'No data available'
}) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    if (isLoading) return 'warning';
    if (data.length > 0) return 'success';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isLoading) return <Clock size={16} />;
    if (data.length > 0) return <CheckCircle size={16} />;
    return <AlertCircle size={16} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={0}
        sx={{
          height: '320px',
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
            borderColor: '#d1d5db'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: '#111827' }}>{icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', fontSize: '1.125rem' }}>
                {title}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon()}
              label={isLoading ? 'Syncing' : `${data.length} items`}
              color={getStatusColor()}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Sync Button */}
          <Button
            onClick={onSync}
            disabled={isLoading}
            startIcon={isLoading ? <RefreshCcw className="animate-spin" size={16} /> : <RefreshCcw size={16} />}
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              py: 1.5,
              minHeight: '44px',
              fontSize: '0.875rem',
              fontWeight: 500,
              background: '#111827',
              color: 'white',
              '&:hover': {
                background: '#374151',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                background: '#9ca3af'
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {isLoading ? 'Syncing...' : `Sync ${title}`}
          </Button>

          {/* Last Sync Time */}
          {lastSyncTime && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Last synced: {new Date(lastSyncTime).toLocaleString()}
            </Typography>
          )}

          {/* Expandable Data List */}
          {/* Show Details Button */}
          <Button
            onClick={() => setExpanded(!expanded)}
            startIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            variant="text"
            fullWidth
            sx={{ 
              mt: 'auto',
              color: '#6b7280',
              fontSize: '0.75rem',
              fontWeight: 500,
              minHeight: '36px',
              '&:hover': {
                backgroundColor: '#f9fafb'
              }
            }}
          >
            {expanded ? 'Hide Details' : 'Show Details'}
          </Button>

          <Collapse in={expanded}>
            {/* Data List */}
            <Box sx={{ flex: 1, maxHeight: '160px', overflowY: 'auto', mb: 2 }}>
              {data.length > 0 ? (
                <List dense>
                  <AnimatePresence>
                    {data.slice(0, 10).map((item, index) => (
                      <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ListItem sx={{ px: 0 }}>
                          {renderItem ? renderItem(item) : (
                            <ListItemText
                              primary={item.name || item.account_name || item.contact_name}
                              secondary={item.type || item.account_type}
                            />
                          )}
                        </ListItem>
                        {index < Math.min(data.length - 1, 9) && <Divider />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {data.length > 10 && (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            +{data.length - 10} more items...
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3, fontSize: '0.875rem' }}>
                  {emptyMessage}
                </Typography>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SyncCard;
