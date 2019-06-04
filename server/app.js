require('dotenv').config();

const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoSessionStore = require('connect-mongo');

const auth = require('./google');
const logger = require('./logs');

const { insertTemplates } = require('./models/EmailTemplate');

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(MONGO_URL, options);

const port = process.env.PORT || 8000;
const ROOT_URL = `http://localhost:${port}`;

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async () => {
    const server = express();
    const MongoStore = mongoSessionStore(session);

    const sessionConfig = {
      name: 'builderbook.sid',
      secret: 'asdasdasdkjasdkadjasdjadk/dffsf/',
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60, // save session for 14 days
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
      },
    };

    server.use(session(sessionConfig));

    await insertTemplates();

    auth({ server, ROOT_URL });

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) throw err;
      logger.info(`> Ready on ${ROOT_URL}`);
    });
  })
  .catch((err) => console.log(err)); // eslint-disable-line
