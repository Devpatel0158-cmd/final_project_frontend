import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
    Stack,
    Divider,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { ChromePicker } from 'react-color';
import { useCategories } from '../contexts/CategoryContext';

// Styled Components
const ColorPreview = styled(Box)(({ bgcolor }) => ({
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: bgcolor || '#e0e0e0',
    marginRight: 8,
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
}));

const CategoryChip = styled(Chip)(({ bgcolor }) => ({
    backgroundColor: bgcolor || undefined,
    '& .MuiChip-label': {
        color: getContrastTextColor(bgcolor || '#f5f5f5'),
        fontWeight: 500,
    },
}));

// Helper function to determine text color based on background color
function getContrastTextColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

const Categories = () => {
    const { categories, loading, error, addCategory, updateCategory, deleteCategory } = useCategories();
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const [formValues, setFormValues] = useState({
        name: '',
        color: '#2196f3', // Default blue color
        icon: '',
        description: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const handleOpenDialog = (category = null) => {
        if (category) {
            setEditMode(true);
            setSelectedCategory(category);
            setFormValues({
                name: category.name || '',
                color: category.color || '#2196f3',
                icon: category.icon || '',
                description: category.description || '',
            });
        } else {
            setEditMode(false);
            setSelectedCategory(null);
            setFormValues({
                name: '',
                color: '#2196f3',
                icon: '',
                description: '',
            });
        }
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setShowColorPicker(false);
    };

    const handleColorChange = (color) => {
        setFormValues(prev => ({
            ...prev,
            color: color.hex
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formValues.name.trim()) {
            errors.name = 'Category name is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (editMode && selectedCategory) {
                await updateCategory(selectedCategory.id, formValues);
            } else {
                await addCategory(formValues);
            }
            handleCloseDialog();
        } catch (err) {
            console.error('Error saving category:', err);
            setFormErrors(prev => ({
                ...prev,
                general: 'Failed to save category'
            }));
        }
    };

    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteCategory(selectedCategory.id);
            setDeleteConfirmOpen(false);
            setSelectedCategory(null);
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setSelectedCategory(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Category Management
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Organize your expenses by creating and managing categories
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Category
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Categories List */}
            {categories.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        No categories found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Create your first category to better organize your expenses
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Category
                    </Button>
                </Card>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Color</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <ColorPreview bgcolor={category.color} />
                                    </TableCell>
                                    <TableCell>
                                        <CategoryChip
                                            label={category.name}
                                            bgcolor={category.color}
                                        />
                                    </TableCell>
                                    <TableCell>{category.description || '-'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(category)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteClick(category)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Category Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {editMode ? 'Edit Category' : 'Add Category'}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {formErrors.general && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {formErrors.general}
                        </Alert>
                    )}
                    <Box sx={{ my: 2 }}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            name="name"
                            value={formValues.name}
                            onChange={handleInputChange}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Description (Optional)"
                            name="description"
                            value={formValues.description}
                            onChange={handleInputChange}
                            margin="normal"
                            multiline
                            rows={2}
                        />

                        <Box sx={{ mt: 3, mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Category Color
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <ColorPreview
                                    bgcolor={formValues.color}
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                />
                                <TextField
                                    label="Color"
                                    name="color"
                                    value={formValues.color}
                                    onChange={handleInputChange}
                                    size="small"
                                    sx={{ width: 120 }}
                                />
                            </Box>

                            {showColorPicker && (
                                <Box sx={{ mt: 2, mb: 2 }}>
                                    <ChromePicker
                                        color={formValues.color}
                                        onChange={handleColorChange}
                                        disableAlpha
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                    >
                        {editMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Note: Deleting a category will not delete expenses assigned to this category.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Categories; 