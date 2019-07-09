import Head from 'next/head';
import React from 'react';

class Index extends React.Component {
  state = {};

  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Index Page</title>
          <meta name="description" content="This is a description" />
        </Head>
        <p>Content</p>
      </div>
    );
  }
}

export default Index;
