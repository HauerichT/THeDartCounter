import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#398973",
      light: "#64b6a2",
      dark: "#244d3d",
    },
    secondary: {
      main: "#b4435c",
      dark: "#623143",
      light: "#d66e8a",
    },
    text: {
      primary: "#000",
      secondary: "#fff",
    },
  },
});

export default theme;
