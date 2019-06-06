const express = require('express');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');

const router = express.Router();

router.get('/books', async (req, res) => {
  try {
    const books = await Book.list();
    res.json(books);
  } catch (error) {
    res.json({ error: error.message || error.toString() });
  }
});

router.get('/books/:slug', async (req, res) => {
  try {
    const book = await Book.getBySlug({ slug: req.params.slug, userId: req.user && req.user.id });
    res.json(book);
  } catch (error) {
    res.json({ error: error.message || error.toString() });
  }
});

router.get('/get-chapter-detail', async (req, res) => {
  try {
    const { bookSlug, chapterSlug } = req.query;
    const chapter = await Chapter.getBySlug({
      bookSlug,
      chapterSlug,
    });
    res.json(chapter);
  } catch (error) {
    res.json({ error: error.message || error.toString() });
  }
});

module.exports = router;
