import Link from 'next/link';
import { arrayOf, shape, string } from 'prop-types';
import React from 'react';
import { getBookList } from '../../lib/api/admin';
import notify from '../../lib/notifier';
import withAuth from '../../lib/withAuth';
import withLayout from '../../lib/withLayout';

const Index = ({ books }) => (
  <div style={{ padding: '10px 45px' }}>
    <div>
      <h2>Books</h2>
      <ul>
        {books &&
          books.map((book) => (
            <li key={book._id}>
              <Link
                as={`/admin/book-detail/${book.slug}`}
                href={`/admin/book-detail?slug=${book.slug}`}
              >
                <a>{book.name}</a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  </div>
);

Index.propTypes = {
  books: arrayOf(
    shape({
      name: string.isRequired,
      slug: string.isRequired,
    }),
  ).isRequired,
};

class IndexWithData extends React.Component {
  state = {
    books: [],
  };

  async componentDidMount() {
    try {
      const { books } = await getBookList();

      this.setState({ books });
    } catch (err) {
      notify(err);
    }
  }

  render() {
    return <Index {...this.state} />;
  }
}

export default withAuth(withLayout(IndexWithData), { adminRequired: true });
