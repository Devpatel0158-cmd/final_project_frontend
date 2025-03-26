import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  TablePagination,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FlightIcon from '@mui/icons-material/Flight';
import PetsIcon from '@mui/icons-material/Pets';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Map of category icons
const categoryIcons = {
  'Food & Dining': <RestaurantIcon />,
  'Shopping': <ShoppingCartIcon />,
  'Housing': <HomeIcon />,
  'Transportation': <DirectionsCarIcon />,
  'Healthcare': <LocalHospitalIcon />,
  'Education': <SchoolIcon />,
  'Entertainment': <SportsEsportsIcon />,
  'Travel': <FlightIcon />,
  'Pets': <PetsIcon />,
  'Other': <MoreHorizIcon />
};

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(8, 0, 0, 0.05)',
  '& .MuiTableCell-head': {
    backgroundColor: '#ffffff',
    fontWeight: 600,
    color: '#333333',
    borderBottom: '2px solid #000000'
  },
  '& .MuiTableRow-root': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  '& .MuiTableCell-body': {
    color: '#333333',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view expenses');
        return;
      }
      const response = await api.get('/expenses');
      if (response.data.success) {
        setExpenses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, expense) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExpense(null);
  };

  const handleEdit = () => {
    navigate(`/expenses/edit/${selectedExpense.id}`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/expenses/${selectedExpense.id}`);
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
    setDeleteDialogOpen(false);
    setSelectedExpense(null);
  };

  // Get the icon for a category
  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || <MoreHorizIcon />;
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(search.toLowerCase()) ||
    expense.category.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      background: '#f5f0e8',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#333333', fontWeight: 600 }}>
          Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/expenses/new')}
          sx={{ borderRadius: 2 }}
        >
          Add Expense
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ color: '#555555', mb: 1, fontWeight: 500 }}>
          Search by description or category
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search expenses..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              background: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease-in-out',
              border: '1px solid #e0e0e0',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderColor: '#bdbdbd'
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                borderColor: '#2563eb'
              }
            },
            '& .MuiOutlinedInput-input': {
              padding: '12px 14px',
              color: '#333333'
            }
          }}
        />
      </Box>

      <StyledTableContainer component={Paper} sx={{ background: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#111111', py: 2 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#111111', py: 2 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#111111', py: 2 }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#111111', py: 2 }}>Amount</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#111111', py: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((expense) => (
                <TableRow
                  hover
                  key={expense.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f8fafc !important',
                    },
                    cursor: 'pointer'
                  }}
                >
                  <TableCell sx={{ color: '#333333', py: 2 }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: '#333333', py: 2 }}>{expense.description}</TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getCategoryIcon(expense.category.name)}
                      </ListItemIcon>
                      <Typography variant="body2" sx={{ color: '#333333' }}>
                        {expense.category.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#333333', fontWeight: 500, py: 2 }}>
                    ${parseFloat(expense.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/expenses/edit/${expense.id}`)}
                      sx={{
                        color: '#64748b',
                        mr: 1,
                        '&:hover': {
                          color: '#3b82f6',
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedExpense(expense);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{
                        color: '#64748b',
                        '&:hover': {
                          color: '#ef4444',
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredExpenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '0 0 8px 8px',
          '& .MuiTablePagination-toolbar': {
            color: '#333333'
          }
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff'
          }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ sx: { color: '#333333' } }} />
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ sx: { color: '#333333' } }} />
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'var(--card-background)',
            color: 'var(--text-primary)',
            borderRadius: 2,
            boxShadow: 'var(--shadow-md)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'var(--text-primary)' }}>Delete Expense</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'var(--text-primary)' }}>
            Are you sure you want to delete this expense? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: 'var(--text-secondary)',
              '&:hover': {
                backgroundColor: 'var(--hover-color)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await api.delete(`/expenses/${selectedExpense.id}`);
                toast.success('Expense deleted successfully');
                fetchExpenses();
                setDeleteDialogOpen(false);
              } catch (error) {
                console.error('Error deleting expense:', error);
                toast.error('Failed to delete expense');
              }
            }}
            color="error"
            variant="contained"
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': {
                backgroundColor: '#dc2626',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Expenses; 