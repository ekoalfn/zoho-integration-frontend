import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';
import { CircleDollarSign, Contact, Receipt, Microchip, TrendingUp } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import ExpenseForm from '../components/ui/ExpenseForm';
import SyncCard from '../components/ui/SyncCard';
import DataTable from '../components/ui/DataTable';
import NotificationSnackbar from '../components/ui/NotificationSnackbar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DashboardStats from '../components/ui/DashboardStats';
import ReceiptManager from '../components/ui/ReceiptManager';

const theme = createTheme({
  palette: {
    primary: {
      main: '#111827',
      light: '#374151',
      dark: '#000000'
    },
    secondary: {
      main: '#6b7280',
      light: '#9ca3af',
      dark: '#374151'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  spacing: 8,
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      color: '#111827',
      letterSpacing: '-0.025em'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      color: '#111827',
      letterSpacing: '-0.025em'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      color: '#374151',
      letterSpacing: '-0.025em'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#374151'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
      color: '#6b7280'
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.3,
      color: '#9ca3af'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderColor: '#d1d5db',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          lineHeight: 1.4,
          padding: '10px 16px',
          minHeight: '40px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        small: {
          padding: '6px 12px',
          fontSize: '0.75rem',
          minHeight: '32px'
        },
        large: {
          padding: '12px 24px',
          fontSize: '1rem',
          minHeight: '48px'
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
          height: '24px'
        },
        small: {
          height: '20px',
          fontSize: '0.6875rem'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#e5e7eb'
            },
            '&:hover fieldset': {
              borderColor: '#d1d5db'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#111827',
              borderWidth: '2px'
            }
          }
        }
      }
    }
  }
});

