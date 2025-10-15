import { createTheme } from "@mui/material/styles";
import { COLORS } from "./colors";

const theme = createTheme({
    typography: {
        fontFamily: [
          'Roboto', 'Helvetica'
        ].join(','),
      },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
              body: {
                minHeight: '100vh',
                margin: 0,
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '8px', // Ajusta este valor según tus necesidades
                },
              },
            },
          },
        MuiButton: {
          styleOverrides: {
            root: {
                height: '57px',
              borderRadius: '10px',
              boxShadow: '0px 4px 4px #00000040, inset 0px 4px 4px #e2ddd733',
            },
          },
        },
      },
  palette: {
    primary: {
      main: COLORS.primary,
    },
    secondary: {
      main: COLORS.secondary,
    },
  },
});

export default theme;
