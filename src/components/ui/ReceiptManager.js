import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  Plus,
  Image,
  FileText as Pdf,
} from 'lucide-react';

const ReceiptManager = ({ receipts = [], onUpload, onDelete, isLoading = false }) => {
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [receiptDetails, setReceiptDetails] = useState({
    description: '',
    amount: '',
    category: ''
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile && onUpload) {
      const formData = new FormData();
      formData.append('receipt', selectedFile);
      formData.append('description', receiptDetails.description);
      formData.append('amount', receiptDetails.amount);
      formData.append('category', receiptDetails.category);
      
      onUpload(formData);
      setUploadDialog(false);
      setSelectedFile(null);
      setReceiptDetails({ description: '', amount: '', category: '' });
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) {
      return <Image size={24} />;
    } else if (fileType?.includes('pdf')) {
      return <Pdf size={24} />;
    }
    return <FileText size={24} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        elevation={2}
        sx={{ 
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.05)',
          height: '100%'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: 'primary.main' }}>
                <FileText size={24} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Receipt Management
              </Typography>
              <Chip 
                label={`${receipts.length} receipts`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            </Box>
            
            <Button
              onClick={() => setUploadDialog(true)}
              startIcon={<Plus size={18} />}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #218838 0%, #1ea085 100%)'
                }
              }}
            >
              Upload Receipt
            </Button>
          </Box>

          {/* Receipt List */}
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {receipts.length > 0 ? (
              <List>
                <AnimatePresence>
                  {receipts.map((receipt, index) => (
                    <motion.div
                      key={receipt.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListItem
                        sx={{
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'grey.50'
                          }
                        }}
                      >
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {getFileIcon(receipt.file_type)}
                        </Avatar>
                        <ListItemText
                          primary={receipt.filename || `Receipt ${index + 1}`}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {receipt.description || 'No description'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {receipt.file_size ? formatFileSize(receipt.file_size) : 'Unknown size'} • 
                                {receipt.upload_date ? new Date(receipt.upload_date).toLocaleDateString() : 'Today'}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" color="primary">
                              <Eye size={16} />
                            </IconButton>
                            <IconButton size="small" color="primary">
                              <Download size={16} />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => onDelete && onDelete(receipt.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Upload size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  No receipts uploaded yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your first receipt to get started
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog 
        open={uploadDialog} 
        onClose={() => setUploadDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Upload size={24} />
            Upload Receipt
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="receipt-upload"
            />
            <label htmlFor="receipt-upload">
              <Button
                component="span"
                variant="outlined"
                fullWidth
                sx={{ 
                  py: 3, 
                  mb: 3,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  '&:hover': {
                    borderStyle: 'dashed'
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Upload size={32} style={{ marginBottom: 8 }} />
                  <Typography variant="body1">
                    {selectedFile ? selectedFile.name : 'Click to select file'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supports images and PDF files
                  </Typography>
                </Box>
              </Button>
            </label>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={receiptDetails.description}
                  onChange={(e) => setReceiptDetails(prev => ({ ...prev, description: e.target.value }))}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Amount"
                  type="number"
                  value={receiptDetails.amount}
                  onChange={(e) => setReceiptDetails(prev => ({ ...prev, amount: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Category"
                  value={receiptDetails.category}
                  onChange={(e) => setReceiptDetails(prev => ({ ...prev, category: e.target.value }))}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUploadDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #218838 0%, #1ea085 100%)'
              }
            }}
          >
            {isLoading ? 'Uploading...' : 'Upload Receipt'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ReceiptManager;
