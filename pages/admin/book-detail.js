import { Button } from '@material-ui/core';
import Error from 'next/error';
import Link from 'next/link';
import NProgress from 'nprogress';
import { shape, string } from 'prop-types';
import React from 'react';
import { getBookDetail, syncBookContent } from '../../lib/api/admin';
import notify from '../../lib/notifier';
import withAuth from '../../lib/withAuth';
import withLayout from '../../lib/withLayout';

const handleSyncContent = (bookId) => async () => {
  try {
    await syncBookContent({ bookId });
    notify('Synced Github Content');
  } catch (error) {
    notify(error);
  }
};

const MyBook = ({ book, error }) => {
  if (error) {
    notify(error);
    return <Error statusCode={500} />;
  }

  if (!book) {
    return null;
  }

  const { chapters = [] } = book;

  return (
    <div style={{ padding: '10px 45px' }}>
      <h2>{book.name}</h2>
      <a href={`https://github.com/${book.githubRepo}`} target="_blank" rel="noopener noreferrer">
        Repo on Github
      </a>
      <p />
      <Button raised onClick={handleSyncContent(book._id)}>
        Sync with Github
      </Button>
      <Link as={`/admin/edit-book/${book.slug}`} href={`/admin/edit-book?slug=${book.slug}`}>
        <Button raised>Edit book</Button>
      </Link>
      <ul>
        {chapters.map((ch) => (
          <li key={ch._id}>
            <Link
              as={`/books/${book.slug}/${ch.slug}`}
              href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${ch.slug}`}
            >
              <a>{ch.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

MyBook.propTypes = {
  book: shape({
    name: string.isRequired,
  }),
  error: string,
};

MyBook.defaultProps = {
  book: null,
  error: null,
};

class MyBookWithData extends React.Component {
  static propTypes = {
    slug: string.isRequired,
  };

  static getInitialProps({ query }) {
    return { slug: query.slug };
  }

  state = {
    loading: true,
    error: null,
    book: null,
  };

  async componentDidMount() {
    NProgress.start();
    try {
      const { slug } = this.props;
      const book = await getBookDetail({ slug });
      this.setState({ book, loading: false });
      NProgress.done();
    } catch (err) {
      this.setState({ loading: false, error: err.message || err.toString() });
      NProgress.done();
    }
  }

  render() {
    return <MyBook {...this.props} {...this.state} />;
  }
}

export default withAuth(withLayout(MyBookWithData));
