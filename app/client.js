// Needed for redux-saga es6 generator support
import 'babel-polyfill';

/* eslint-disable import/no-unresolved */
// Load the favicon, the manifest.json file and the .htaccess file
import 'file?name=[name].[ext]!./favicon.ico';
import '!file?name=[name].[ext]!./manifest.json';
import 'file?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved */

import React from 'react';
import ReactDOM from 'react-dom';
import GoogleAnalytics from 'react-ga';
import _ from 'lodash';
import { getStoredState, createPersistor } from 'redux-persist';

import { Provider } from 'react-redux';

import Root from './containers/Root/Root';
import rootSaga from './modules/rootSaga';
// import config from './config';
// GoogleAnalytics.initialize(config.app.googleAnalytics.appId);


// Import all the third party stuff
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import FontFaceObserver from 'fontfaceobserver';
import { useScroll } from 'react-router-scroll';
import configureStore from './store';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
import styles from 'containers/App/styles.css';
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
!!document && openSansObserver.load().then(() => {
  document.body.classList.add(styles.fontLoaded);
}, () => {
  document.body.classList.remove(styles.fontLoaded);
});

// Import i18n messages
import { translationMessages } from './i18n';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
// const initialState = {};

const persistConfig = {

};


let initialState = window.__data; // eslint-disable-line
try {
  const restoredState = await getStoredState(persistConfig);
  initialState = _.merge({}, initialState, restoredState);
} catch (error) {
  console.log('error restoring state:', error);
}
const store = configureStore(initialState, browserHistory);

const dest = document.getElementById('content');
const persistor = createPersistor(store, persistConfig); // eslint-disable-line

// If you use Redux devTools extension, since v2.0.1, they added an
// `updateStore`, so any enhancers that change the store object
// could be used with the devTools' store.
// As this boilerplate uses Redux & Redux-Saga, the `updateStore` is needed
// if you want to `take` actions in your Sagas, dispatched from devTools.
if (window.devToolsExtension) {
  window.devToolsExtension.updateStore(store);
}

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
import { selectLocationState } from 'containers/App/selectors';
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

// Set up the router, wrapping all Routes in the App component
import App from 'containers/App';
import createRoutes from './routes';
const rootRoute = {
  component: App,
  childRoutes: createRoutes(store),
};


async function renderClient(messages) {
  ReactDOM.render(
    <Root store={store} history={history} routes={rootRoute} messages={messages} />,
    dest
  );

  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger
  }
}
// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(System.import('intl'));
  }))
    .then(() => Promise.all([
      System.import('intl/locale-data/jsonp/en.js'),
      System.import('intl/locale-data/jsonp/de.js'),
    ]))
    .then(() => renderClient(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  renderClient(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
import { install } from 'offline-plugin/runtime';
install();
