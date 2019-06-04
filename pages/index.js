import Head from 'next/head';
import { shape, string } from 'prop-types';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';

const Index = ({ user }) => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Dashboard</title>
      <meta name="description" content="This is the index page" />
    </Head>
    <p>Dashboard</p>
    <p>
      Email:
      {user.email}
    </p>
  </div>
);

Index.propTypes = {
  user: shape({
    email: string.isRequired,
    displayName: string.isRequired,
  }),
};

Index.defaultProps = {
  user: null,
};

export default withAuth(withLayout(Index));
