import { createMuiTheme } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: { main: blue[700] },
    secondary: { main: grey[700] },
    type: 'light',
  },
});

export { theme };