function Dashboard() {
  const { user } = useAuth();
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [expenseData, setExpenseData] = useState({
    account_id: '',
    amount: '',
    paid_through_account_id: '',
    date: '',
    description: '',
    customer_id: '',
  });
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState({
    chartOfAccounts: false,
    contacts: false,
    receipts: false,
    expense: false
  });
  const [receipts, setReceipts] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const syncChartOfAccounts = async () => {
    setLoading(prev => ({ ...prev, chartOfAccounts: true }));
    setNotification({ message: 'Syncing Chart of Accounts...', type: 'info' });
    try {
      const response = await fetch('/api/zoho/sync/chart-of-accounts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message, 'success');
        fetchChartOfAccounts(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to sync chart of accounts');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, chartOfAccounts: false }));
    }
  };

  const syncContacts = async () => {
    setLoading(prev => ({ ...prev, contacts: true }));
    setNotification({ message: 'Syncing Contacts...', type: 'info' });
    try {
      const response = await fetch('/api/zoho/sync/contacts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message, 'success');
        fetchContacts(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to sync contacts');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };

  const syncReceipts = async () => {
    setLoading(prev => ({ ...prev, receipts: true }));
    setNotification({ message: 'Syncing Receipts...', type: 'info' });
    // Placeholder for sync logic
    setTimeout(() => {
      setNotification({ message: 'Receipts synced successfully!', type: 'success' });
      setLoading(prev => ({ ...prev, receipts: false }));
    }, 2000);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const fetchChartOfAccounts = async () => {
    try {
      const response = await fetch('/api/zoho/chart-of-accounts', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const data = await response.json();
      setChartOfAccounts(data.chartofaccounts || []);
    } catch (error) {
      showNotification('Failed to fetch chart of accounts', 'error');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/zoho/contacts', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      showNotification('Failed to fetch contacts', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, expense: true }));
    
    try {
      const response = await fetch('/api/zoho/expenses', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        showNotification('Expense created successfully!', 'success');
        setExpenseData({
          account_id: '',
          amount: '',
          paid_through_account_id: '',
          date: '',
          description: '',
          customer_id: '',
        });
        // Add to local expenses list for immediate UI update
        const newExpense = { ...expenseData, id: Date.now() };
        setExpenses(prev => [newExpense, ...prev]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create expense');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, expense: false }));
    }
  };

  const handleReceiptUpload = async (formData) => {
    setLoading(prev => ({ ...prev, receipts: true }));
    try {
      // Placeholder for receipt upload API
      showNotification('Receipt uploaded successfully!', 'success');
      // Add to local receipts list for immediate UI update
      const newReceipt = {
        id: Date.now(),
        filename: formData.get('receipt').name,
        description: formData.get('description'),
        upload_date: new Date().toISOString()
      };
      setReceipts(prev => [newReceipt, ...prev]);
    } catch (error) {
      showNotification('Failed to upload receipt', 'error');
    } finally {
      setLoading(prev => ({ ...prev, receipts: false }));
    }
  };

  const handleReceiptDelete = async (receiptId) => {
    try {
      // Placeholder for receipt delete API
      setReceipts(prev => prev.filter(receipt => receipt.id !== receiptId));
      showNotification('Receipt deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete receipt', 'error');
    }
  };

  useEffect(() => {
    fetchChartOfAccounts();
    fetchContacts();
  }, []);

  // Define table columns
  const accountColumns = [
    { field: 'account_name', headerName: 'Account Name', flex: 1 },
    { 
      field: 'account_type', 
      headerName: 'Type', 
      width: 120,
      renderCell: ({ value }) => (
        <Microchip 
          label={value} 
          size="small" 
          color={value === 'expense' ? 'error' : value === 'bank' ? 'primary' : 'default'}
          variant="outlined"
        />
      )
    }
  ];

  const contactColumns = [
    { field: 'contact_name', headerName: 'Contact Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', width: 150 }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Header 
            onSyncChartOfAccounts={syncChartOfAccounts}
            onSyncContacts={syncContacts}
            onSyncReceipts={syncReceipts}
          />

          <Container maxWidth="xl" sx={{ py: 3, px: 3 }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 1,
                      fontWeight: 700,
                      color: '#111827'
                    }}
                  >
                    Expense Management Dashboard
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#6b7280',
                      maxWidth: '600px',
                      mx: 'auto'
                    }}
                  >
                    Manage your expenses, sync with Zoho, and track your financial data
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            {/* Dashboard Stats */}
            <DashboardStats 
              chartOfAccounts={chartOfAccounts}
              contacts={contacts}
              expenses={expenses}
            />

            <Grid container spacing={3}>
              {/* Expense Form */}
              <Grid item xs={12} lg={6}>
                <ExpenseForm
                  expenseData={expenseData}
                  onInputChange={handleInputChange}
                  onSubmit={handleFormSubmit}
                  chartOfAccounts={chartOfAccounts}
                  contacts={contacts}
                  isLoading={loading.expense}
                />
              </Grid>

              {/* Receipt Manager */}
              <Grid item xs={12} lg={6}>
                <ReceiptManager
                  receipts={receipts}
                  onUpload={handleReceiptUpload}
                  onDelete={handleReceiptDelete}
                  isLoading={loading.receipts}
                />
              </Grid>

              {/* Sync Cards */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <SyncCard
                      title="Chart of Accounts"
                      icon={<CircleDollarSign size={20} />}
                      data={chartOfAccounts}
                      onSync={syncChartOfAccounts}
                      isLoading={loading.chartOfAccounts}
                      renderItem={(account) => (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="body2">{account.account_name}</Typography>
                          <Microchip 
                            label={account.account_type} 
                            size="small" 
                            color={account.account_type === 'expense' ? 'error' : 'primary'}
                            variant="outlined"
                          />
                        </Box>
                      )}
                      emptyMessage="No accounts synced yet. Click sync to get started."
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <SyncCard
                      title="Contacts"
                      icon={<Contact size={20} />}
                      data={contacts}
                      onSync={syncContacts}
                      isLoading={loading.contacts}
                      renderItem={(contact) => (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {contact.contact_name}
                          </Typography>
                          {contact.email && (
                            <Typography variant="caption" color="text.secondary">
                              {contact.email}
                            </Typography>
                          )}
                        </Box>
                      )}
                      emptyMessage="No contacts synced yet. Click sync to get started."
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <SyncCard
                      title="Receipts"
                      icon={<Receipt size={20} />}
                      data={receipts}
                      onSync={syncReceipts}
                      isLoading={loading.receipts}
                      renderItem={(receipt) => (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {receipt.filename}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {receipt.description || 'No description'}
                          </Typography>
                        </Box>
                      )}
                      emptyMessage="No receipts uploaded yet."
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Data Tables */}
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <DataTable
                      title="Chart of Accounts"
                      icon={<CircleDollarSign size={20} />}
                      data={chartOfAccounts.map(account => ({
                        id: account.account_id,
                        account_name: account.account_name,
                        account_type: account.account_type
                      }))}
                      columns={accountColumns}
                      onRefresh={fetchChartOfAccounts}
                      isLoading={loading.chartOfAccounts}
                      emptyMessage="No chart of accounts data. Please sync with Zoho first."
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DataTable
                      title="Contacts"
                      icon={<Contact size={20} />}
                      data={contacts.map(contact => ({
                        id: contact.contact_id,
                        contact_name: contact.contact_name,
                        email: contact.email || 'N/A',
                        phone: contact.phone || 'N/A'
                      }))}
                      columns={contactColumns}
                      onRefresh={fetchContacts}
                      isLoading={loading.contacts}
                      emptyMessage="No contacts data. Please sync with Zoho first."
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>

          <NotificationSnackbar 
            notification={notification} 
            onClose={closeNotification}
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default Dashboard;
