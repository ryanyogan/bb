import { Avatar, Grid, Hidden, Toolbar } from '@material-ui/core';
import Link from 'next/link';
import { shape, string } from 'prop-types';
import MenuDrop from './MenuDrop';
import { styleToolbar } from './SharedStyles';

const optionsMenu = [
  {
    text: 'Got Questions?',
    href: 'http://github.com',
  },
  {
    text: 'Log out',
    href: '/logout',
  },
];

const Header = ({ user }) => (
  <div>
    <Toolbar style={styleToolbar}>
      <Grid container direction="row" justify="space-around" align="center">
        <Grid item sm={10} xs={9} style={{ textAlign: 'left' }}>
          {user ? (
            <div>
              <Hidden smDown>
                <Link prefetch href="/">
                  <a style={{ marginRight: '20px' }}>Settings</a>
                </Link>
              </Hidden>
            </div>
          ) : (
            <Link prefetch href="/">
              <Avatar
                src="https://storage.googleapis.com/builderbook/logo.svg"
                alt="Builder Book logo"
                style={{ margin: '0px auto 0px 20px' }}
              />
            </Link>
          )}
        </Grid>
        <Grid item sm={1} xs={3} style={{ textAlign: 'right' }}>
          {user ? (
            <div style={{ whiteSpace: 'nowrap' }}>
              {user.avatarUrl && (
                <MenuDrop options={optionsMenu} src={user.avatarUrl} alt={user.displayName} />
              )}
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
