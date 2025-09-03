import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
  Fade,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Shield, Zap } from 'lucide-react';
import { buildApiUrl, API_CONFIG } from '../config/api';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = buildApiUrl(API_CONFIG.ENDPOINTS.ZOHO_AUTH);
  };

  const features = [
    {
      icon: <Building2 size={32} />,
      title: 'Enterprise Ready',
      description: 'Built for businesses of all sizes with enterprise-grade security'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Smart Analytics',
      description: 'Get insights into your spending patterns and optimize expenses'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Integration',
      description: 'Direct integration with Zoho Books for seamless data sync'
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-time Sync',
      description: 'Instant synchronization of expenses, accounts, and contacts'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box sx={{ display: 'flex', minHeight: '600px' }}>
              {/* Left Side - Branding & Features */}
              <Box
                sx={{
                  flex: 1,
                  background: '#111827',
                  color: 'white',
                  p: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    tmam
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                    Smart Expense Management Platform
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 6, opacity: 0.8, lineHeight: 1.6 }}>
                    Simplify and control business spending with seamless Zoho integration. 
                    Manage expenses, sync accounts, and streamline your financial workflow.
                  </Typography>
                </motion.div>

                <Box sx={{ display: 'grid', gap: 3 }}>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ color: '#9ca3af' }}>{feature.icon}</Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {/* Right Side - Login Form */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 6
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  style={{ width: '100%', maxWidth: '400px' }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#111827' }}>
                        Welcome Back
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                        Connect your Zoho account to get started with expense management
                      </Typography>

                      <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          background: '#111827',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            background: '#374151',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-1px)'
                          },
                          '&:disabled': {
                            background: '#9ca3af'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isLoading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={20} color="inherit" />
                            Connecting...
                          </Box>
                        ) : (
                          'Login with Zoho'
                        )}
                      </Button>

                      <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
                        Secure authentication powered by Zoho OAuth 2.0
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default Login;
