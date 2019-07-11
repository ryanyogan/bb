import Link from 'next/link';
import { arrayOf, shape, string } from 'prop-types';
import React, { Component } from 'react';
import { getBookList } from '../../lib/api/admin';
import notify from '../../lib/notifier';
import withAuth from '../../lib/withAuth';

const Index = ({ books }) => (
  <div style={{ padding: '10px 45px' }}>
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((book) => (
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

class IndexWithData extends Component {
  state = {
    books: [],
  };

  async componentDidMount() {
    try {
      const { books } = await getBookList();
      this.setState({ books });
    } catch (error) {
      notify(error);
    }
  }

  render() {
    return <Index {...this.state} />;
  }
}

export default withAuth(IndexWithData, { adminRequired: true });
