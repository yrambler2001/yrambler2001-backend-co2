/* eslint-disable global-require */

import express from 'express';
import config from './config';

async function startServer() {
  process.on('unhandledRejection', (up) => {
    throw up;
  });

  const app = express();
  await require('./loaders').default({ expressApp: app });
  const apolloServer = require('./apollo').default;
  const server = app.listen(config.port, () => {
    console.info(`
      #############################################
        Server listening on port: ${config.port}
        Address: http://localhost:${config.port}
      ️  GraphQL: http://localhost:${config.port}${apolloServer.graphqlPath}
      #############################################
    `);
  });
  server.on('error', async function onError(err) {
    console.error(err);
    process.exit(1);
  });
}

startServer();
