const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
});

router.get('/books', async (_, res) => {
  try {
    const books = await Book.list();
    res.json(books);
  } catch (error) {
    res.json({ error: error.message || error.toString() });
  }
});

module.exports = router;
