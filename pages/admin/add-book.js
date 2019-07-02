import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import EditBook from '../../components/admin/EditBook';
import { addBook, syncBookContent } from '../../lib/api/admin';
import notify from '../../lib/notifier';
import withAuth from '../../lib/withAuth';
import withLayout from '../../lib/withLayout';

const addBookOnSave = async (data) => {
  NProgress.start();

  try {
    const book = await addBook(data);
    notify('Saved Book');

    try {
      const bookId = book._id;
      await syncBookContent({ bookId });
      notify('Book Synced');
      NProgress.done();
      Router.push(`/admin/book-detaul?slug=${book.slug}`, `/admin/book-detail/${book.slug}`);
    } catch (err) {
      notify(err);
      NProgress.done();
    }
  } catch (error) {
    notify(error);
    NProgress.done();
  }
};

const AddBook = () => (
  <div style={{ padding: '10px 45px' }}>
    <EditBook onSave={addBookOnSave} />
  </div>
);

export default withAuth(withLayout(AddBook));
