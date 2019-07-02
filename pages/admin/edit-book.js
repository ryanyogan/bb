import Error from 'next/error';
import Router from 'next/router';
import NProgress from 'nprogress';
import { string } from 'prop-types';
import React from 'react';
import EditBookComp from '../../components/admin/EditBook';
import { editBook, getBookDetail } from '../../lib/api/admin';
import notify from '../../lib/notifier';
import withAuth from '../../lib/withAuth';
import withLayout from '../../lib/withLayout';

class EditBook extends React.Component {
  static propTypes = {
    slug: string.isRequired,
  };

  static getInitialProps({ query }) {
    return { slug: query.slug };
  }

  state = {
    error: null,
    book: null,
  };

  async componentDidMount() {
    NProgress.start();

    const { slug } = this.props;

    try {
      const book = await getBookDetail({ slug });
      this.setState({ book });
      NProgress.done();
    } catch (error) {
      this.setState({ error: error.message || error.toString() });
      NProgress.done();
    }
  }

  editBookOnSave = async (data) => {
    const { book } = this.state;
    NProgress.start();

    try {
      const editedBook = await editBook({ ...data, id: book._id });
      notify('Saved Book');
      Router.push(
        `/admin/book-detail?slug=${editedBook.slug}`,
        `/admin/book-detail/${editedBook.slug}`,
      );
    } catch (error) {
      notify(error);
      NProgress.done();
    }
  };

  render() {
    const { book, error } = this.state;

    if (error) {
      notify(error);
      return <Error statusCode={500} />;
    }

    if (!book) {
      return null;
    }

    return (
      <div>
        <EditBookComp onSave={this.editBookOnSave} book={book} />
      </div>
    );
  }
}

export default withAuth(withLayout(EditBook));
