import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { object } from 'prop-types';
import React from 'react';
import Header from '../components/Header';
import getContext from './context';

const withLayout = (BaseComponent) => {
  class App extends React.Component {
    static propTypes = {
      pageContext: object, // eslint-disable-line
    };

    static defaultProps = {
      pageContext: null,
    };

    static getInitialProps = (ctx) => {
      if (BaseComponent.getInitialProps) {
        return BaseComponent.getInitialProps(ctx);
      }

      return {};
    };

    constructor(props) {
      super(props);
      const { pageContext } = this.props;
      this.pageContext = pageContext || getContext();
    }

    componentDidMount() {
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <MuiThemeProvider
          theme={this.pageContext.theme}
          sheetsManager={this.pageContext.sheetsManager}
        >
          <CssBaseline />
          <div>
            <Header {...this.props} />
            <BaseComponent {...this.props} />
          </div>
        </MuiThemeProvider>
      );
    }
  }

  return App;
};

export default withLayout;
