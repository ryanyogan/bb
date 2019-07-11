/* eslint-disable no-use-before-define */

const mongoose = require('mongoose');
const generateSlug = require('../utils/slugify');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  price: {
    type: Number,
    required: true,
  },
  githubRepo: {
    type: String,
    required: true,
  },
  githubLastCommitSha: String,
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
    const bookDocument = await this.findOne({ slug });
    if (!bookDocument) {
      throw new Error('Book not found');
    }

    const book = bookDocument.toObject();

    book.chapters = (await Chapter.find({ bookId: book._id }, 'title slug').sort({ order: 1 })).map(
      (chapter) => chapter.toObject(),
    );

    return book;
  }

  static async add({ name, price, githubRepo }) {
    const slug = await generateSlug(this, name);

    if (!slug) {
      throw new Error(`Error with slug generation for name: ${name}`);
    }

    return this.create({
      name,
      slug,
      price,
      githubRepo,
    });
  }

  static async edit({ id, name, price, githubRepo }) {
    const book = await this.findById(id, 'slug name');

    if (!book) {
      throw new Error('Book is not found by id');
    }

    const modifer = { price, githubRepo };

    if (name !== book.name) {
      modifer.name = name;
      modifer.slug = await generateSlug(this, name);
    }

    const editedBook = await this.findOneAndUpdate(
      { _id: id },
      { $set: modifer },
      { fields: 'slug', new: true },
    );

    return editedBook;
  }
}

mongoSchema.loadClass(BookClass);

const Book = mongoose.model('Book', mongoSchema);

module.exports = Book;

const Chapter = require('./Chapter');
