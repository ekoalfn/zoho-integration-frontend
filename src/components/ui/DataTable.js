import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

const DataTable = ({ 
  title, 
  icon, 
  data = [], 
  columns = [],
  searchable = true,
  onRefresh,
  isLoading = false,
  emptyMessage = 'No data available'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = searchable 
    ? data.filter(item => 
        Object.values(item).some(value => 
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: 'primary.main' }}>{icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                <Chip 
                  label={`${filteredData.length} items`} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {onRefresh && (
                  <Tooltip title="Refresh Data">
                    <IconButton 
                      onClick={onRefresh}
                      disabled={isLoading}
                      size="small"
                    >
                      <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Export Data">
                  <IconButton size="small">
                    <Download size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Search */}
            {searchable && (
              <TextField
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
            )}
          </Box>

          {/* Table */}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  {columns.map((column) => (
                    <TableCell 
                      key={column.field}
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      {column.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <motion.tr
                      key={row.id || index}
                      component={TableRow}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'grey.50'
                        }
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.field}>
                          {column.renderCell 
                            ? column.renderCell({ value: row[column.field], row })
                            : row[column.field]
                          }
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {emptyMessage}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataTable;
