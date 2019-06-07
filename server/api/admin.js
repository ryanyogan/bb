const express = require('express');

const logger = require('../logs');
const { getRepos } = require('../github');

const Book = require('../models/Book');
const User = require('../models/User');

const router = express.Router();

const errorMessage = ({ error, res }) => {
  logger.error(error);
  res.status(500).json({ error: error.message || error.toString() });
};

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
    errorMessage({ error, res });
  }
});

router.post('/books/add', async (req, res) => {
  try {
    const book = await Book.add(Object.assign({ userId: req.user.id }, req.body));
    res.json(book);
  } catch (error) {
    errorMessage({ error, res });
  }
});

router.post('/books/edit', async (req, res) => {
  try {
    const editedBook = await Book.edit(req.body);
    res.json(editedBook);
  } catch (error) {
    errorMessage({ error, res });
  }
});

router.post('/books/sync-content', async (req, res) => {
  const { bookId } = req.body;
  const user = await User.findById(req.user._id, 'isGithubConnected githubAccessToken');

  if (!user.isGithubConnected || !user.githubAccessToken) {
    res.json({ error: 'Please connect to a Github repository' });
    return;
  }

  try {
    await Book.syncContent({ id: bookId, githubAccessToken: user.githubAccessToken });
    res.json({ done: 1 });
  } catch (error) {
    errorMessage({ error, res });
  }
});

router.get('/books/detail/:slug', async (req, res) => {
  try {
    const book = await Book.getBySlug({ slug: req.params.slug });
    res.json(book);
  } catch (error) {
    errorMessage({ error, res });
  }
});

router.get('/github/repos', async (req, res) => {
  const user = await User.findById(req.user._id, 'isGithubConnected githubAccessToken');

  if (!user.isGithubConnected || !user.githubAccessToken) {
    res.json({ error: 'Please connect to a Github repository' });
    return;
  }

  try {
    const { data: repos } = await getRepos({ accessToken: user.githubAccessToken });
    res.json({ repos });
  } catch (error) {
    errorMessage({ error, res });
  }
});

module.exports = router;
