import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import session from 'express-session';
import csurf from 'csurf';
import favicon from 'serve-favicon';
import serverTiming from 'server-timing';
import { transform } from 'lodash/fp';
import config from './configs';
import { apiGateway, offloadDetector, reduxApp } from './middlewares';

export default function renderer({ clientStats, server, sessionStore, promises }) {
  const app = express.Router();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded(config.bodyParser.urlencoded));
  app.use(cookieParser(config.cookieParser));
  app.use(session({ store: sessionStore, ...config.session }));
  app.use(csurf(config.csurf));
  app.use(serverTiming());
  app.use(favicon(config.favicon));

  if (!__DEVELOPMENT__) {
    const gzipFiles = transform((result, asset) => {
      const match = /(\.[^.]*)\.gz/.exec(asset.name);
      if (match) {
        result[`/${asset.name}`] = match[1];
      }
    }, {}, clientStats.assets);
    app.use(clientStats.publicPath, (req, res, next) => {
      const fileType = gzipFiles[req.url + '.gz'];
      if (fileType) {
        res.type(fileType);
        res.set('Content-Encoding', 'gzip');
        req.url += '.gz';
      }
      return next();
    });
  }

  config.assets.forEach((asset) => {
    app.use(asset.mount, express.static(asset.path));
  });

  app.use(config.clientConfig.fetchr.xhrPath, apiGateway(config));
  app.use(compression());
  app.use(offloadDetector(config.offload));
  app.use(reduxApp({ ...config, clientStats, promises }));

  return app;
}
