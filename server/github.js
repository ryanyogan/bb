const qs = require('qs');
const request = require('request');
const GithubAPI = require('@octokit/rest');

const User = require('./models/User');

const AUTHORIZE_URI = 'https://github.com/login/oauth/authorize';
const TOKEN_URI = 'https://github.com/login/oauth/access_token';

const setupGithub = ({ server }) => {
  const dev = process.env.NODE_ENV !== 'production';

  const CLIENT_ID = dev ? process.env.Github_Test_ClientID : process.env.Github_Live_ClientID;
  const API_KEY = dev ? process.env.Github_Test_SecretKey : process.env.Gtihub_Live_SecretLey;

  server.get('/auth/github', (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      res.redirect('/login');
    }

    res.redirect(
      `${AUTHORIZE_URI}?${qs.stringify({
        scope: 'repo',
        state: req.session.state,
        client_id: CLIENT_ID,
      })}`,
    );
  });

  server.get('/auth/github/callback', (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      res.redirect('/login');
      return;
    }

    if (req.query.error) {
      res.redirect(`/admin?error=${req.query.error_desc}`);
    }

    const { code } = req.query;

    request.post(
      {
        uri: TOKEN_URI,
        headers: { Accept: 'application/json' },
        form: {
          client_id: CLIENT_ID,
          code,
          client_secret: API_KEY,
        },
      },
      async (err, _response, body) => {
        if (err) {
          res.redirect(`/admin/error=${err.message || err.toString()}`);
        }

        const result = JSON.parse(body);

        if (result.error) {
          res.redirect(`/admin/error=${result.error_description}`);
          return;
        }

        try {
          await User.updateOne(
            { _id: req.user.id },
            { $set: { isGithubConnected: true, githubAccessToken: result.access_token } },
          );
          res.redirect('/admin');
        } catch (err2) {
          res.redirect(`/admin?error=${err2.message || err2.toString()}`);
        }
      },
    );
  });
};

const getAPI = ({ accessToken }) => {
  const github = new GithubAPI({
    timeout: 10000,
    host: 'api.github.com',
    protocolo: 'https',
    headers: {
      accept: 'application/json',
    },
    requestMedia: 'application/json',
  });

  github.authenticate({
    type: 'oauth',
    token: accessToken,
  });

  return github;
};

const getRepos = ({ accessToken }) => {
  const github = getAPI({ accessToken });

  return github.repos.list({ per_page: 100 });
};

const getContent = ({ accessToken, repoName, path }) => {
  const github = getAPI({ accessToken });
  const [owner, repo] = repoName.split('/');

  return github.repos.getContents({ owner, repo, path });
};

const getCommits = ({ accessToken, repoName, limit }) => {
  const github = getAPI({ accessToken });
  const [owner, repo] = repoName.split('/');

  return github.repos.listCommits({ owner, repo, per_page: limit });
};

exports.setupGithub = setupGithub;
exports.getRepos = getRepos;
exports.getContent = getContent;
exports.getCommits = getCommits;
