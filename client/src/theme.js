import { createTheme } from '@mui/material/styles';

// Color palette
const colors = {
  primary: {
    main: '#3f51b5',
    light: '#757de8',
    dark: '#002984',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#f50057',
    light: '#ff4081',
    dark: '#c51162',
    contrastText: '#ffffff',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  background: {
    light: '#f5f5f5',
    dark: '#121212',
  },
  text: {
    light: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    dark: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
};

// Create theme function that takes a mode parameter (light or dark)
export const createAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      background: {
        default: mode === 'dark' ? colors.background.dark : colors.background.light,
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? colors.text.dark.primary : colors.text.light.primary,
        secondary: mode === 'dark' ? colors.text.dark.secondary : colors.text.light.secondary,
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.8rem',
        fontWeight: 500,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.3rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1.1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'dark' 
              ? '0px 3px 5px -1px rgba(0,0,0,0.3), 0px 6px 10px 0px rgba(0,0,0,0.24), 0px 1px 18px 0px rgba(0,0,0,0.22)'
              : '0px 3px 5px -1px rgba(0,0,0,0.1), 0px 6px 10px 0px rgba(0,0,0,0.08), 0px 1px 18px 0px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'dark'
              ? '0px 2px 4px -1px rgba(0,0,0,0.3), 0px 4px 5px 0px rgba(0,0,0,0.24), 0px 1px 10px 0px rgba(0,0,0,0.22)'
              : '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.07), 0px 1px 10px 0px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              color: mode === 'dark' ? '#ffffff' : 'inherit',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '1.25rem',
            fontWeight: 500,
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  });
};

export default createAppTheme; 