import Head from 'next/head';
import { shape, string } from 'prop-types';
import React from 'react';
import withAuth from '../lib/withAuth';

class Index extends React.Component {
  state = {};

  static propTypes = {
    user: shape({
      email: string.isRequired,
      displayName: string,
    }),
  };

  static defaultProps = {
    user: null,
  };

  render() {
    const { user } = this.props;
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="List of purchased books." />
        </Head>
        <p> Dashboard </p>
        <p>
          Email:
          {` ${user.email}`}
        </p>
      </div>
    );
  }
}

export default withAuth(Index);
