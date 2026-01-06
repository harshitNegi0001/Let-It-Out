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
    }


});