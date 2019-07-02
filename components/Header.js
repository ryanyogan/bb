import { Avatar, Button, Grid, Hidden, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { shape, string } from 'prop-types';
import MenuDrop from './MenuDrop';
import { styleToolbar } from './SharedStyles';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const optionsMenuAdmin = [
  {
    text: 'Admin',
    href: '/admin',
  },
  {
    text: 'Log out',
    href: '/logout',
  },
];

const optionsMenuCustomer = [
  {
    text: 'My Books',
    href: '/customer/my-books',
    as: '/my-books',
  },
  {
    text: 'Log Out',
    href: '/logout',
  },
];

const Header = ({ user }) => (
  <div>
    <Toolbar style={styleToolbar}>
      <Grid container direction="row" justify="space-around" alignItems="center">
        <Grid item sm={9} xs={8} style={{ textAlign: 'left' }}>
          {!user ? (
            <Link prefetch href="/">
              <Avatar
                src="https://storage.googleapis.com/builderbook/logo.svg"
                alt="Builder Book logo"
                style={{ margin: '0px auto 0px 20px', cursor: 'pointer' }}
              />
            </Link>
          ) : null}
        </Grid>
        <Grid item sm={2} xs={2} style={{ textAlign: 'right' }}>
          {user && user.isAdmin && !user.isGithubConnected ? (
            <Hidden smDown>
              <a href="/auth/github">
                <Button variant="contained" color="primary">
                  Connect Github
                </Button>
              </a>
            </Hidden>
          ) : null}
        </Grid>
        <Grid item sm={1} xs={2} style={{ textAlign: 'right' }}>
          {user ? (
            <div style={{ whiteSpace: ' nowrap' }}>
              {!user.isAdmin ? (
                <MenuDrop
                  options={optionsMenuCustomer}
                  src={user.avatarUrl}
                  alt={user.displayName}
                />
              ) : null}
              {user.isAdmin ? (
                <MenuDrop options={optionsMenuAdmin} src={user.avatarUrl} alt={user.displayName} />
              ) : null}
            </div>
          ) : (
            <Link prefetch href="/public/login" as="/login">
              <a style={{ margin: '0px 20px 0px auto' }}>Log in</a>
            </Link>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  </div>
);

Header.propTypes = {
  user: shape({
    avatarUrl: string,
    displayName: string,
  }),
};

Header.defaultProps = {
  user: null,
};

export default Header;
