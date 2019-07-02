import Router from 'next/router';
import { bool, shape, string } from 'prop-types';
import React from 'react';

let globalUser = null;

const withAuth = (
  Page,
  { loginRequired = true, logoutRequired = false, adminRequired = false } = {},
) => {
  class App extends React.Component {
    static propTypes = {
      user: shape({
        email: string.isRequired,
        displayName: string.isRequired,
        id: string,
        isAdmin: bool,
      }),
      isFromServer: bool.isRequired,
    };

    static defaultProps = {
      user: null,
    };

    componentDidMount() {
      const { user, isFromServer } = this.props;

      if (isFromServer) {
        globalUser = user;
      }

      // If login is required and not logged in, redirect to "/login"
      if (loginRequired && !logoutRequired && !user) {
        Router.push('/public/login', '/login');
      }

      // If logout is required and user logged in, redirect to "/"
      if (logoutRequired && user) {
        Router.push('/');
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        Router.push('/customer/my-books', '/my-books');
      }
    }

    static async getInitialProps(ctx) {
      const isFromServer = !!ctx.req;
      const user = ctx.req ? ctx.req.user && ctx.req.user.toObject() : globalUser;

      if (isFromServer && user) {
        user._id = user._id.toString();
      }

      const props = { user, isFromServer };

      if (Page.getInitialProps) {
        Object.assign(props, (await Page.getInitialProps(ctx)) || {});
      }

      return props;
    }

    render() {
      const { user } = this.props;

      if (loginRequired && !logoutRequired && !user) {
        return null;
      }

      if (logoutRequired && user) {
        return null;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        return null;
      }

      return <Page {...this.props} />;
    }
  }

  return App;
};

export default withAuth;
