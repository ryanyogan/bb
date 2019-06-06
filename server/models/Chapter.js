/* eslint-disable no-use-before-define */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const chapterSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isFree: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
    required: true,
  },
  htmlContent: {
    type: String,
    default: '',
    required: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  htmlExcerpt: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  githubFilePath: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
  seoTitle: String,
  seoDescription: String,
  sections: [
    {
      text: String,
      level: Number,
      escapedText: String,
    },
  ],
});

class ChapterClass {
  static async getBySlug({ bookSlug, chapterSlug }) {
    try {
      const book = await Book.getBySlug({ slug: bookSlug });

      if (!book) {
        throw new Error('Book Not Found');
      }

      const chapter = await this.findOne({ bookId: book._id, slug: chapterSlug });

      if (!chapter) {
        throw new Error('Chapter Not Found');
      }

      const chapterObj = chapter.toObject();
      chapterObj.book = book;

      return chapterObj;
    } catch (error) {
      throw new Error(error);
    }
  }
}

chapterSchema.index({ bookId: 1, slug: 1 }, { unique: true });
chapterSchema.index({ bookId: 1, githubFilePath: 1 }, { unique: true });

chapterSchema.loadClass(ChapterClass);

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;

const Book = require('./Book');
