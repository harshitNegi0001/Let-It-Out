import { createTheme } from '@mui/material';


export const customTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1E1B29',
        },
        secondary: {
            main: '#6E5FAE',
            light: '#F3ECFF'
        },

        text: {
            primary: '#F3ECFF',
            secondary: '#C1B5DD',

        },


    },
    typography: {
        fontFamily: 'Poppins',
        allVariants: {
            color: '#e5d6ffff'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                text: {
                    fontFamily: 'Poppins',
                    textTransform: 'none'
                }
            }

        },
        MuiPickersDay: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.secondary.main + ' !important',
                        color: theme.palette.text.primary + ' !important',
                        
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: theme.palette.secondary.dark + ' !important',
                    },
                }),
            }

        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    '& .MuiButton-root': {
                        color: '#6E5FAE',
                    }
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&.MuiPickersArrowSwitcher-button': {
                        color: '#6E5FAE',
                    }
                }
            }
        },
    }


});