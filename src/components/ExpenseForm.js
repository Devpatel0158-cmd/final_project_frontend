import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../services/api';

const ExpenseForm = ({ categories, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    categoryId: initialData?.categoryId || '',
    note: initialData?.note || '',
    isRecurring: initialData?.isRecurring || false,
    recurringFrequency: initialData?.recurringFrequency || 'monthly'
  });

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isRecurring' ? checked : value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date.toISOString().split('T')[0]);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('note', formData.note);
      formDataToSend.append('isRecurring', formData.isRecurring);
      formDataToSend.append('recurringFrequency', formData.recurringFrequency);

      if (receipt) {
        formDataToSend.append('receipt', receipt);
      }

      if (initialData) {
        await api.put(`/expenses/${initialData.id}`, formDataToSend);
      } else {
        await api.post('/expenses', formDataToSend);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      p: 3,
      background: '#f5f0e8',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Paper elevation={0} sx={{
        p: 4,
        maxWidth: 500,
        width: '100%',
        borderRadius: 2,
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#333333', fontWeight: 600, mb: 3 }}>
          {initialData ? 'Edit Expense' : 'Add New Expense'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    borderColor: '#bdbdbd'
                  },
                  '&.Mui-focused': {
                    borderColor: '#2563eb',
                    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#555555'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2563eb'
                },
                '& .MuiOutlinedInput-input': {
                  color: '#333333'
                }
              }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    borderColor: '#bdbdbd'
                  },
                  '&.Mui-focused': {
                    borderColor: '#2563eb',
                    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#555555'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2563eb'
                },
                '& .MuiOutlinedInput-input': {
                  color: '#333333'
                }
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      borderColor: '#bdbdbd'
                    },
                    '&.Mui-focused': {
                      borderColor: '#2563eb',
                      boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555555'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2563eb'
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#333333'
                  }
                }} />}
              />
            </LocalizationProvider>

            <FormControl fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                '&:hover': {
                  borderColor: '#bdbdbd'
                },
                '&.Mui-focused': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#555555'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#2563eb'
              },
              '& .MuiSelect-select': {
                color: '#333333'
              }
            }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    borderColor: '#bdbdbd'
                  },
                  '&.Mui-focused': {
                    borderColor: '#2563eb',
                    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#555555'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2563eb'
                },
                '& .MuiOutlinedInput-input': {
                  color: '#333333'
                }
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  name="isRecurring"
                  color="primary"
                />
              }
              label="Recurring Expense"
              sx={{ color: '#333333' }}
            />

            {formData.isRecurring && (
              <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    borderColor: '#bdbdbd'
                  },
                  '&.Mui-focused': {
                    borderColor: '#2563eb',
                    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#555555'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2563eb'
                },
                '& .MuiSelect-select': {
                  color: '#333333'
                }
              }}>
                <InputLabel>Frequency</InputLabel>
                <Select
                  name="recurringFrequency"
                  value={formData.recurringFrequency}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            )}

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                borderRadius: 2,
                border: '1px dashed #2563eb',
                py: 1.5,
                color: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  border: '1px dashed #2563eb'
                }
              }}
            >
              Upload Receipt
              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </Button>
            {receipt && (
              <Typography variant="body2" sx={{ color: '#555555' }}>
                Selected file: {receipt.name}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                borderRadius: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
              }}
            >
              {loading ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ExpenseForm; 