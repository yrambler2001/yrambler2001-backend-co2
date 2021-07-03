import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';
import apolloLoader from './apollo';

const proxyToSpotifyServer = proxy('http://localhost:5000/graphql', {
  filter(req) {
    return ['spotifySongsUsersList', 'spotifyUser', 'spotifySongsByUser'].includes(req?.body?.operationName);
  },
  proxyReqPathResolver(req) {
    return req.baseUrl;
  },
});

export default ({ app }) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(express.static(path.join(process.cwd(), 'public')));

  app.use('/graphql', proxyToSpotifyServer);

  apolloLoader({ app });
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // / error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
