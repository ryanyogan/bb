import { createGenerateClassName, createMuiTheme } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import { SheetsRegistry } from 'react-jss';

const theme = createMuiTheme({
  palette: {
    primary: { main: blue[700] },
    secondary: { main: grey[700] },
  },
  typography: {
    useNextVariants: true,
  },
});

const createPageContext = () => ({
  theme,
  sheetsManager: new Map(),
  sheetsRegistry: new SheetsRegistry(),
  generateClassName: createGenerateClassName(),
});

const getContext = () => {
  if (!process.browser) {
    return createPageContext();
  }

  if (!global.INIT_MATERIAL_UI) {
    global.INIT_MATERIAL_UI = createPageContext();
  }

  return global.INIT_MATERIAL_UI;
};

export default getContext;
