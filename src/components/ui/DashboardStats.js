import React from 'react';
import { Grid, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, FileText, Users } from 'lucide-react';
import StatsCard from './StatsCard';

const DashboardStats = ({ chartOfAccounts = [], contacts = [], expenses = [] }) => {
  const stats = [
    {
      title: 'Total Accounts',
      value: chartOfAccounts.length,
      icon: <TrendingUp size={32} />,
      color: 'primary',
      subtitle: 'Synced from Zoho'
    },
    {
      title: 'Active Contacts',
      value: contacts.length,
      icon: <Users size={32} />,
      color: 'success',
      subtitle: 'Available for expenses'
    },
    {
      title: 'Monthly Expenses',
      value: expenses.length,
      icon: <FileText size={32} />,
      background: '#111827',
      color: 'white',
      subtitle: 'This month'
    },
    {
      title: 'Total Amount',
      value: '$0.00',
      icon: <DollarSign size={32} />,
      color: 'error',
      subtitle: 'All time expenses'
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              subtitle={stat.subtitle}
              delay={index * 0.1}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardStats;
