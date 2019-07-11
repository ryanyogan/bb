const express = require('express');
const next = require('next');

const PORT = process.env.PORT || 8000;
const ROOT_URL = `http://localhost:${PORT}`;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/', (req, res) => {
    const user = { email: 'ryanyogan@gmail.com' };
    app.render(req, res, '/', { user });
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line
  });
});
