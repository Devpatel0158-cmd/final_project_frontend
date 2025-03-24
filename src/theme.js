import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff4081',
            light: '#ff79b0',
            dark: '#c60055',
            contrastText: '#ffffff',
        },
        success: {
            main: '#4caf50',
            light: '#81c784',
            dark: '#388e3c',
        },
        warning: {
            main: '#ff9800',
            light: '#ffb74d',
            dark: '#f57c00',
        },
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
        divider: 'rgba(0, 0, 0, 0.1)',
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: '1rem',
            color: '#1a1a1a',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.875rem',
            color: '#1a1a1a',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '0.75rem',
            color: '#1a1a1a',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.4,
            marginBottom: '0.625rem',
            color: '#1a1a1a',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.4,
            marginBottom: '0.5rem',
            color: '#1a1a1a',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.4,
            marginBottom: '0.5rem',
            color: '#1a1a1a',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            color: '#333333',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: '#666666',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                    textTransform: 'none',
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                    },
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                        },
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '16px',
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: '#f8fafc',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '&.MuiChip-outlined': {
                        borderWidth: 2,
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    height: 8,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme; 