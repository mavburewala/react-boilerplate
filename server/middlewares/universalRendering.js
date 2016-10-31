import Express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import http from 'http';
import path from 'path';
import url from 'url';
import PrettyError from 'pretty-error';
import { match, createMemoryHistory } from 'react-router';

import configureStore from '../../app/store';
import Html from '../helpers/Html';
import App from '../../app/containers/app';
import createRoutes from '../../app/routes';
import { waitAll } from '../helpers/sagas';
import Root from '../../app/containers/Root/Root';

import { syncHistoryWithStore } from 'react-router-redux';

import { selectLocationState } from '../../app/containers/App/selectors';

// require("babel-polyfill");

// const webpack = require('webpack');
// const webpackConfig = require('../../internals/webpack/webpack.server.babel');
var async = require('asyncawait/async');
var await = require('asyncawait/await');



var foo = async (function() {
  return System.import('intl');
})
const addUniversalRenderingMiddleware = (app, options) => {

    app.use((req, res) => {
      if (__DEVELOPMENT__) {
        webpackIsomorphicTools.refresh();
      }
      const memoryHistory = createMemoryHistory();
      const store = configureStore({}, memoryHistory);

      const allRoutes = {
        component: App,
        childRoutes: createRoutes(store),
      };
      const assets = webpackIsomorphicTools.assets();

      function hydrateOnClient() {
        const htmlComponent = <Html assets={assets} store={store} />;
        const renderedDomString = ReactDOMServer.renderToString(htmlComponent);
        res.send(`<!doctype html>\n ${renderedDomString}`);
      }

      if (__DISABLE_SSR__) {
        hydrateOnClient();
        return;
      }

      match({ routes: allRoutes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          console.error('ROUTER ERROR:', pretty.render(error));
          res.status(500);
          hydrateOnClient();
        } else if (renderProps) {
          const history = syncHistoryWithStore(memoryHistory, store, {
            selectLocationState: selectLocationState(),
          });

          const rootComponent = (<Root
            store={store}
            routes={allRoutes}
            history={history}
            renderProps={renderProps}
            type="server"
          />);
          console.log("renderProps.params: ", renderProps.params);
          const preloaders = renderProps.components
          .filter((component) => component && component.preload)
          .map((component) => component.preload(renderProps.params, req))
          .reduce((result, preloader) => result.concat(preloader), []);

           console.log("PreLoaders: ", preloaders);
          store.runSaga(waitAll(preloaders)).done.then(() => {
            global.navigator = { userAgent: req.headers['user-agent'] };

            const htmlComponent = <Html assets={assets} component={rootComponent} store={store} />;
            const renderedDomString = ReactDOMServer.renderToString(htmlComponent);
            res.status(200).send(`<!doctype html>\n ${renderedDomString}`);
          }).catch((e) => {
            console.log(e.stack);
          });
        } else {
          res.status(404).send('Not found');
        }
      });
    });
};

export default addUniversalRenderingMiddleware;
