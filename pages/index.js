import { Button } from '@material-ui/core';
import Head from 'next/head';
import withLayout from '../lib/withLayout';

const Index = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index Page</title>
      <meta name="description" content="This is the index page" />
    </Head>
    <p>Index Page Brah</p>
    <Button variant="contained">MUI</Button>
  </div>
);

export default withLayout(Index);
