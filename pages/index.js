import Head from 'next/head';
import { shape, string } from 'prop-types';
import withLayout from '../lib/withLayout';

const Index = ({ user }) => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index Page</title>
      <meta name="description" content="This is the index page" />
    </Head>
    <p>Index Page Brah</p>
    <p>
      Email:
      {user.email}
    </p>
  </div>
);

Index.getInitialProps = async ({ query }) => ({ user: query.user });

Index.propTypes = {
  user: shape({
    email: string.isRequired,
  }),
};

Index.defaultProps = {
  user: null,
};

export default withLayout(Index);
