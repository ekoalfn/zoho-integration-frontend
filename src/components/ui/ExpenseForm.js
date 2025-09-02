import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, FileText, User, CreditCard } from 'lucide-react';
import dayjs from 'dayjs';

const ExpenseForm = ({ 
  expenseData, 
  onInputChange, 
  onSubmit, 
  chartOfAccounts = [], 
  contacts = [],
  isLoading = false 
}) => {
  const handleDateChange = (date) => {
    onInputChange({
      target: {
        name: 'date',
        value: date ? dayjs(date).format('YYYY-MM-DD') : ''
      }
    });
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
          height: 'fit-content',
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderColor: '#d1d5db'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ color: '#111827' }}>
              <FileText size={20} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
              Create New Expense
            </Typography>
          </Box>

          <form onSubmit={onSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Expense Date"
                    value={expenseData.date ? dayjs(expenseData.date) : null}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Calendar size={16} />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  value={expenseData.amount}
                  onChange={onInputChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DollarSign size={16} />
                      </InputAdornment>
                    )
                  }}
                  placeholder="0.00"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Expense Account</InputLabel>
                  <Select
                    name="account_id"
                    value={expenseData.account_id}
                    onChange={onInputChange}
                    label="Expense Account"
                    startAdornment={
                      <InputAdornment position="start">
                        <CreditCard size={16} />
                      </InputAdornment>
                    }
                  >
                    {chartOfAccounts
                      .filter(a => a.account_type === 'expense')
                      .map(account => (
                        <MenuItem key={account.account_id} value={account.account_id}>
                          {account.account_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Paid Through</InputLabel>
                  <Select
                    name="paid_through_account_id"
                    value={expenseData.paid_through_account_id}
                    onChange={onInputChange}
                    label="Paid Through"
                  >
                    {chartOfAccounts
                      .filter(a => a.account_type === 'bank' || a.account_type === 'cash')
                      .map(account => (
                        <MenuItem key={account.account_id} value={account.account_id}>
                          {account.account_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Customer (Optional)</InputLabel>
                  <Select
                    name="customer_id"
                    value={expenseData.customer_id}
                    onChange={onInputChange}
                    label="Customer (Optional)"
                    startAdornment={
                      <InputAdornment position="start">
                        <User size={16} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {contacts.map(contact => (
                      <MenuItem key={contact.contact_id} value={contact.contact_id}>
                        {contact.contact_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={expenseData.description}
                  onChange={onInputChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Enter expense description..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    background: '#10b981',
                    minHeight: '48px',
                    '&:hover': {
                      background: '#059669',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: '#9ca3af'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {isLoading ? 'Creating Expense...' : 'Create Expense'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExpenseForm;
