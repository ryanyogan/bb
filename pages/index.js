import Head from 'next/head';
import { shape, string } from 'prop-types';
import React from 'react';

class Index extends React.Component {
  state = {};

  static propTypes = {
    user: shape({
      email: string.isRequired,
    }),
  };

  static defaultProps = {
    user: null,
  };

  static async getInitialProps(ctx) {
    return {
      user: ctx.query.user,
    };
  }

  static getInitialProps = async (ctx) => ({
    user: ctx.query.user,
  });

  render() {
    const { user } = this.props;
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Index Page</title>
          <meta name="description" content="This is a description" />
        </Head>
        <p>Content</p>
        <p>
          Email:
          {` ${user.email}`}
        </p>
      </div>
    );
  }
}

export default Index;
