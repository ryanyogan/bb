/* eslint-disable no-use-before-define */

const mongoose = require('mongoose');
// const generateSlug = require('../utils/slugify');

const { Schema } = mongoose;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },

  githubRepo: {
    type: String,
    required: true,
  },
  githubLastCommitSha: String,

  createdAt: {
    type: Date,
    required: true,
  },
  // price in dollars
  price: {
    type: Number,
    required: true,
  },

  textNearButton: String,

  supportURL: String,
});

class BookClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const books = await this.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    return { books };
  }

  static async getBySlug({ slug }) {
    const bookDoc = await this.findOne({ slug });
    if (!bookDoc) {
      throw new Error('Book not found');
    }

    const book = bookDoc.toObject();

    book.chapters = (await Chapter.find({ bookId: book._id }, 'title slug').sort({
      order: 1,
    })).map((ch) => ch.toObject());

    return book;
  }

  // static async add({ name, price, textNearButton = '', githubRepo, supportURL = '' }) {
  //   const slug = await generateSlug(this, name);

  //   return this.create({
  //     name,
  //     slug,
  //     price,
  //     textNearButton,
  //     githubRepo,
  //     supportURL,
  //     createdAt: new Date(),
  //   });
  // }

  // static async edit({ id, name, price, textNearButton = '', githubRepo, supportURL = '' }) {
  //   const book = await this.findById(id, 'slug name');

  //   if (!book) {
  //     throw new Error('Not found');
  //   }

  //   const modifier = {
  //     price,
  //     textNearButton,
  //     supportURL,
  //     githubRepo,
  //   };

  //   if (name !== book.name) {
  //     modifier.name = name;
  //     modifier.slug = await generateSlug(this, name);
  //   }

  //   const editedBook = await this.findOneAndUpdate(
  //     { _id: id },
  //     { $set: modifier },
  //     { fields: 'slug', new: true },
  //   );

  //   return editedBook;
  // }
}

bookSchema.loadClass(BookClass);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

const Chapter = require('./Chapter');
