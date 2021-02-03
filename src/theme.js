import { createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import blueGrey from "@material-ui/core/colors/blueGrey";
import { lightGreen, deepOrange } from "@material-ui/core/colors";

const theme = createMuiTheme({
  drawerWidth: 240,
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: blueGrey[500],
    },
    income: {
      main: lightGreen[500],
      light: lightGreen[400],
    },
    expense: {
      main: deepOrange[500],
      light: deepOrange[400],
    },
  },
});

export default theme;
